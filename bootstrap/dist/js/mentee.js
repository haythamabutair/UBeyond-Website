//Global Var to allow onClick options to happen once info in inputed.
var canUseBtn = false;


// function to hide/show registration input fields depending on selection of student/notStudent radio buttons
function showHideRegisterInfo() {
  var ifStudent = document.getElementById('studentRad');
  var ifNotStudent = document.getElementById('notStudentRad');
  var ifHighSchoolStudent = document.getElementById('radio-highschool')

  studentRegForm.style.display = ifStudent.checked ? "block" : "none";
  levelRadios.style.display = ifStudent.checked ? "block" : "none";
  employedRegForm.style.display = ifNotStudent.checked ? "block" : "none";
  //Check to handle when changing from Student to Non-student
  //And adjusting all possible swaps
  if(ifStudent.checked){
    showStudentLevels()
  }
}
//Method for what to show based on the radio buttons pressed.
function showStudentLevels(){
  //gets radio buttons for if your a student and if in highschool
  var ifStudent = document.getElementById('studentRad');
  var ifHighSchoolStudent = document.getElementById('radio-highschool')
  //If both are checked show highschool informaton
  if(ifStudent.checked && ifHighSchoolStudent.checked){
    highSchoolStudentRegForm.style.display = 'block'
    studentRegForm.style.display = 'none'
    //Show Grad or UnderGrad information
  }else if(ifStudent.checked && !ifHighSchoolStudent.checked){
    highSchoolStudentRegForm.style.display = 'none'
    studentRegForm.style.display = 'block'
    //Show nothing relating to students since its non-student selected
  }else{
    highSchoolStudentRegForm.style.display = 'none'
    studentRegForm.style.display ='none'
  }

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
 */
function onMenteeContBtnClick(event) {
  // Stop auto-navigation to href (chrome, firefox)
  event.preventDefault();
  
  //Check to see that all required information is provided.
  if(canUseBtn == true){
    // So we can navigate to the target HREF on success
    var href = $('#menteeContBtn').attr('href');

    var email    = $('#inputEmail').val();
    var password = $('#inputPassword').val();

    // Attempt to register the specified email and password
    Database.registerUser(email, password, function(success, response) {
      if (success) {
        // Holds target updating function
        var updateFunc, updateObj;

        // Build address string
        var addressStr = $('#street1ID').val()
          + ' ' + $('#street2ID').val()
          + ', ' + $('#cityID').val()
          + ', ' + $('#state_id').val()
          + ', ' + $('#zipID').val();

        // Update rest of mentee data
        // Gather personal registration info
        var personObj = Model.createPersonObject(
          {},
          $('#firstName').val(),
          $('#lastName').val(),
          $('#middleInitial').val(),
          $('#preferredName').val(),
          addressStr,
          $('#phoneNumber').val(),
          email,
          $('#gender').val(),
          $('#bday').val()
        );

        // Student data
        if ($('#studentRad').is(':checked')) {
          personObj['EmploymentStatus'] = 'student';

          var studentInfoObj = {
            'Grade': $('#gradeLevel').val()
          };

          // School info
          if (!$('#radio-highschool').is(':checked')) {
            studentInfoObj['CurrentSchool'] = $('#currentSchool').val();
            studentInfoObj['Major'] = $('#major').val();
            studentInfoObj['Minor'] = $('#minor').val();
            studentInfoObj['FuturePlans'] = $('#afterGrad').val();
            studentInfoObj['ExpectedGradDate'] = $('#studentGradDate').val();
            studentInfoObj['InterestedInPostGrad'] = $('#postGradCheckBx').is(':checked');
            
            // Set school status
            if ($('#radio-Undergrad').is(':checked')) {
              studentInfoObj['SchoolStatus'] = 'undergraduate';
            }
            else {
              studentInfoObj['SchoolStatus'] = 'graduate';
            }
          }
          else {
            studentInfoObj['SchoolStatus'] = 'high school';
          }

          updateFunc = Database.setStudentInfoData;
          updateObj  = studentInfoObj;
        }
        // Employee info
        else {
          personObj['EmploymentStatus'] = 'employed';

          var employeeInfoObj = {
            'Employer':      $('#currentEmployer').val(),
            'HighestDegree': $('#latestDegree').val(),
            'SchoolName':    $('#latestSchool').val(),
            'GradDate':      $('#employedGradDate').val(),
            'CareerPlans':   $('#careerPlan').val(),
            'CareerGoals':   $('#careerGoals').val()
          };

          updateFunc = Database.setEmployeeInfoData;
          updateObj  = employeeInfoObj;
        }

        // Update database entry for newly-registered used and navigate to next page
        Database.updateMenteeData(personObj, function(success, response) {
          if(success) {
            updateFunc(updateObj, function(success, response) {
              if(success) {
                // Now navigate to target href
                window.location.href = href;
              }
              // Display notification on failure
              // TODO: Handle specific errors
              else {
                Global.showNotification('Something went wrong! Error:\n' + response, true);
              }
            });
          }
          // Display notification on failure
          // TODO: Handle specific errors
          else {
            Global.showNotification('Something went wrong! Error:\n' + response, true);
          }
        });
      }
      // Display notification on failure
      // TODO: Handle specific errors
      else {
        Global.showNotification('Something went wrong! Error:\n' + response, true);
      }
    });
  }

  // Stop auto-navigation to href (IE)
  return false;
}
