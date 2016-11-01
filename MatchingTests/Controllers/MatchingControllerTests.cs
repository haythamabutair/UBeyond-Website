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
    public class MatchingControllerTests
    {
        [TestMethod()]
        public void MatchMentorTest()
        {
            MatchingController controller = new MatchingController();
            controller.MatchMentor("LBSd2c8BuqVQq4osY2H9oKv5Gnv2");
        }
    }
}