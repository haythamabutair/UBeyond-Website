using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web.Http;

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
        [Route("matching/{menteeUsername}/list")]
        public IEnumerable<string> GetMatchedListOfMentors(string menteeUsername)
        {
            //TODO: Query Database and find all users that are available.
            
            //TODO: Filter Mentors on whether they are matchable or not. 
            //      If matchable, find matchingIndex and add to sorted list of (Mentor, matchingIndex)
            /*
             * for(Mentor mentor: AvailableMentorTable)
             * {
             *      if(!this.IsMatchable(mentor.username, menteeUsername)) 
             *      {
             *          AvailableMentorTable.Delete(mentor);
             *      } else
             *      {
             *          MatchedList.add(mentor, this.GetMatchingIndex(mentor.username, menteeUsername));
             *      }
             * }
             */

            //TODO: return list of mentors sorted by matchability
            return null;
        }

        /// <summary>
        /// Returns a value that determines how close of a match the mentor and mentee are.
        /// </summary>
        /// <param name="mentorUsername"></param>
        /// <param name="menteeUsername"></param>
        /// <returns></returns>
        [Route("matching/{menteeUsername}/{mentorUsername}/index")]
        public IHttpActionResult GetMatchingIndex(string menteeUsername, string mentorUsername)
        {
            //TODO: Retrieve mentor and mentee data from database

            //TODO: Check if the mentor and mentee have the basic mecessary requirements to match
            return Ok(-1);
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