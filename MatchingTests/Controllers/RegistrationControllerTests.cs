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
            controller.RegisterMentor("YyhDeQ2Qn2dp0VAAhHIB040dqVF3");
        }

        [TestMethod()]
        public void RegisterFakeMentorTest()
        {
            RegistrationController controller = new RegistrationController();
            controller.RegisterMentor("FakeMentor");
        }
    }
}