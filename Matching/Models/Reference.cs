using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Matching.Models
{
    //class for mentor references
    public class Reference
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public string Relationship { get; set; }

        public Reference(string FirstName, string LastName, string PhoneNumber, string Email, string Relationship)
        {
            this.FirstName = FirstName;
            this.LastName = LastName;
            this.PhoneNumber = PhoneNumber;
            this.Email = Email;
            this.Relationship = Relationship;
        }
    }
}