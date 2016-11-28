using Microsoft.VisualStudio.TestTools.UnitTesting;
using Matching.Controllers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace Matching.Controllers.Tests
{
    [TestClass()]
    public class MatchingControllerTests
    {
        [TestMethod()]
        public void MatchMentorTest()
        {
            MatchingController controller = new MatchingController();
            IHttpActionResult result = controller.MatchMentee("9so938TlYRVvEMwt5ZohUIwifhr2");
        }
    }
}