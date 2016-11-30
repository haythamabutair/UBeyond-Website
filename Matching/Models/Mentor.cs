using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Matching.Models
{
    public class Mentor : User
    {
        public List<MentorQuestionnaire> questionnaires { get; set; }

        public string Employer { get; set; }
        public int YearsOfExperience { get; set; }
        public string FieldOfExpertise { get; set; }
        public List<string> MenteeLevelPreference { get; set; } //subset of <high school, graduate, undergraduate>
        public string Strengths { get; set; }

        [JsonConstructor]
        public Mentor(string firstName, string lastName, string middleInitial, string preferredName, string address, string phoneNumber, string email, string gender, string birthdate, string pathToHeadshot, string pathToResume, string bio, string preferredStartDate, string languagePreference, string genderPreference, string employer, int yearsOfExperience, string fieldOfExpertise, List<string> menteeLevelPreference, List<string> Languages, string strengths, MentorQuestionnaire initialQuestionnaire, string isAvailable, bool PendingApproval, List<string> Blacklist, string HeadshotFilename, string ResumeFilename) : base(firstName, lastName, middleInitial, preferredName, address, phoneNumber, email, gender, birthdate, bio, preferredStartDate, languagePreference, genderPreference, Languages, isAvailable, PendingApproval, Blacklist, HeadshotFilename, ResumeFilename)
        {
            this.Employer = employer;
            this.YearsOfExperience = yearsOfExperience;
            this.FieldOfExpertise = fieldOfExpertise;
            this.MenteeLevelPreference = menteeLevelPreference;
            this.Strengths = strengths;

            questionnaires = new List<MentorQuestionnaire>();
            questionnaires.Add(initialQuestionnaire);
        }
    }
}