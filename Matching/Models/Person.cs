using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Matching.Models
{
    public abstract class Person
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string MiddleInitial { get; set; }
        public string PreferredName { get; set; }
        public string Address { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public string Gender { get; set; } //Male or Female
        public List<string> Languages { get; set; }
        public DateTime Birthdate { get; set; }

        protected Person(string firstName, string lastName, string middleInitial, string preferredName, string address, string phoneNumber, string email, string gender, List<string> languages, DateTime birthdate)
        {
            this.FirstName = firstName;
            this.LastName = lastName;
            this.MiddleInitial = middleInitial;
            this.PreferredName = preferredName;
            this.Address = address;
            this.PhoneNumber = phoneNumber;
            this.Email = email;
            this.Gender = gender;
            this.Languages = languages;
            this.Birthdate = birthdate;
        }
    }
}