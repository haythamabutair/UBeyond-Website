using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Matching.Models
{
    public class Mentee : User
    {
        public List<MenteeQuestionnaire> questionnaires { get; set; }

        public string Skills { get; set; }
        public string FieldPreference { get; set; }

        public string EmploymentStatus { get; set; } //student or employed, internal

        //if student
        public string SchoolStatus { get; set; } //high school, graduate, or undergraduate, internal
        public string CurrentSchool { get; set; }
        public DateTime ExpectedGradDate { get; set; }
        public string FuturePlans { get; set; }
        //  if high school
        public int Grade { get; set; }
        //  if not high school
        public string Major { get; set; }
        public string Minor { get; set; }
        public bool InterestedInPostGrad { get; set; }

        //if employed
        public string HighestDegree { get; set; }
        public string SchoolName { get; set; }
        public string Employer { get; set; }
        public DateTime GradDate { get; set; }
        public string CareerGoals { get; set; }
        public string CareerPlans { get; set; }

        
        //if in high school
        public Mentee(string firstName, string lastName, string middleInitial, string preferredName, string address, string phoneNumber, string email, string gender, List<string> languages, DateTime birthdate, string pathToHeadshot, string pathToResume, string bio, DateTime preferredStartDate, string languagePreference, string genderPreference, string skills, string fieldPreference, string employmentStatus, string currentSchool, DateTime expectedGradDate, string futurePlans, int grade, MenteeQuestionnaire initialQuestionnaire) : base(firstName, lastName, middleInitial, preferredName, address, phoneNumber, email, gender, languages, birthdate, pathToHeadshot, pathToResume, bio, preferredStartDate, languagePreference, genderPreference)
        {
            this.Skills = skills;
            this.FieldPreference = fieldPreference;

            this.EmploymentStatus = "student";
            this.SchoolStatus = "high school";
            this.CurrentSchool = currentSchool;
            this.ExpectedGradDate = expectedGradDate;
            this.FuturePlans = futurePlans;
            this.Grade = grade;

            questionnaires = new List<MenteeQuestionnaire>();
            questionnaires.Add(initialQuestionnaire);
        }
        
        //if undergraduate or graduate
        public Mentee(string firstName, string lastName, string middleInitial, string preferredName, string address, string phoneNumber, string email, string gender, List<string> languages, DateTime birthdate, string pathToHeadshot, string pathToResume, string bio, DateTime preferredStartDate, string languagePreference, string genderPreference, string skills, string fieldPreference, string employmentStatus, bool isUndergrad, string currentSchool, DateTime expectedGradDate, string futurePlans, string major, string minor, bool interestedInPostGrad, MenteeQuestionnaire initialQuestionnaire) : base(firstName, lastName, middleInitial, preferredName, address, phoneNumber, email, gender, languages, birthdate, pathToHeadshot, pathToResume, bio, preferredStartDate, languagePreference, genderPreference)
        {
            this.Skills = skills;
            this.FieldPreference = fieldPreference;

            this.EmploymentStatus = "student";
            this.SchoolStatus = isUndergrad ? "undergraduate" : "graduate";
            this.Major = major;
            this.Minor = minor;
            this.InterestedInPostGrad = interestedInPostGrad;

            questionnaires = new List<MenteeQuestionnaire>();
            questionnaires.Add(initialQuestionnaire);
        }

        //if employed
        public Mentee(string firstName, string lastName, string middleInitial, string preferredName, string address, string phoneNumber, string email, string gender, List<string> languages, DateTime birthdate, string pathToHeadshot, string pathToResume, string bio, DateTime preferredStartDate, string languagePreference, string genderPreference, string skills, string fieldPreference, string employmentStatus, string highestDegree, string schoolName, string employer, DateTime gradDate, string careerGoals, string careerPlans, MenteeQuestionnaire initialQuestionnaire) : base(firstName, lastName, middleInitial, preferredName, address, phoneNumber, email, gender, languages, birthdate, pathToHeadshot, pathToResume, bio, preferredStartDate, languagePreference, genderPreference)
        {
            this.Skills = skills;
            this.FieldPreference = fieldPreference;

            this.EmploymentStatus = "employed";
            this.HighestDegree = highestDegree;
            this.SchoolName = schoolName;
            this.Employer = employer;
            this.GradDate = gradDate;
            this.CareerGoals = careerGoals;
            this.CareerPlans = careerPlans;

            questionnaires = new List<MenteeQuestionnaire>();
            questionnaires.Add(initialQuestionnaire);
        }
    }
}