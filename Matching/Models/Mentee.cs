using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Matching.Models
{
    public class Mentee
    {
        public string Username { get; set; }
        public string MentorUsername { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string MiddleName { get; set; }
        public string PreferredName { get; set; }
        public string Address { get; set; }
        public string Bio { get; set; }
        public DateTime Birthdate { get; set; }
        public string CurrentStatus { get; set; }
        public bool IsAvailable { get; set; }
        public string Email { get; set; }
        public string Gender { get; set; }
        public List<string> Languages { get; set; }
        public List<string> Skills { get; set; }
        public string PhoneNumber { get; set; }
        public DateTime PreferredStartDate { get; set; }
        public string PathToHeadshot { get; set; }
        public string PathToResume { get; set; }
        public string CurrentSchool { get; set; }
        public string DegreeProgram { get; set; }
        public DateTime ExpectedGradDate { get; set; }
        public string FuturePlans { get; set; }
        public int Grade { get; set; }
        public string Major { get; set; }
        public string Minor { get; set; }


    }
}