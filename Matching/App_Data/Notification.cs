using System;
using System.Collections.Generic;
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
        public static bool SendEmail(MailAddressCollection recipients, string message) {
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

    }
}