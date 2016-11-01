using Matching.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Web;
using System.Web.Http;

namespace Matching.Controllers
{
    public class RegistrationController : ApiController
    {

        // GET: Registration
        /*[Route("register/{userUID}")]
        public IHttpActionResult Register(string userUID)
        {
            string email = FirebaseUtility.GetUserEmail(userUID).Result;
            string message = Notification.GenerateWelcomeEmail(email, userUID);
            MailAddressCollection addresses = new MailAddressCollection();
            addresses.Add(FirebaseUtility.GetUserEmail(userUID).Result);
            Notification.SendEmail(addresses, "welcome to U-Beyond! " + FirebaseUtility.GetUserFirstName(userUID).Result, message);
            return Ok(1);
        }*/
    }
}