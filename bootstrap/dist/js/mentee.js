
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


/*
 * Functions
 */

// function to hide/show registration input fields depending on selection of student/notStudent radio buttons
function showHideRegisterInfo() {
  if ($('#studentRad').is(':checked')) {
    $('#levelRadios').show();
    $('#studentRegForm').show();
    $('#employedRegForm').hide();

    checkStudentLevel();
  }
  else {
    $('#levelRadios').hide();
    $('#studentRegForm').hide();
    $('#employedRegForm').show();
  }
}

function checkStudentLevel() {
    // Check if HS or Undergrad / Graduate
    if ($('#radio-highschool').is(':checked')) {
      $('#gradeLevel').parent().show();

      $('#major').parent().hide();
      $('#minor').parent().hide();
    }
    else {
      $('#gradeLevel').parent().hide();

      $('#major').parent().show();
      $('#minor').parent().show();
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
      // Part 1 checks
      if (isPart1Active) {
        var allFilledOut = true;
        var mainForm = true;
        var radioForm = true;

        // If something is missing
        $('#part1').find('.form-group-mentee-required').children('input.form-control').each(function() {
          if ($(this).val() == '') {
                mainForm = false;
            }
        });

          // Check for student selection and the fields that matter
        if ($('input[name=studentRadio]:checked').val() == 'student'){
          $('#studentRegForm').children('.form-group-required').children('.form-control').each(function() {
            // Check if highschool student or not
            if($('input[name=levelRadio]:checked').val() == 'highSchool') {
              // Ignore major and minor if in high school
              if ($(this).attr('id') != 'major' && $(this).attr('id') != 'minor') {
                if ($(this).val() == '') {
                  radioForm = false;
                }
              }
            } else {
              // Ignore grade level if not in high school
              if ($(this).attr('id') != 'gradeLevel') {
                if($(this).val() == ''){
                  radioForm = false;
                }
              }
            }
          });
        } else {
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
          $('#advanceBtn').attr('disabled', 'disabled');
          isPart1Complete = false;
        } else {
          $('#advanceBtn').removeAttr('disabled');
          isPart1Complete = true;
        }
      }

      // Part 2 checks
      else {
        var empty = false;

        $('#part2').find('.form-group-mentee-required').children('.form-control').each(function() {
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
 * Perform registration functions.
 */
function register(event) {
  // Stop auto-navigation to href (chrome, firefox)
  event.preventDefault();

  if (isPart2Complete) {
    // so we can navigate to the target HREF on success
    var href = $('#registerBtn').attr('href');

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

        // Get uploaded resume file name (response == userID)
        if ($('#resumeBtn')[0].files[0]) {
          resumeFile = response + '_' + $('#resumeBtn')[0].files[0].name;
        }

        // Get uploaded headshot file name (response == userID)
        if ($('#picBtn')[0].files[0]) {
          headshotFile = response + '_' + $('#picBtn')[0].files[0].name;
        }

        // Gather user registration information
        personObj = Model.createUserObject(
          personObj,
          headshotFile,
          resumeFile,
          $('#menteeBio').val(),
          $('#meetingDatePref').val(),
          $('#languagesSpoken').val(),
          $('#languagePref-mentee').val(),
          $('#genderPref').val(),
          true // Initially available
        );

        personObj['MenteeSkills']    = $('#menteeSkills').val();
        personObj['FieldPreference'] = $('#field-mentee').val();

        // Update database entry for newly-registered used and navigate to next page
        Database.updateMenteeData(personObj, function(success, response) {
          if(success) {
            updateFunc(updateObj, function(success, response) {
              // Collect mentee form data
              if (success) {
                var menteeFormData = {
                  'Improvements':    $('#mFormQ1').val(),
                  'ToDo':            $('#mFormQ2').val(),
                  'HowWillIKnow':    $('#mFormQ3').val(),
                  'WhenSatisfied':   $('#mFormQ4').val(),
                  'HowToHelp':       $('#mFormQ5').val(),
                  'WhenToReachGoal': $('#mFormQ6').val()
                };

                // Submit mentee form and navigate to home page
                Database.setMenteeFormData(menteeFormData, function(success, response) {
                  if (success) {
                    // Navigate to home page via href in button of notification div
                    // (see Global.showNotification)
                    // TODO: Add notification
                    Global.showNotification('Registration successful!', false);
                    
                    //window.location.href = href;
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


// Code needed to initialize the multiselect function
$(document).ready(function() {
  // Setup the multiselect
  $('.need-multi').multiselect({
    // Shortens the height and makes the box small
    maxHeight: 200
  });

  // Update student info section
  checkStudentLevel();
});
