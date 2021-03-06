
/*
 * Global Variables
 */

// Whether part 1 / 2 / 3 of registration is complete
var isPart1Complete = false;
var isPart2Complete = false;
var isPart3Complete = false;

// Whether we are on part 1, part 2, or part 3
var currentPart = 1;

/*
 * Functions
 */

// function to hide/show registration input fields depending on selection of student/notStudent radio buttons
function showHideRegisterInfo() {
  if ($('#studentRad').is(':checked')) {
    $('#levelRadios').show();
    $('#employedRegForm').hide();

    // Check high school vs college
    if ($('#radio-highschool').is(':checked')) {
      $('#studentRegForm').hide();
      $('#highSchoolStudentRegForm').show();
    }
    else {
      $('#studentRegForm').show();
      $('#highSchoolStudentRegForm').hide();
    }
  }
  else {
    $('#levelRadios').hide();
    $('#studentRegForm').hide();
    $('#highSchoolStudentRegForm').hide();
    $('#employedRegForm').show();
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
    message.innerHTML = "Passwords do not match.";
  }
}

// Function made to trigger after a date has been picked
$(function(){
  $(document).mousemove(function(){
      // Part 1 checks
      if (currentPart == 1) {
        var allFilledOut = true;
        var mainForm = true;
        var radioForm = true;

        // If something is missing
        $('#part1').find('.form-group-mentee-required').find('.form-control').each(function() {
          if ($(this).val() == '' || $(this).val() == null) {
            mainForm = false;
          }
        });

          // Check for student selection and the fields that matter
        if ($('input[name=studentRadio]:checked').val() == 'student'){
          // Check if high school
          if($('input[name=levelRadio]:checked').val() == 'highSchool') {
            $('#highSchoolStudentRegForm').children('.form-group-required').find('.form-control').each(function() {
              if ($(this).val() == '' || $(this).val() == null) {
                radioForm = false;
              }
            });
          }
          else {
            $('#studentRegForm').children('.form-group-required').find('.form-control').each(function() {
              if ($(this).val() == '' || $(this).val() == null) {
                radioForm = false;
              }
            });
          }
        }
        else {
          $('#employedRegForm').children('.form-group-required').find('.form-control').each(function(){
            if ($(this).val() == '' || $(this).val() == null) {
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
      else if (currentPart == 2) {
        var empty = false;

        $('#part2').find('.form-group-mentee-required').find('.form-control').each(function() {
          if ($(this).val() == '' || $(this).val() == null) {
              empty = true;
          }
        });

        if (empty) {
          $('#advanceBtn2').attr('disabled', 'disabled');
        } else {
          $('#advanceBtn2').removeAttr('disabled');
        }

        isPart2Complete = !empty;
      }

      // Part 3 checks (ToC)
      else if (currentPart == 3) {
        var isTosAccepted = true;

        // Check ToS
        if ($('#menteeTerms input[name="particRad"]:checked').val() == 'No') {
          isTosAccepted = false;
        }

        if ($('#menteeTerms input[name="releaseRad"]:checked').val() == 'No') {
          isTosAccepted = false;
        }

        if ($('#menteeTerms input[name="agreeRad"]:checked').val() == 'No') {
          isTosAccepted = false;
        }

        // Enable / disable register button
        if (isTosAccepted) {
          $('#registerBtn').removeAttr('disabled');
        }
        else {
          $('#registerBtn').attr('disabled', 'disabled');
        }

        isPart3Complete = isTosAccepted;
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
  if (currentPart == 1 && isPart1Complete) {
    $('#part1').removeClass(classesOnShow).addClass(classesOnHide);
    $('#part2').removeClass(classesOnHide).addClass(classesOnShow); // Will be shown
    $('#part3').removeClass(classesOnShow).addClass(classesOnHide);

    currentPart = 2;
  }
  // Hide part 2, display part 3
  else if (currentPart == 2 && isPart2Complete) {
    $('#part1').removeClass(classesOnShow).addClass(classesOnHide);
    $('#part2').removeClass(classesOnShow).addClass(classesOnHide);
    $('#part3').removeClass(classesOnHide).addClass(classesOnShow); // Will be shown

    currentPart = 3;
  }
}

/*
 * Display fields for part 1 of mentee registration.
 */
function regress(event) {
  // Classes for hiding/showing registration sections
  const classesOnShow = 'col-xs-12 registercol';
  const classesOnHide = 'hidden';

  // Hide part 2, display part 1
  if (currentPart == 2) {
    $('#part1').removeClass(classesOnHide).addClass(classesOnShow); // Will be shown
    $('#part2').removeClass(classesOnShow).addClass(classesOnHide);
    $('#part3').removeClass(classesOnShow).addClass(classesOnHide);

    currentPart = 1;
  }
  // Hide part 3, display part 2
  else if (currentPart == 3) {
    $('#part1').removeClass(classesOnShow).addClass(classesOnHide);
    $('#part2').removeClass(classesOnHide).addClass(classesOnShow); // Will be shown
    $('#part3').removeClass(classesOnShow).addClass(classesOnHide);

    currentPart = 2;
  }
}

/*
 * Perform registration functions.
 */
function register(event) {
  // Stop auto-navigation to href (chrome, firefox)
  event.preventDefault();

  if (isPart1Complete && isPart2Complete && isPart3Complete) {
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
          + ($('#street2ID').val() == '' ? '' : ' ' + $('#street2ID').val())
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

          var studentInfoObj = {};

          // School info
          if (!$('#radio-highschool').is(':checked')) {
            studentInfoObj['CurrentSchool'] = $('#currentSchool').val();
            studentInfoObj['Major'] = $('#major').val();
            if ($('#minor').val() != "") {
              studentInfoObj['Minor'] = $('#minor').val();
            }
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
            studentInfoObj['Grade'] = $('#gradeLevel').val();
            if ($('#currentHSSchool').val() != "") {
              studentInfoObj['CurrentSchool'] = $('#currentHSSchool').val();
            }
            studentInfoObj['FuturePlans'] = $('#afterHSGrad').val();
            studentInfoObj['ExpectedGradDate'] = $('#studentHSGradDate').val();

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

        // Resume upload
        $('#resumeBtn').filestyle({
          buttonName : 'btn-danger',
          buttonText : 'Upload Resume'
        });

        // Headshot upload
        $('#picBtn').filestyle({
          buttonName : 'btn-danger',
          buttonText : 'Upload Picture'
        });

        var resumeFileName = null;
        var headshotFileName = null;

        // Get uploaded resume file name
        if ($('#resumeBtn')[0].files[0]) {
          var resumeFile = $('#resumeBtn')[0].files[0];

          // TODO: since we are not waiting to hear back from uploadResume,
          // TODO:    we will just manually build the path. If we change where
          // TODO:    we store resumes, update this.
          resumeFileName = "documents/" + response + "_" + resumeFile.name; // response is uid

          // upload resume
          // NOTE: doing nothing with callback
          Database.uploadResume(resumeFile, function(a,b) {});
        }

        // Get uploaded headshot file name
        if ($('#picBtn')[0].files[0]) {
          var headshotFile = $('#picBtn')[0].files[0];

          // TODO: since we are not waiting to hear back from uploadHeadshot,
          // TODO:    we will just manually build the path. If we change where
          // TODO:    we store headshots, update this.
          headshotFileName = "images/" + response + "_" + headshotFile.name; // response is uid

          // upload headshot
          // NOTE: doing nothing with callback
          Database.uploadHeadshot(headshotFile, function(a,b) {});
        }

        // Gather user registration information
        personObj = Model.createUserObject(
          personObj,
          headshotFileName,
          resumeFileName,
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
                    // Call registration endpoint & matching endpoint
                    callRegistrationEndpoint();
                  } else {
                    //failed to save initial
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
  showHideRegisterInfo();
});

function callRegistrationEndpoint() {
  $.ajax({
      url: "http://mentorshipatlanta.info/register/mentee/" + firebase.auth().currentUser.uid,
      type: "POST",
      success: function(response) {
          console.log("registration endpoint for mentee returned successfully with " + response);
          
          // Call matching endpoint
          callMatchingEndpoint();
      },
      error: function(xhr) {
          console.log("registration endpoint for mentee returned an error: " + xhr);

          // alert failure
          alert("Failed to call registration endpoint, but registration was successful!");

          // Call matching endpoint
          callMatchingEndpoint();
      }
  });
}

function callMatchingEndpoint() {
  // Run matching algorithm for mentor
  $.ajax({
      url: "http://mentorshipatlanta.info/match/mentee/" + firebase.auth().currentUser.uid,
      type: "POST",
      success: function(response) {
          console.log("matching endpoint for mentee returned successfully with " + response);
          
          // Navigate to home page via href in button of notification div
          window.open("home.html", "_self");
      },
      error: function(xhr) {
          console.log("matching endpoint for mentee returned an error: " + xhr);

          // alert failure
          alert("Failed to call matching algorithm, but registration was successful!");

          // Navigate to home page via href in button of notification div
          window.open("home.html", "_self");
      }
  });
}
