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

        public Mentor(string firstName, string lastName, string middleInitial, string preferredName, string address, string phoneNumber, string email, string gender, List<string> languages, DateTime birthdate, string pathToHeadshot, string pathToResume, string bio, DateTime preferredStartDate, string languagePreference, string genderPreference, string employer, int yearsOfExperience, string fieldOfExpertise, List<string> menteeLevelPreference, string strengths, MentorQuestionnaire initialQuestionnaire) : base(firstName, lastName, middleInitial, preferredName, address, phoneNumber, email, gender, languages, birthdate, pathToHeadshot, pathToResume, bio, preferredStartDate, languagePreference, genderPreference)
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