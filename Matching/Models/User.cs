using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Matching.Models
{
    public abstract class User : Person
    {
        public string HeadshotFilename { get; set; }
        public string ResumeFilemane { get; set; }
        public string Bio { get; set; }
        public string PreferredStartDate { get; set; }
        public string LanguagePreference { get; set; }
        public List<string> Languages { get; set; }
        public string GenderPreference { get; set; } //Male or Female
        public string Match { get; set; }
        public bool PendingApproval { get; set; }
        public List<string> Blacklist { get; set; }


        //internal
        public bool IsAvailable { get; set; }

        protected User(string firstName, string lastName, string middleInitial, string preferredName, string address, string phoneNumber, string email, string gender, string birthdate,  string bio, string preferredStartDate, string languagePreference, string genderPreference, List<string> languages, string isAvailable, bool PendingApproval, List<string> Blacklist, string HeadshotFilename, string ResumeFilename) : base(firstName, lastName, middleInitial, preferredName, address, phoneNumber, email, gender, birthdate)
        {
            this.Bio = bio;
            this.PreferredStartDate = preferredStartDate;
            this.LanguagePreference = languagePreference;
            this.GenderPreference = genderPreference;
            this.Languages = languages;
            this.PendingApproval = PendingApproval;
            this.Blacklist = Blacklist;
            this.HeadshotFilename = HeadshotFilename;
            this.ResumeFilemane = ResumeFilemane;
            if (isAvailable == "true")
            {
                this.IsAvailable = true;
            } else
            {
                this.IsAvailable = false;
            }
        }
    }
}