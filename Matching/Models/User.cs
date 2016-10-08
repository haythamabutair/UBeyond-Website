using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Matching.Models
{
    public class User
    {
        public struct NameStruct
        {
            public string first;
            public string last;
            public string middle;
            public string preferred;
        }

        public struct StudentInfoStruct
        {
            public string currentSchool;
            public string expectedGraduationDate;
            public string futurePlans;
            public bool interestedInPostGrad;
            public string major;
            public string minor;
        }

        public string Bio { get; set; }
        public string Birthdate { get; set; }
        public string Email { get; set; }
        public string FieldPreference { get; set; }
        public string FirstMeetingDatePreference { get; set; }
        public string Gender { get; set; }
        public string GenderPreference { get; set; }
        public string LanguagePreference { get; set; }
        public NameStruct Name { get; set; }
        public string Phone { get; set; }
        public StudentInfoStruct StudentInfo { get; set; }
        public string UserType { get; set; }
        public bool IsAvailable { get; set; }
    }
}