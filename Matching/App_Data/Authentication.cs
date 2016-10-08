using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Web;
using Microsoft.IdentityModel.Tokens;
using System.Net;
using System.IO;
using System.Text;
using Newtonsoft.Json.Linq;

namespace Matching {

    public static class Authentication {

        private static string GetX509SecurityCertificates(string kid) {
            string cert = null;
            const string URL = "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com";

            // Fetch data from endpoint
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(URL);
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
                    cert = jsonToken.ToString();
                    // TODO fetch between -----BEGIN CERTIFICATE----- and -----END CERTIFICATE-----
                }
                else {
                    // Failed because value not found
                }
            }
            catch (Exception ex) {
                //TODO
                Console.WriteLine(ex.StackTrace.ToString());
            }

            return cert;
        }

        public static string VerifyIdToken(string idToken) {
            JwtSecurityTokenHandler handler = new JwtSecurityTokenHandler();
            JwtSecurityToken token = handler.ReadJwtToken(idToken);
            //X509SecurityKey publicKey = new X509SecurityKey();
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
            string cert = GetX509SecurityCertificates("87571901d6986cae36ceffeee6243c78190ec4ff");
            Console.WriteLine("cert: {0}", cert);
            return "test";
        }

    }
}