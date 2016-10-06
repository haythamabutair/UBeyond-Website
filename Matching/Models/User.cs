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

        //internal
        public bool IsAvailable { get; set; }
    }
}