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
        public void RegisterTest()
        {
            RegistrationController controller = new RegistrationController();
            Assert.IsNotNull(controller.Register("LJliMHILEVX1lzO6vRyC0sEl63e2"));
        }
    }
}