using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;

namespace MatchingService
{
    /// <summary>
    /// A Service that provides the required functionality to match Mentors to Mentees.
    /// </summary>
    [WebService(Namespace = "http://ubeyond.org/matchingservices")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    // [System.Web.Script.Services.ScriptService]
    public class MatchingService : System.Web.Services.WebService
    {

        /// <summary>
        /// Returns a value that determines how close of a match the mentor and mentee are.
        /// </summary>
        /// <param name="mentorUsername"></param>
        /// <param name="menteeUsername"></param>
        /// <returns></returns>
        [WebMethod]
        public int GetMatchingIndex(String mentorUsername, String menteeUsername)
        {
            //TODO: Retrieve mentor and mentee data from database

            //TODO: Check if the mentor and mentee have the basic mecessary requirements to match
            return -1;
        }

        /// <summary>
        /// A method that will be called whenever a Mentee clicks the "Find a Mentor" button.
        /// This will initiate the process for matching a mentee with a mentor. and finds a list of mentors
        /// to be reviewed by an admin.
        /// </summary>
        /// <param name="Username"></param>
        [WebMethod]
        public List<String> MatchMenteeWithMentors(String menteeUsername)
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
    }
}
