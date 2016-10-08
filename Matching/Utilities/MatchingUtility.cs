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
    public class MatchingUtility
    {

        private const string API_KEY = "AIzaSyAz1Z5At4sp5oZ6EIrxLZQeYS2BGIpgIbg";
        private const string BASE_PATH = "https://ubeyond-website.firebaseio.com/";

        public static List<User> getUserList()
        {
            IFirebaseConfig config = new FirebaseConfig
            {
                AuthSecret = API_KEY,
                BasePath = BASE_PATH
            };
            IFirebaseClient client = new FirebaseClient(config);
            FirebaseResponse response = client.Get("ubeyond-website/Users");
            List<User> userList = null;
            userList = response.ResultAs<List<User>>();
            return userList;
        }

    }
}