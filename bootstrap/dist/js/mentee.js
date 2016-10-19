//Global Var to allow onClick options to happen once info in inputed.
var canUseBtn = false;


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

// Function made to trigger after a date has been picked
$(function(){
  $(document).mousemove(function(){
      var allFilledOut = true;
      var mainForm = true;
      var radioForm = true;
      // If something is missing
      $('.form-group-mentee-required').children('input.form-control').each(function() {
        if ($(this).val() == '') {
              mainForm = false;
          }
      });

        // Check for student selection and the fields that matter
      if ($('input[name=studentRadio]:checked').val() == 'student'){

        $('#studentRegForm').children('.form-group-required').children('.form-control').each(function(){
          if($(this).val() == ''){
              radioForm = false;
            }
          });

      }else{
        $('#employedRegForm').children('.form-group-required').children('.form-control').each(function(){
          if($(this).val() == ''){
              radioForm = false;
            }
          });
        }

      if (radioForm == false || mainForm == false){
        allFilledOut = false;
      }

      if (!allFilledOut) {
        $('#menteeContBtn').attr('disabled', 'disabled');
        canUseBtn = false;
      } else {
        $('#menteeContBtn').removeAttr('disabled');
        canUseBtn = true;
      }
  });
});

/*
 * Begin registering a mentee in the database.
 *
 * TODO: Instead of alert(), use a more user-friendly alert system.
 */
function onMenteeContBtnClick(event) {
  event.preventDefault(); // Stop auto-navigation to href (chrome, firefox)
  //Check to see that all required information is provided.
  if(canUseBtn == true){
  // So we can navigate to the target HREF on success
    var href = document.getElementById("menteeContBtn").href;

    var email = document.getElementById('inputEmail').value;
    var password = document.getElementById('inputPassword').value;

    // Attempt to register the specified email and password
    Database.registerUser(email, password, function(success, response) {
      if (success) {
        // Update rest of mentee data
        var genderObj = document.getElementById('gender');
        var stateObj = document.getElementById('state_id');

        // Build address string
        var addressStr = document.getElementById('street1ID').value + "\n";
        
        if ('' != document.getElementById('street2ID').value) {
          addressStr.concat(document.getElementById('street2ID').value).concat("");
        }

        addressStr.concat(document.getElementById('cityID').value).concat("\n");
        addressStr.concat(stateObj.options[stateObj.selectedIndex].value).concat(", ");
        addressStr.concat(document.getElementById('zipID').value);

        // Collect personal info
        var menteeObj = Model.createPersonObject(
            document.getElementById('firstName').value,
            document.getElementById('lastName').value,
            document.getElementById('middleInitial').value,
            document.getElementById('preferredName').value,
            addressStr,
            document.getElementById('phoneNumber').value,
            email,
            genderObj.options[genderObj.selectedIndex].text,
            null, //TODO: Get languages spoken
            document.getElementById('bday').value
        );

        // Student data
        if (document.getElementById('studentRad').checked) {
          menteeObj["EmploymentStatus"] = "student";

          // Set school status
          if (document.getElementById('hsRadio').checked) {
            menteeObj["SchoolStatus"] = "high school";
          }
          else if (document.getElementById('undergradRadio').checked) {
            menteeObj["SchoolStatus"] = "undergraduate";
          }
          else {
            menteeObj["SchoolStatus"] = "graduate";
          }

          menteeObj["CurrentSchool"] = document.getElementById('currentSchool').value;
          menteeObj["Grade"] = document.getElementById('gradeLevel').value;
          menteeObj["Major"] = document.getElementById('major').value;
          menteeObj["Minor"] = document.getElementById('minor').value;
          menteeObj["FuturePlans"] = document.getElementById('afterGrad').value;
          menteeObj["ExpectedGradDate"] = document.getElementById('studentGradDate').value;
          menteeObj["InterestedInPostGrad"] = document.getElementById('postGradCheckBx').checked;
        }
        // Employer data
        else {
          menteeObj["EmploymentStatus"] = "employed";
          menteeObj["Employer"] = document.getElementById('currentEmployer').value;
          menteeObj["HighestDegree"] = document.getElementById('latestDegree').value;
          menteeObj["SchoolName"] = document.getElementById('latestSchool').value;
          menteeObj["GradDate"] = document.getElementById('employedGradDate').value;
          menteeObj["CareerPlans"] = document.getElementById('careerPlan').value;
          menteeObj["CareerGoals"] = document.getElementById('careerGoals').value;
        }

        // Update database entry for newly-registered used and navigate to next page
        Database.updateMenteeData(menteeObj, function(success, response) {
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
  }

  // Stop auto-navigation to href (IE)
  return false;
}
