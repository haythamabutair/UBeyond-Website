// function to hide/show registration input fields depending on selection of student/notStudent radio buttons
function showHideRegisterInfo() {
  var ifStudent = document.getElementById('studentRad');
  var ifNotStudent = document.getElementById('notStudentRad');
  studentRegForm.style.display = ifStudent.checked ? "block" : "none";
  levelRadios.style.display = ifStudent.checked ? "block" : "none";
  employedRegForm.style.display = ifNotStudent.checked ? "block" : "none";

}

// function to check if password and confirmation password match. gives alert if they do not.
function checkPasswordsMatch() {
  var pass1 = document.getElementById('inputPassword');
  var pass2 = document.getElementById('confirmPassword');
  var message = document.getElementById('confirmMessage');

  if (pass1.value == pass2.value) {
    message.innerHTML = "";
  } else {
    message.innerHTML = "Passwords do not match."
  }

}

// function to register new mentee in database
function onMenteeContBtnClick(caller) {
  event.preventDefault(); // Stop auto-navigation to href (chrome, firefox)
  
  // So we can navigate to the target HREF on success
  var href = document.getElementById(caller.id).href;

  // Get initial register variables
  var username = document.getElementById('inputUsername').value;
  var email = document.getElementById('inputEmail').value;
  var password = document.getElementById('inputPassword').value;

  // Call register function and store result
  var result = Database.registerMentee(username, email, password, function(result) {
    if (result == "success") {
      // Update rest of mentee data
      var genderObj = document.getElementById('gender');

      var data = {
        "birthdate": document.getElementById('bday').value,
        "gender": genderObj.options[genderObj.selectedIndex].text,
        "name": {
          "first": document.getElementById('firstName').value,
          "middle": document.getElementById('middleInitial').value,
          "last": document.getElementById('lastName').value,
          "preferred": document.getElementById('preferredName').value
        }
      };

      // Student data
      if (document.getElementById('studentRad').checked) {
        // TODO: include if interested in grad school
        data["studentInfo"] = {
          "currentSchool": document.getElementById('currentSchool').value,
          "major": document.getElementById('major').value,
          "minor": document.getElementById('minor').value,
          "futurePlans": document.getElementById('afterGrad').value,
          "expectedGraduationDate": document.getElementById('studentGradDate').value
        };
      }
      // Employer data
      else {
        data["employeeInfo"] = {
          "employer": document.getElementById('currentEmployer').value,
          "latestDegree": document.getElementById('latestDegree').value,
          "latestSchool": document.getElementById('latestSchool').value,
          "graduationDate": document.getElementById('employedGradDate').value,
          "careerPlans": document.getElementById('careerPlan').value,
          "careerGoals": document.getElementById('careerGoals').value
        };
      }

      Database.updateMenteeData(username, data);

      // Now navigate to target href
      window.location.href = href + "?username=" + username;
    }
    else {
      // TODO: some other alert would be better probably
      alert(result);
    }
  });

  // Stop auto-navigation to href (IE)
  return false;
}