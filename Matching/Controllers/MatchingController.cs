using System;
using System.Collections.Generic;
using System.Web.Http;
using Matching.Models;
using Matching.Utilities;

using Matching.Models;

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

        public double GetMatchStrength(Mentor mentor, Mentee mentee)
        {
            double strength = 1.0;

            //todo: find better metric for finding field similarity
            strength *= CalcNormalizedLevenshteinDistance(mentor.FieldOfExpertise, mentee.FieldPreference);

            //gender metric
            strength *= mentee.Gender.Equals(mentor.GenderPreference) ? 1.2 : 0.8;
            strength *= mentee.GenderPreference.Equals(mentor.Gender) ? 1.2 : 0.8;

            //language metric
            strength *= mentee.Languages.Contains(mentor.LanguagePreference) ? 1.1 : 0.9;
            strength *= mentor.Languages.Contains(mentee.LanguagePreference) ? 1.1 : 0.9;

            return strength;
        }
        

        //for finding similarity between two strings, normalized by their lengths. not a perfect metric
        private static double CalcNormalizedLevenshteinDistance(string a, string b)
        {
            if (String.IsNullOrEmpty(a) || String.IsNullOrEmpty(b)) return 0;

            int lengthA = a.Length;
            int lengthB = b.Length;
            var distances = new int[lengthA + 1, lengthB + 1];
            for (int i = 0; i <= lengthA; distances[i, 0] = i++) ;
            for (int j = 0; j <= lengthB; distances[0, j] = j++) ;

            for (int i = 1; i <= lengthA; i++)
            {
                for (int j = 1; j <= lengthB; j++)
                {
                    int cost = b[j - 1] == a[i - 1] ? 0 : 1;
                    distances[i, j] = Math.Min
                        (
                        Math.Min(distances[i - 1, j] + 1, distances[i, j - 1] + 1),
                        distances[i - 1, j - 1] + cost
                        );
                }
            }

            return 2 * (double)distances[lengthA, lengthB] / (lengthA + lengthB);
        }
    }
}