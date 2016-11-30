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

        // GET: Registration email for Mentees
        [Route("register/mentee/{userUID}")]
        public IHttpActionResult RegisterMentee(string userUID)
        {
            Mentee mentee = FirebaseUtility.GetMentee(userUID);

            if(mentee == null)
            {
                return BadRequest();
            }

            string email = mentee.Email;
            string message = Notification.GenerateWelcomeEmail(email, userUID);
            MailAddressCollection addresses = new MailAddressCollection();
            addresses.Add(mentee.Email);
            bool result = Notification.SendEmail(addresses, "welcome to U-Beyond! " + mentee.FirstName, message);
            return Ok(result);
        }

        // GET: Registration email for Mentors
        [Route("register/mentor/{userUID}")]
        public IHttpActionResult RegisterMentor(string userUID)
        {
            Mentor mentor = FirebaseUtility.GetMentor(userUID);

            if(mentor == null)
            {
                return BadRequest();
            }

            string email = mentor.Email;
            string message = Notification.GenerateWelcomeEmail(email, userUID);
            MailAddressCollection addresses = new MailAddressCollection();
            addresses.Add(mentor.Email);
            Notification.SendEmail(addresses, "welcome to U-Beyond! " + mentor.FirstName, message);
            return Ok(1);
        }
    }
}