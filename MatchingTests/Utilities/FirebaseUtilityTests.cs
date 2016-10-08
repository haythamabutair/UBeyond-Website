using Microsoft.VisualStudio.TestTools.UnitTesting;
using Matching.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Matching.Utilities.Tests
{
    [TestClass()]
    public class FirebaseUtilityTests
    {
        [TestMethod()]
        public void GetUserTest()
        {
            Assert.AreEqual(FirebaseUtility.GetUserEmail("LJliMHILEVX1lzO6vRyC0sEl63e2").Result, "evanbailey122@gmail.com");
        }

        [TestMethod()]
        public void GetUserFirstNameTest()
        {
            Assert.AreEqual(FirebaseUtility.GetUserFirstName("LJliMHILEVX1lzO6vRyC0sEl63e2").Result, "Evan");
        }
    }
}