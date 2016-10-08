using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Matching.Models
{
    public abstract class User : Person
    {
        public string PathToHeadshot { get; set; }
        public string PathToResume { get; set; }
        public string Bio { get; set; }
        public DateTime PreferredStartDate { get; set; }
        public string LanguagePreference { get; set; }
        public string GenderPreference { get; set; } //Male or Female
        public string UserType { get; set; }

        //internal
        public bool IsAvailable { get; set; }

        protected User(string firstName, string lastName, string middleInitial, string preferredName, string address, string phoneNumber, string email, string gender, List<string> languages, DateTime birthdate, string pathToHeadshot, string pathToResume, string bio, DateTime preferredStartDate, string languagePreference, string genderPreference, string userType) : base(firstName, lastName, middleInitial, preferredName, address, phoneNumber, email, gender, languages, birthdate)
        {
            this.PathToHeadshot = pathToHeadshot;
            this.PathToResume = pathToResume;
            this.Bio = bio;
            this.PreferredStartDate = preferredStartDate;
            this.LanguagePreference = languagePreference;
            this.GenderPreference = genderPreference;
            this.UserType = userType;

            this.IsAvailable = true;
        }
    }
}