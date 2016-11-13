
/*
 * Global Variables
 */

// Whether to log debug information to the console
const logDebugInfo = true;

// Whether part 1 / part 2 of registration is complete
var isPart1Complete = false;
var isPart2Complete = false;

// Whether we are on part 1 or part 2
var isPart1Active = true;

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
      if (!isPart1Complete) {
        var empty = false;

        $('#part1').find('.form-group-mentor-required').children('input.form-control').each(function() {
            if ($(this).val() == '') {
                empty = true;
            }
        });

        if (empty) {
            $('#advanceBtn').attr('disabled', 'disabled');
            isPart1Complete = false;
        } else {
            $('#advanceBtn').removeAttr('disabled');
            isPart1Complete = true;
        }
      }
      else {
        var empty = false;

        $('#part2').find('.form-group-mentor-required').children('.form-control').each(function() {
            if ($(this).val() == '') {
                empty = true;
            }
        });

        // References
        $('#references').find('.element').find(':input').each(function() {
            if ($(this).val() == '') {
                empty = true;
            }
        });

        if (empty) {
            $('#registerBtn').attr('disabled', 'disabled');
        } else {
            $('#registerBtn').removeAttr('disabled');
        }

        isPart2Complete = !empty;
      }
  });
});

/*
 * Display fields for part 2 of mentee registration.
 */
function advance(event) {
  // Classes for hiding/showing registration sections
  const classesOnShow = 'col-xs-12 registercol';
  const classesOnHide = 'hidden';

  // Hide part 1, display part 2  
  if (isPart1Complete) {
    $('#part1').removeClass(classesOnShow).addClass(classesOnHide);
    $('#part2').removeClass(classesOnHide).addClass(classesOnShow);

    isPart1Active = false;
  }
}

/*
 * Display fields for part 1 of mentee registration.
 */
function regress(event) {
  // Classes for hiding/showing registration sections
  const classesOnShow = 'col-xs-12 registercol';
  const classesOnHide = 'hidden';

  // Hide part 1, display part 2  
  $('#part1').removeClass(classesOnHide).addClass(classesOnShow);
  $('#part2').removeClass(classesOnShow).addClass(classesOnHide);

  isPart1Active = true;
}

/*
 * Begin registering a mentor in the database.
 *
 * TODO: Instead of alert(), use a more user-friendly alert system.
 */
function register(event) {
  // Stop auto-navigation to href (chrome, firefox)
  event.preventDefault();

  //Check to see that all required information is provided.
  if(isPart1Complete == true){
    var email    = $('#inputEmail').val();
    var password = $('#inputPassword').val();

    // Attempt to register the specified email and password
    Database.registerUser(email, password, function(success, response) {
      if (success) {
        // Build address string
        var addressStr = $('#street1ID').val()
          + ' ' + $('#street2ID').val()
          + ', ' + $('#cityID').val()
          + ', ' + $('#state_id').val()
          + ', ' + $('#zipID').val();

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

        // Update database entry for newly-registered used and navigate to next page
        Database.updateMentorData(personObj, function(success, response) {
          // So we can navigate to the target HREF on success
          var href = $('#registerBtn').attr('href');

          // TODO: Resume upload
          $('#resumeBtn').filestyle({
            buttonName : 'btn-danger',
            buttonText : 'Upload Resume'
          });

          // TODO: Headshot upload
          $('#picBtn').filestyle({
            buttonName : 'btn-danger',
            buttonText : 'Upload Piccccc'
          });

          var resumeFile   = null;
          var headshotFile = null;

          // Get uploaded resume file name
          if ($('#resumeBtn')[0].files[0]) {
            resumeFile = response + '_' + $('#resumeBtn')[0].files[0].name;
          }

          // Get uploaded headshot file name
          if ($('#picBtn')[0].files[0]) {
            headshotFile = response + '_' + $('#picBtn')[0].files[0].name;
          }

          // Gather user registration information
          var userObj = Model.createUserObject(
            {},
            headshotFile,
            resumeFile,
            $('#mentorBio').val(),
            $('#preferedStartDate').val(),
            $('#fluentLang').val(),
            $('#languagePref').val(),
            $('#prefGender').val(),
            true // Initially available
          );

          // Gether rest of mentor registration information
          var levelPrefArr = [];

          if ($('#hsLevelCheck').is(':checked')) {
            levelPrefArr.push('high school');
          }

          if ($('#undergradLevelCheck').is(':checked')) {
            levelPrefArr.push('undergraduate');
          }

          if ($('#gradLevelCheck').is(':checked')) {
            levelPrefArr.push('graduate');
          }

          userObj['Employer']              = $('#currentEmployer').val();
          userObj['YearsOfExperience']     = $('#yearsExp').val();
          userObj['FieldOfExpertise']      = $('#field').val();
          userObj['MenteeLevelPreference'] = levelPrefArr;
          userObj['Strengths']             = $('#mentorSkills').val();

          Database.updateMentorData(userObj, function(success, response) {
            // Collect mentee form data
            if (success) {
              var mentorFormData = {
                'WhatKindOfMentor':      $('#mFormQ1').val(),
                'PastEffectiveMentors':  $('#mFormQ2').val(),
                'WhatMadeMostInfluence': $('#mFormQ3').val(),
                'GreatMentors':          $('#mFormQ4').val(),
                'MentoringImportance':   $('#mFormQ5').val(),
                'MenteeWillGain':        $('#mFormQ6').val(),
                'PlanToGain':            $('#mFormQ7').val()
              };

              // Submit mentor form and navigate to home page
              Database.setMentorFormData(mentorFormData, function(success, response) {
                if (success) {
                  // Navigate to home page via href in button of notification div
                  // (see Global.showNotification)
                  // TODO: Add notification
                  Global.showNotification('Registration successful!', false);
                  //window.location.href = href;
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
