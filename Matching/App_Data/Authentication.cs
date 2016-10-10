using System;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Net;
using System.IO;
using System.Text;
using Newtonsoft.Json.Linq;

namespace Matching {

    public static class Authentication {

        /// <summary>
        /// Fetches the public encryption key using the provided key index, from
        /// the Google X509 API.
        /// </summary>
        /// 
        /// <param name="kid">
        /// Index of the public key to fetch.
        /// </param>
        /// 
        /// <exception cref="ArgumentException">
        /// Thrown when a key with the specified kid was not found at the API
        /// endpoint.
        /// </exception>
        /// 
        /// <returns>
        /// The public encryption key, or <c>null</c> if not found.
        /// </returns>
        private static string GetX509SecurityCertificate(string kid) {
            string cert = null;

            // Create HTTP request to fetch current X509 public keys
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(
                Properties.Settings.Default.GoogleX509ApiUrl
            );

            // TODO: Can cache these keys, and then check if they are expired

            try {
                JObject jsonObject;
                JToken jsonToken;

                // Read data from response stream
                using (Stream responseStream = request.GetResponse().GetResponseStream()) {
                    StreamReader reader = new StreamReader(responseStream, Encoding.UTF8);
                    jsonObject = JObject.Parse(reader.ReadToEnd());
                }

                // Parse JSON data
                if (jsonObject.TryGetValue(kid, out jsonToken)) {
                    const string HEADER = "-----BEGIN CERTIFICATE-----";
                    const string FOOTER = "-----END CERTIFICATE-----";

                    cert = jsonToken.ToString();

                    // Get rid of -----BEGIN/END CERTIFICATE-----
                    int from = cert.IndexOf(HEADER) + HEADER.Length;
                    int to = cert.LastIndexOf(FOOTER);

                    cert = cert.Substring(from, to - from);
                }
                // Throw argument exception if key not found
                else {
                    throw new ArgumentException(
                        "Public key with index " + kid + " was not found.",
                        "kid"
                    );
                }
            }
            catch (Exception ex) {
                // TODO: Could handle errors in future
            }

            return cert;
        }

        public static string VerifyIdToken(string idToken, DateTime receivedAt) {
            JwtSecurityTokenHandler handler = new JwtSecurityTokenHandler();
            JwtSecurityToken jwtToken = handler.ReadJwtToken(idToken);
            SecurityToken token;
            string uid = null;

            /*
             * Note:
             * 
             * Ok please don't use Microsoft.IdentityModel for firebase server-side token auth...
             * So it works pretty well in general, albeit a little outdated.
             * If you're trying to verify an RS256 signature of a token using a public key, however, you're basically screwed.
             * There seems to be no way to natively do this within the library, even though it seems so trivial and commonplace.
             * The worst part? This is the only library that provides payload verification which we ALSO need.
             * So yeah, godspeed to anyone who has to work with this.
             */

            // Check that algorithm is RS256
            if (Properties.Settings.Default.FirebaseTokenAlgorithm != jwtToken.Header.Alg) {
                throw new ArgumentException(
                    "Provided JWT token is not encrypted with " + Properties.Settings.Default.FirebaseTokenAlgorithm + ".",
                    "idToken"
                ) {
                    Source = "GetX509SecurityCertificate"
                };
            }

            // Set up validation parameters
            TokenValidationParameters validationParams = new TokenValidationParameters() {
                ValidAudience = Properties.Settings.Default.FirebaseProjectID,
                ValidateAudience = true,

                ValidIssuer = Properties.Settings.Default.FirebaseIssuerURL,
                ValidateIssuer = true,

                LifetimeValidator = (iat, exp, tok, val) => (
                    (receivedAt >= iat) && (receivedAt < exp)
                ),
                ValidateLifetime = true
            };

            try {
                // Check that kid corresponds to public key
                string x509cert = GetX509SecurityCertificate(jwtToken.Header.Kid);

                // TODO:
                // Setup validationParams.SignatureValidator

                // Validate token
                handler.ValidateToken(idToken, validationParams, out token);

                uid = ((JwtSecurityToken)token).Subject;
            }
            // Handle exception from GetX509SecurityCertificate
            catch (ArgumentException ex) when ("GetX509SecurityCertificate" == ex.Source) {
                throw new ArgumentException(
                    "Provided JWT token has invalid kid parameter.",
                    "idToken",
                    ex
                );
            }
            // TODO: handle specific exceptions
            catch (Exception ex) {
                Console.WriteLine("Exception: {0}", ex.GetType().ToString());
                Console.WriteLine("Message:   {0}", ex.Message);
                Console.WriteLine("Stacktrace:\n{0}", ex.StackTrace);
            }

            return uid;
        }
    }
}