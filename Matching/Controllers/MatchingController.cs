using System;
using System.Collections.Generic;
using System.Web.Http;
using Matching.Models;
using Matching;

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
            Mentor mentor = FirebaseUtility.GetMentor(mentorUID);
            Dictionary<string, Mentee> mentees = FirebaseUtility.GetMenteeDictionary();

            if (mentor == null)
            {
                return BadRequest(); //mentor does not exist in database
            }

            if (mentees == null)
            {
                return InternalServerError(); //error retrieving mentees from Server
            }
            
            foreach(KeyValuePair<string, Mentee> mentee in mentees)
            {
                if(mentee.Value.IsAvailable)
                {
                    //save the mentee as a match for this mentor
                    if (FirebaseUtility.PushMentorMatch(mentorUID, mentee.Key) != null)
                    {
                        return Ok(1);
                    }
                }
            }

            return Ok(2); //return different error code if no match added (not a failure)
            
        }

        /// <summary>
        /// Returns a value that determines how close of a match the mentor and mentee are.
        /// </summary>
        /// <param name="mentorUsername"></param>
        /// <param name="menteeUsername"></param>
        /// <returns></returns>
        [Route("match/mentee/{menteeUid}")]
        public IHttpActionResult MatchMentee(string menteeUID)
        {
            Mentee mentee = FirebaseUtility.GetMentee(menteeUID);
            Dictionary<string, Mentor> mentors = FirebaseUtility.GetMentorDictionary();

            if (mentee == null)
            {
                return BadRequest(); //mentor does not exist in database
            }

            if (mentors == null)
            {
                return InternalServerError(); //error retrieving mentees from Server
            }

            foreach (KeyValuePair<string, Mentor> mentor in mentors)
            {
                if (mentor.Value.IsAvailable)
                {
                    //save the mentee as a match for this mentor
                    if (FirebaseUtility.PushMenteeMatch(menteeUID, mentor.Key) != null)
                    {
                        return Ok(1);
                    }
                }
            }
            
            return Ok(2); //return different code if no new match added (doesn't mean failure)
            
        }

        public double GetMatchStrength(Mentor mentor, Mentee mentee)
        {
            double strength = 1.0;

            //todo: find better metric for finding field similarity
            //strength *= CalcNormalizedLevenshteinDistance(mentor.FieldOfExpertise, mentee.FieldPreference);

            //gender metric
            strength *= mentee.Gender.Equals(mentor.GenderPreference) ? 1.2 : 0.8;
            strength *= mentee.GenderPreference.Equals(mentor.Gender) ? 1.2 : 0.8;

            //language metric
            strength *= mentee.Languages.Contains(mentor.LanguagePreference) ? 1.1 : 0.9;
            //strength *= mentor.Languages.Contains(mentee.LanguagePreference) ? 1.1 : 0.9;

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