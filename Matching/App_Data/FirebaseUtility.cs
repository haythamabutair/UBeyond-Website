using FireSharp;
using FireSharp.Config;
using FireSharp.Interfaces;
using FireSharp.Response;
using Matching.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Matching
{
    public class FirebaseUtility
    {

        private const string API_KEY = "JAXxcmnYJIlUeKoFevkFnaT3I738qBSBncF2vxQ1";
        private const string BASE_PATH = "https://ubeyond-website.firebaseio.com/";
        private static IFirebaseConfig config = new FirebaseConfig
        {
            AuthSecret = API_KEY,
            BasePath = BASE_PATH
        };

        public static Dictionary<string, Mentee> GetMenteeDictionary()
        {
            IFirebaseClient client = new FirebaseClient(FirebaseUtility.config);
            FirebaseResponse response = client.Get("Mentee");
            Dictionary<string, Mentee> menteeList = null;
            menteeList = response.ResultAs<Dictionary<string, Mentee>>();
            return menteeList;
        }

        public static Dictionary<string, Mentor> GetMentorDictionary()
        {
            IFirebaseClient client = new FirebaseClient(FirebaseUtility.config);
            FirebaseResponse response = client.Get("Mentor");
            Dictionary<string, Mentor> mentorList = null;
            mentorList = response.ResultAs<Dictionary<string, Mentor>>();
            return mentorList;
        }

        public static Mentor GetMentor(string uid)
        {
            IFirebaseClient client = new FirebaseClient(FirebaseUtility.config);
            FirebaseResponse response = client.Get("Mentor/" + uid);
            Mentor mentor = null;
            mentor = response.ResultAs<Mentor>();
            return mentor;
        }

        public static Mentee GetMentee(string uid)
        {
            IFirebaseClient client = new FirebaseClient(FirebaseUtility.config);
            FirebaseResponse response = client.Get("Mentee/" + uid);
            Mentee mentee = null;
            mentee = response.ResultAs<Mentee>();
            return mentee;
        }

        public static FirebaseResponse PushMentorMatch(string mentorUid, string menteeUid)
        {
            //setup required structures
            IFirebaseClient client = new FirebaseClient(FirebaseUtility.config);
            var match = new Match
            {
                User = menteeUid
            };

            FirebaseResponse getResponse = client.Get("MentorMatch/" + mentorUid);
            if(getResponse.Body == "null")
            {
                return client.Push("MentorMatch/" + mentorUid, match); //if no matches yet, push match
            }

            Dictionary<string, Match> currentMatches = getResponse.ResultAs<Dictionary<string, Match>>();
            
            foreach(KeyValuePair<string, Match> currentMatch in currentMatches)
            {
                if(currentMatch.Value.User == menteeUid)
                {
                    return null; //match already exists. return null
                }
            }
            
            return client.Push("MentorMatch/" + mentorUid, match); //if match doesn't exist push new match
        }

        public static FirebaseResponse PushMenteeMatch(string menteeUid, string mentorUid)
        {
            //setup required structures
            IFirebaseClient client = new FirebaseClient(FirebaseUtility.config);
            var match = new Match
            {
                User = mentorUid
            };

            FirebaseResponse getResponse = client.Get("MenteeMatch/" + menteeUid);
            if (getResponse.Body == null)
            {
                return client.Push("MenteeMatch/" + menteeUid, match); //if no matches yet, push match
            }

            Dictionary<string, Match> currentMatches = getResponse.ResultAs<Dictionary<string, Match>>();
            
            foreach (KeyValuePair<string, Match> currentMatch in currentMatches)
            {
                if (currentMatch.Value.User == menteeUid)
                {
                    return null; //match already exists. return null
                }
            }
            
            return client.Push("MenteeMatch/" + menteeUid, match); //if match doesn't exist push new match
        }

    }
}