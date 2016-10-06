using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Mail;
using System.Web;

namespace Matching {

    public static class Notification {

        // Gmail account used for sending mail over SMTP
        private const string GMAIL_ACCT = "noreplyubeyond@gmail.com";
        private const string GMAIL_PASS = "ubeyond1";

        // Host we will use for sending email via SMTP
        private const string SMTP_HOST = "smtp.gmail.com";

        /// <summary>
        /// Sends an email to the specified recipients, using Google's SMTP host.
        /// </summary>
        /// 
        /// <param name="recipients">
        /// A list of email addressed to send the message to.
        /// </param>
        /// 
        /// <param name="message">
        /// The HTML-formatted body of the email.
        /// </param>
        /// 
        /// <returns>
        /// <c>true</c> if the email(s) were sent without error, else <c>false</c>.
        /// </returns>
        public static bool SendEmail(MailAddressCollection recipients, string subject, string message) {
            MailMessage mail = new MailMessage();
            SmtpClient client = new SmtpClient();
            bool result = true;

            // Configure smtp client
            client.Credentials = new System.Net.NetworkCredential(GMAIL_ACCT, GMAIL_PASS);
            client.DeliveryMethod = SmtpDeliveryMethod.Network;
            client.EnableSsl = true;
            client.Host = SMTP_HOST;
            client.Port = 587;
            client.UseDefaultCredentials = false;

            // Configure mail message
            mail.Body = message;
            mail.Subject = subject;
            mail.From = new MailAddress(GMAIL_ACCT);
            foreach (MailAddress recipient in recipients) {
                mail.To.Add(recipient);
            }

            // Attempt to send email
            try {
                client.Send(mail);
            }
            catch (Exception e) {
                // Note: if needed, we can return more info based on this exception
                result = false;
            }

            return result;
        }

        /// <summary>
        /// Generates an HTML-formatted welcome email to be sent upon new user registration.
        /// </summary>
        /// 
        /// <param name="name">
        /// The newly-registered user's name.
        /// </param>
        /// 
        /// <param name="userID">
        /// The newly-registered user's ID.
        /// </param>
        /// 
        /// <remarks>
        /// TODO: Check welcome.txt and put finishing touches on it, including fixing admin email and profile link.
        /// </remarks>
        /// 
        /// <returns>
        /// An HTML-formatted <c>string</c> to serve as the body of the email.
        /// </returns>
        public static string GenerateWelcomeEmail(string name, string userID) {
            const string TEMPLATE_FILE = "templates/welcome.txt";
            string message = null;

            // Read template into a file
            try {
                using (StreamReader reader = File.OpenText(TEMPLATE_FILE)) {
                    message = String.Format(reader.ReadToEnd(), name, userID);
                }
            }
            catch (Exception ex) {
                // TODO - could handle exceptions
            }

            return message;
        }

    }
}