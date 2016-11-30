using System;
using System.Collections.Generic;
using System.Web.Http;
using Matching.Models;
using Matching;
using System.Net.Mail;

namespace Matching.Controllers
{
    /// <summary>
    /// A WebAPI controller class for the REST endpoints to match users.
    /// </summary>
    public class MatchingController : ApiController
    {
        /// <summary>
        /// A method that will be called whenever a Mentor registers, and will match that user with the best available Mentee
        /// </summary>
        /// <param name="mentorUID"></param>
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

            string bestMenteeUID = null;
            double bestMatchStrength = -1;
            if (mentor.Blacklist == null)
            {
                mentor.Blacklist = new List<string>();
            }
            foreach (KeyValuePair<string, Mentee> mentee in mentees)
            {
                if(mentee.Value.IsAvailable && !mentee.Value.PendingApproval && !mentor.Blacklist.Contains(mentee.Key))
                {
                    double matchStrength = GetMatchStrength(mentor, mentee.Value);
                    if (matchStrength > bestMatchStrength)
                    {
                        bestMenteeUID = mentee.Key;
                        bestMatchStrength = matchStrength;
                    }
                }
            }

            //save the mentee as a match for this mentor
            if (bestMenteeUID != null && FirebaseUtility.PushMentorMatch(mentorUID, bestMenteeUID) != null)
            {
                return Ok(1);
            }

            return Ok(2); //return different error code if no match added (not a failure)
            
        }

        /// <summary>
        /// A method that will be called whenever a Mentee registers, and will match that user with the best available Mentor
        /// </summary>
        /// <param name="menteeUID"></param>
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

            string bestMentorUID = null;
            double bestMatchStrength = -1;
            if (mentee.Blacklist == null)
            {
                mentee.Blacklist = new List<string>();
            }
            foreach (KeyValuePair<string, Mentor> mentor in mentors)
            {
                if (mentor.Value.IsAvailable && !mentor.Value.PendingApproval && !mentee.Blacklist.Contains(mentor.Key))
                {
                    double matchStrength = GetMatchStrength(mentor.Value, mentee);
                    if (matchStrength > bestMatchStrength)
                    {
                        bestMentorUID = mentor.Key;
                        bestMatchStrength = matchStrength;
                    }
                }
            }

            //save the mentee as a match for this mentor
            if (bestMentorUID != null && FirebaseUtility.PushMenteeMatch(menteeUID, bestMentorUID) != null)
            {
                return Ok(1);
            }

            return Ok(2); //return different error code if no match added (not a failure)

        }

        /// <summary>
        /// A method that will be called to confirm a match
        /// </summary>
        /// <param name="menteeUID"></param>
        [Route("match/confirm/{mentorUid}/{menteeUid}")]
        public IHttpActionResult ConfirmMatch(string mentorUid, string menteeUid)
        {
            if(FirebaseUtility.ConfirmMatch(mentorUid, menteeUid))
            {
                return Ok(1);
            }
            else
            {
                return BadRequest();
            }
        }

        /// <summary>
        /// A method that will be called to reject a match
        /// </summary>
        /// <param name="menteeUID"></param>
        [Route("match/reject/{mentorUid}/{menteeUid}")]
        public IHttpActionResult RejectMatch(string mentorUid, string menteeUid)
        {
            if (FirebaseUtility.RejectMatch(mentorUid, menteeUid))
            {
                return Ok(1);
            }
            else
            {
                return BadRequest();
            }
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