using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Matching.Models
{
    public class Admin : Person
    {
        public Admin(string firstName, string lastName, string middleInitial, string preferredName, string address, string phoneNumber, string email, string gender, string birthdate, string pathToHeadshot, string pathToResume, string bio, string preferredStartDate, string languagePreference, string genderPreference) : base(firstName, lastName, middleInitial, preferredName, address, phoneNumber, email, gender, birthdate)
        {

        }
    }
}