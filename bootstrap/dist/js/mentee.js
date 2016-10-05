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

// Function to make the datepicker pop up
$(function() {
   $( "#birthdate-datepicker" ).datepicker();
});

// Function to require main information to be filled out
$(function(){
  $('.form-group-mentee-required').children('input.form-control').keyup(function() {

    var empty = false;
    $('.form-group-mentee-required').children('input.form-control').each(function() {
        if ($(this).val() == '') {
            empty = true;
        }
    });

    if (empty) {
        $('#menteeContBtn').attr('disabled', 'disabled');
    } else {
        $('#menteeContBtn').removeAttr('disabled');
    }
  });
});
/*
 * Begin registering a mentee in the database.
 *
 * TODO: Instead of alert(), use a more user-friendly alert system.
 */
function onMenteeContBtnClick(caller) {
  event.preventDefault(); // Stop auto-navigation to href (chrome, firefox)

  // So we can navigate to the target HREF on success
  var href = document.getElementById(caller.id).href;

  var email = document.getElementById('inputEmail').value;
  var password = document.getElementById('inputPassword').value;

  // Attempt to register the specified email and password
  Database.registerUser(email, password, function(success, response) {
    if (success) {
      // Update rest of mentee data
      var genderObj = document.getElementById('gender');

      var data = {
        "userType": "mentee",
        "email": email,
        "birthdate": document.getElementById('bday').value,
        "gender": genderObj.options[genderObj.selectedIndex].text,
        "name": {
          "first": document.getElementById('firstName').value,
          "middle": document.getElementById('middleInitial').value,
          "last": document.getElementById('lastName').value,
          "preferred": document.getElementById('preferredName').value
        },
        "phone": document.getElementById('phoneNumber').value
      };

      // Student data
      if (document.getElementById('studentRad').checked) {
        data["studentInfo"] = {
          "currentSchool": document.getElementById('currentSchool').value,
          "major": document.getElementById('major').value,
          "minor": document.getElementById('minor').value,
          "futurePlans": document.getElementById('afterGrad').value,
          "expectedGraduationDate": document.getElementById('studentGradDate').value,
          "interestedInPostGrad": document.getElementById('postGradCheckBx').checked
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

      // Update database entry for newly-registered used and navigate to next page
      Database.updateUserData(data, function(success, response) {
        if(success) {
          // Now navigate to target href
          window.location.href = href;
        }
        else {
          alert(response);
        }
      });
    }
    else {
      alert(response);
    }
  });

  // Stop auto-navigation to href (IE)
  return false;
}
