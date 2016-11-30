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

        public static bool ConfirmMatch(string mentorUid, string menteeUid)
        {
            IFirebaseClient client = new FirebaseClient(FirebaseUtility.config);
            FirebaseResponse mentorMatchesResponse = client.Get("MentorMatch/" + mentorUid);
            FirebaseResponse menteeMatchesResponse = client.Get("MenteeMatch/" + menteeUid);
            Dictionary<string, Match> mentorMatches = mentorMatchesResponse.ResultAs<Dictionary<string, Match>>();
            Dictionary<string, Match> menteeMatches = menteeMatchesResponse.ResultAs<Dictionary<string, Match>>();
            bool foundMatch = false;
            if (mentorMatches != null)
            {
                foreach (KeyValuePair<string, Match> mentorMatch in mentorMatches)
                {
                    if (mentorMatch.Value.User.Equals(menteeUid))
                    {
                        foundMatch = true;
                        client.Delete("MentorMatch/" + mentorUid + "/" + mentorMatch.Key);
                    }
                }
            }
            if (menteeMatches != null)
            {
                foreach (KeyValuePair<string, Match> menteeMatch in menteeMatches)
                {
                    if (menteeMatch.Value.User.Equals(mentorUid))
                    {
                        foundMatch = true;
                        client.Delete("MenteeMatch/" + menteeUid + "/" + menteeMatch.Key);
                    }
                }
            }

            if (foundMatch)
            {
                Mentor mentor = client.Get("Mentor/" + mentorUid).ResultAs<Mentor>();
                mentor.Match = menteeUid;
                mentor.IsAvailable = false;
                mentor.PendingApproval = false;
                FirebaseResponse response1 = client.Set<Mentor>("Mentor/" + mentorUid, mentor);

                Mentee mentee = client.Get("Mentee/" + menteeUid).ResultAs<Mentee>();
                mentee.Match = mentorUid;
                mentee.IsAvailable = false;
                mentee.PendingApproval = false;
                FirebaseResponse response2 = client.Set<Mentee>("Mentee/" + menteeUid, mentee);
            }

            return foundMatch;
        }

        public static bool RejectMatch(string mentorUid, string menteeUid)
        {
            IFirebaseClient client = new FirebaseClient(FirebaseUtility.config);
            FirebaseResponse mentorMatchesResponse = client.Get("MentorMatch/" + mentorUid);
            FirebaseResponse menteeMatchesResponse = client.Get("MenteeMatch/" + menteeUid);
            Dictionary<string, Match> mentorMatches = mentorMatchesResponse.ResultAs<Dictionary<string, Match>>();
            Dictionary<string, Match> menteeMatches = menteeMatchesResponse.ResultAs<Dictionary<string, Match>>();
            bool foundMatch = false;
            if (mentorMatches != null)
            {
                foreach (KeyValuePair<string, Match> mentorMatch in mentorMatches)
                {
                    if (mentorMatch.Value.User.Equals(menteeUid))
                    {
                        foundMatch = true;
                        client.Delete("MentorMatch/" + mentorUid + "/" + mentorMatch.Key);
                    }
                }
            }
            if (menteeMatches != null)
            {
                foreach (KeyValuePair<string, Match> menteeMatch in menteeMatches)
                {
                    if (menteeMatch.Value.User.Equals(mentorUid))
                    {
                        foundMatch = true;
                        client.Delete("MenteeMatch/" + menteeUid + "/" + menteeMatch.Key);
                    }
                }
            }
            if (foundMatch)
            {
                Mentor mentor = client.Get("Mentor/" + mentorUid).ResultAs<Mentor>();
                mentor.IsAvailable = true;
                mentor.PendingApproval = false;
                if(mentor.Blacklist == null)
                {
                    mentor.Blacklist = new List<string>();
                }
                mentor.Blacklist.Add(menteeUid);
                FirebaseResponse response1 = client.Set<Mentor>("Mentor/" + mentorUid, mentor);

                Mentee mentee = client.Get("Mentee/" + menteeUid).ResultAs<Mentee>();
                mentee.IsAvailable = true;
                mentee.PendingApproval = false;
                if (mentee.Blacklist == null)
                {
                    mentee.Blacklist = new List<string>();
                }
                mentee.Blacklist.Add(mentorUid);
                FirebaseResponse response2 = client.Set<Mentee>("Mentee/" + menteeUid, mentee);
            }
            return foundMatch;
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
                Mentor mentorUpdate = client.Get("Mentor/" + mentorUid).ResultAs<Mentor>();
                mentorUpdate.PendingApproval = true;
                client.Set<Mentor>("Mentor/" + mentorUid, mentorUpdate);

                Mentee menteeUpdate = client.Get("Mentee/" + menteeUid).ResultAs<Mentee>();
                menteeUpdate.PendingApproval = true;
                client.Set<Mentee>("Mentee/" + menteeUid, menteeUpdate);
                return client.Push("MentorMatch/" + mentorUid, match); //if no matches yet, push match
            }

            Dictionary<string, Match> currentMatches = getResponse.ResultAs<Dictionary<string, Match>>();

            if (currentMatches != null)
            {
                foreach (KeyValuePair<string, Match> currentMatch in currentMatches)
                {
                    if (currentMatch.Value.User.Equals(menteeUid))
                    {
                        return null; //match already exists. return null
                    }
                }
            }
            Mentor mentor = client.Get("Mentor/" + mentorUid).ResultAs<Mentor>();
            mentor.PendingApproval = true;
            FirebaseResponse response1 = client.Set<Mentor>("Mentor/" + mentorUid, mentor);

            Mentee mentee = client.Get("Mentee/" + menteeUid).ResultAs<Mentee>();
            mentee.PendingApproval = true;
            FirebaseResponse response2 = client.Set<Mentee>("Mentee/" + menteeUid, mentee);
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
                Mentor mentorUpdate = client.Get("Mentor/" + mentorUid).ResultAs<Mentor>();
                mentorUpdate.PendingApproval = true;
                client.Set<Mentor>("Mentor/" + mentorUid, mentorUpdate);

                Mentee menteeUpdate = client.Get("Mentee/" + menteeUid).ResultAs<Mentee>();
                menteeUpdate.PendingApproval = true;
                client.Set<Mentee>("Mentee/" + menteeUid, menteeUpdate);
                return client.Push("MenteeMatch/" + menteeUid, match); //if no matches yet, push match
            }

            Dictionary<string, Match> currentMatches = getResponse.ResultAs<Dictionary<string, Match>>();

            if (currentMatches != null)
            {
                foreach (KeyValuePair<string, Match> currentMatch in currentMatches)
                {
                    if (currentMatch.Value.User.Equals(menteeUid))
                    {
                        return null; //match already exists. return null
                    }
                }
            }
            Mentor mentor = client.Get("Mentor/" + mentorUid).ResultAs<Mentor>();
            mentor.PendingApproval = true;
            FirebaseResponse response1 = client.Set<Mentor>("Mentor/" + mentorUid, mentor);

            Mentee mentee = client.Get("Mentee/" + menteeUid).ResultAs<Mentee>();
            mentee.PendingApproval = true;
            FirebaseResponse response2 = client.Set<Mentee>("Mentee/" + menteeUid, mentee);
            return client.Push("MenteeMatch/" + menteeUid, match); //if match doesn't exist push new match
        }

    }
}