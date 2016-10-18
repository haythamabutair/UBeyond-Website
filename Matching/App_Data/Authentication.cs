using System;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Net;
using System.IO;
using System.Text;
using Newtonsoft.Json.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;

namespace Matching {

    public static class Authentication {

        public enum ValidationResult {
            VALIDATED = 0,

            /// <summary>
            /// Denotes the token was not encrypted with the RS256 algorithm.
            /// </summary>
            TOKEN_INVALID_ALG,

            /// <summary>
            /// Denotes the token has a kid that does not correspond to a valid public key.
            /// </summary>
            TOKEN_INVALID_KID,

            /// <summary>
            /// Denotes the token has expired.
            /// </summary>
            TOKEN_EXPIRED,

            /// <summary>
            /// Denotes the token was issued by a non-valid source.
            /// </summary>
            TOKEN_INVALID_ISSUER,
            
            /// <summary>
            /// Denotes the token was targeting a non-valid audience.
            /// </summary>
            TOKEN_INVALID_AUDIENCE,

            /// <summary>
            /// Denotes that validation failed for an unknown or unexpected reason.
            /// </summary>
            UNKOWN_FAILURE
        }

        private static bool IsAlgorithmValid(string alg) {
            return alg.Equals(Properties.Settings.Default.FirebaseTokenAlgorithm);
        }

        /// <summary>
        /// Checks for the existance of a public encryption key using the
        /// provided key index, from the Google X509 API.
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
        /// <c>true</c> if the key was found, else <c>false</c>.
        /// </returns>
        private static bool IsSigningKeyValid(string kid) {
            // Create HTTP request to fetch current X509 public keys
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(
                Properties.Settings.Default.GoogleX509ApiUrl
            );

            JObject jsonObject;
            JToken jsonToken;

            // Read data from response stream | TODO: Can cache these keys
            using (Stream responseStream = request.GetResponse().GetResponseStream()) {
                StreamReader reader = new StreamReader(responseStream, Encoding.UTF8);
                jsonObject = JObject.Parse(reader.ReadToEnd());
            }

            // Commented out since we are not returning the key anymore
            //try {
            //    // Parse JSON data
            //    if (jsonObject.TryGetValue(kid, out jsonToken)) {
            //        const string HEADER = "-----BEGIN CERTIFICATE-----";
            //        const string FOOTER = "-----END CERTIFICATE-----";

            //        cert = jsonToken.ToString();

            //        // Get rid of -----BEGIN/END CERTIFICATE-----
            //        int from = cert.IndexOf(HEADER) + HEADER.Length;
            //        int to = cert.LastIndexOf(FOOTER);

            //        cert = cert.Substring(from, to - from);
            //    }
            //    // Throw argument exception if key not found
            //    else {
            //        throw new ArgumentException(
            //            "Public key with index " + kid + " was not found.",
            //            "kid"
            //        );
            //    }
            //}
            //catch (Exception ex) {
            //    // TODO: Could handle errors in future
            //}

            return jsonObject.TryGetValue(kid, out jsonToken);
        }

        private static bool IsTokenLifetimeValid(DateTime received, DateTime issued, DateTime expiry) {
            Console.WriteLine("R:{0}\nI:{1}\nE:{2}", received, issued, expiry);
            return received >= issued && received < expiry;
        }

        private static bool IsIssuerValid(string issuer) {
            return issuer.Equals(Properties.Settings.Default.FirebaseIssuerURL);
        }

        private static bool IsAudienceValid(IList<string> audiences) {
            bool valid = false;

            // Check that the only audience is our firebase project
            if (audiences.Count == 1) {
                valid = audiences[0].Equals(Properties.Settings.Default.FirebaseProjectID);
            }

            return valid;
        }

        /// <summary>
        /// Validates a received JWT idToken, and writes the token's uid to uid.
        /// </summary>
        /// 
        /// <param name="idToken">
        /// The JWT token to validate.
        /// </param>
        /// 
        /// <param name="received">
        /// The <c>DateTime</c> the token was received.
        /// </param>
        /// 
        /// <param name="uid">
        /// A <c>string</c> that will be populated with the token's uid if
        /// validated.
        /// </param>
        /// 
        /// <returns>
        /// <c>ValidationResult.VALIDATED</c> if successful, else some
        /// <c>ValidationResult</c> denoting what validation step failed.
        /// </returns>
        public static ValidationResult ValidateIdToken(string idToken, DateTime received, out string uid) {
            JwtSecurityTokenHandler handler = new JwtSecurityTokenHandler();
            JwtSecurityToken token = handler.ReadJwtToken(idToken);

            // Convert issuing and expiration dates to DateTime (Iat and Exp in seconds since UNIX Epoch)
            DateTime issued = Properties.Settings.Default.Epoch.AddSeconds((double)token.Payload.Iat);
            DateTime expiry = Properties.Settings.Default.Epoch.AddSeconds((double)token.Payload.Exp);

            // Return value
            ValidationResult status = ValidationResult.VALIDATED;

            // Set uid to null in case of failure
            uid = null;

            // Check that algorithm is RS256
            if (!IsAlgorithmValid(token.Header.Alg)) {
                status = ValidationResult.TOKEN_INVALID_ALG;
            }
            // Check that the issuer signing key is valid
            else if (!IsSigningKeyValid(token.Header.Kid)) {
                status = ValidationResult.TOKEN_INVALID_KID;
            }
            // Check that token is not expired
            else if (!IsTokenLifetimeValid(received.ToUniversalTime(), issued, expiry)) {
                status = ValidationResult.TOKEN_EXPIRED;
            }
            // Validate issuer
            else if (!IsIssuerValid(token.Payload.Iss)) {
                status = ValidationResult.TOKEN_INVALID_ISSUER;
            }
            // Validate audience
            else if (!IsAudienceValid(token.Payload.Aud)) {
                status = ValidationResult.TOKEN_INVALID_AUDIENCE;
            }
            // Token has been validated
            else {
                uid = token.Payload.Sub;
                status = ValidationResult.VALIDATED;
            }

            return status;
        }
    }
}