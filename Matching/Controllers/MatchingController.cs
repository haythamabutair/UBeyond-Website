using System;
using System.Collections.Generic;
using System.Web.Http;
using Matching.Models;
using Matching.Utilities;

namespace Matching.Controllers
{
    /// <summary>
    /// A WebAPI controller class for the REST endpoints to get a list of matched mentors and get matching index.
    /// </summary>
    public class MatchingController : ApiController
    {
        /// <summary>
        /// A method that will be called whenever a Mentee clicks the "Find a Mentor" button.
        /// This will initiate the process for matching a mentee with a mentor. and finds a list of mentors
        /// to be reviewed by an admin.
        /// </summary>
        /// <param name="menteeUsername"></param>
        [Route("match/mentor/{mentorUID}")]
        public IHttpActionResult MatchMentor(string mentorUID)
        {
            //get user list and handle all errors
            List<User> userList = null;
            try
            {
                userList = MatchingUtility.getUserList();
            } catch
            {
                return InternalServerError();
            }
            if(userList == null)
            {
                return InternalServerError();
            }

            //traverse user list and find first available mentee
            foreach(User user in userList)
            {
                if(user.IsAvailable && user.UserType == "mentee")
                {
                    //Push results to database
                    return Ok(1);
                }
            }


            return BadRequest("Could not find available mentee");
        }

        /// <summary>
        /// Returns a value that determines how close of a match the mentor and mentee are.
        /// </summary>
        /// <param name="mentorUsername"></param>
        /// <param name="menteeUsername"></param>
        /// <returns></returns>
        [Route("match/mentee/{menteeToken}")]
        public IHttpActionResult MatchMentee(string menteeUsername, string mentorUsername)
        {
            //get user list and handle all errors
            List<User> userList = null;
            try
            {
                userList = MatchingUtility.getUserList();
            }
            catch
            {
                return InternalServerError();
            }
            if (userList == null)
            {
                return InternalServerError();
            }

            //traverse user list and find first available mentor
            foreach (User user in userList)
            {
                if (user.IsAvailable && user.UserType == "mentor")
                {
                    //Push results to database
                    return Ok(1);
                }
            }


            return BadRequest("Could not find available mentor");
        }
    }
}