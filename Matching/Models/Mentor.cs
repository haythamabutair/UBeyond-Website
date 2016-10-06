using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Matching.Models
{
    public class Mentor : User
    {
        public string Employer { get; set; }
        public int YearsOfExperience { get; set; }
        public string FieldOfExpertise { get; set; }
        public List<string> MenteeLevelPreference { get; set; } //subset of <high school, graduate, undergraduate>
        public string Strengths { get; set; }
    }
}