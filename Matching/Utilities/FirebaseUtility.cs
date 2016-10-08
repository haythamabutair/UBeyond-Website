using FireSharp;
using FireSharp.Config;
using FireSharp.Interfaces;
using FireSharp.Response;
using Matching.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Matching.Utilities
{
    public class FirebaseUtility
    {

        private const string API_KEY = "JAXxcmnYJIlUeKoFevkFnaT3I738qBSBncF2vxQ1";
        private const string BASE_PATH = "https://ubeyond-website.firebaseio.com/";

        public static List<User> GetUserList()
        {
            IFirebaseConfig config = new FirebaseConfig
            {
                AuthSecret = API_KEY,
                BasePath = BASE_PATH
            };
            IFirebaseClient client = new FirebaseClient(config);
            FirebaseResponse response = client.Get("Users");
            List<User> userList = null;
            userList = response.ResultAs<List<User>>();
            return userList;
        }

        public static async void PushMatch(string menteeUID, string mentorUID)
        {
            IFirebaseConfig config = new FirebaseConfig
            {
                AuthSecret = API_KEY,
                BasePath = BASE_PATH
            };
            IFirebaseClient _client = new FirebaseClient(config);
            var match = new Match
            {
                Mentee = menteeUID,
                Mentor = mentorUID
            };
            SetResponse response = await _client.SetAsync("Matches/" + menteeUID, match);
        }

        public static async System.Threading.Tasks.Task<string> GetUserEmail(string uid)
        {
            IFirebaseConfig config = new FirebaseConfig
            {
                AuthSecret = API_KEY,
                BasePath = BASE_PATH
            };
            IFirebaseClient _client = new FirebaseClient(config);
            FirebaseResponse response = await _client.GetAsync("Users/" + uid + "/email");
            return response.ResultAs<string>();
        }

        public static async System.Threading.Tasks.Task<string> GetUserFirstName(string uid)
        {
            IFirebaseConfig config = new FirebaseConfig
            {
                AuthSecret = API_KEY,
                BasePath = BASE_PATH
            };
            IFirebaseClient _client = new FirebaseClient(config);
            FirebaseResponse response = await _client.GetAsync("Users/" + uid + "/name/first");
            return response.ResultAs<string>();
        }

    }
}