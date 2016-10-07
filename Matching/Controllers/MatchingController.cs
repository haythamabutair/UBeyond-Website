using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web.Http;

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
    }
}