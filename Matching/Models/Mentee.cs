using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Matching.Models
{
    public class Mentee : User
    {
        public List<MenteeQuestionnaire> questionnaires { get; set; }

        public string MenteeSkills { get; set; }
        public string FieldPreference { get; set; }

        public string EmploymentStatus { get; set; } //student or employed, internal

        //JSon serializer
        [JsonConstructor]
        public Mentee(string Address, string Bio, string Birthdate, string Email, string EmploymentStatus, string FieldPreference, string FirstName, string Gender, string GenderPreference, string IsAvailable, string LanguagePreference, List<string> Languages, string LastName, string MenteeSkills, string MiddleInitial, string PhoneNumber, string PreferredName, string PreferredStartDate): base(FirstName, LastName, MiddleInitial, PreferredName, Address, PhoneNumber, Email, Gender, Birthdate, Bio, PreferredStartDate, LanguagePreference, GenderPreference, Languages, IsAvailable)
        {
            this.MenteeSkills = MenteeSkills;
            this.FieldPreference = FieldPreference;
            this.EmploymentStatus = EmploymentStatus;
        }

        //if undergraduate or graduate
        /*
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
        }*/
    }
}