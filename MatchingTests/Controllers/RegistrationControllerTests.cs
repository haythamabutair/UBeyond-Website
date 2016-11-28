using Microsoft.VisualStudio.TestTools.UnitTesting;
using Matching.Controllers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Matching.Controllers.Tests
{
    [TestClass()]
    public class RegistrationControllerTests
    {
        [TestMethod()]
        public void RegisterMenteeTest()
        {
            RegistrationController controller = new RegistrationController();
            controller.RegisterMentee("HJinW8SYhZdEfbgtWueMPzjtENn2");
        }

        [TestMethod()]
        public void RegisterFakeMenteeTest()
        {
            RegistrationController controller = new RegistrationController();
            controller.RegisterMentee("FakeMentee");
        }

        [TestMethod()]
        public void RegisterMentorTest()
        {
            RegistrationController controller = new RegistrationController();
            controller.RegisterMentor("LBSd2c8BuqVQq4osY2H9oKv5Gnv2");
        }

        [TestMethod()]
        public void RegisterFakeMentorTest()
        {
            RegistrationController controller = new RegistrationController();
            controller.RegisterMentor("FakeMentor");
        }
    }
}