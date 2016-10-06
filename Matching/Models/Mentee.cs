using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Matching.Models
{
    public class Mentee : User
    {
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
    }
}