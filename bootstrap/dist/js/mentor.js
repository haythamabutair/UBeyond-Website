
/*
 * Global Variables
 */

// Whether part 1 / 2 / 3 of registration is complete
var isPart1Complete = false;
var isPart2Complete = false;
var isPart3Complete = false;

// update advance() and regress() and add toc to html and add toc checks

// Whether we are on part 1, part 2, or part 3
var currentPart = 1;

// Maximum number of references allowed
const MAX_REFERENCES = 5;

// Number of references currently active
var referenceCount = 0;


/*
 * Functions
 */

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
      if (currentPart == 1) {
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
      else if (currentPart == 2) {
        var empty = false;

        $('#part2').find('.form-group-mentor-required').children('.form-control').each(function() {
            if ($(this).val() == '') {
                empty = true;
            }
        });

        // References
        $('.reference:not(#reference-template)').find(':input').each(function() {
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
      else if (currentPart == 3) {
        var isTosAccepted = true;

        // Check ToS
        if ($('#mentorTerms input[name="refuseRad"]:checked').val() == 'No') {
          isTosAccepted = false;
        }

        if ($('#mentorTerms input[name="felonyRad"]:checked').val() == 'Yes') {
          isTosAccepted = false;
        }

        if ($('#mentorTerms input[name="misconductRad"]:checked').val() == 'Yes') {
          isTosAccepted = false;
        }

        if ($('#mentorTerms input[name="backgroundRad"]:checked').val() == 'No') {
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

// TODO: make sure completeness check on references is updated to new schema

function addReference() {
  if (referenceCount < MAX_REFERENCES) {
    var clone = $('#reference-template').clone(true);
    referenceCount++;

    // Fill in template
    clone.attr('id', 'reference' + referenceCount);
    clone.removeClass('hidden');
    clone.find('[name="refHeader"]').text('Reference ' + referenceCount);
    
    clone.appendTo('#references');
  }

  updateReferenceButtonStates();
}

function removeReference() {
  if (referenceCount > 0) {
    $('#reference' + referenceCount).remove();
    referenceCount--;
  }

  updateReferenceButtonStates();
}

function updateReferenceButtonStates() {
  $('#addRefBtn').prop('disabled', (referenceCount >= MAX_REFERENCES));
  $('#remRefBtn').prop('disabled', (referenceCount <= 0));
}

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
    $('#part1').removeClass(classesOnHide).addClass(classesOnShow);
    $('#part2').removeClass(classesOnShow).addClass(classesOnHide); // Will be shown
    $('#part3').removeClass(classesOnHide).addClass(classesOnShow);

    currentPart = 2;
  }
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
  if(isPart1Complete && isPart2Complete && isPart3Complete){
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

          // Add references
          var references = [];

          $('.reference:not(#reference-template)').each(function() {
            var refAddress = $(this).find('input[name="refStreet1"]').val()
              + ' ' + $(this).find('input[name="refStreet2"]').val()
              + ', ' + $(this).find('input[name="refCity"]').val()
              + ', ' + $(this).find('[name="refState"]').val();

            references.push(Model.createReferenceObject(
              {},
              $(this).find('input[name="refFirstName"]').val(),
              $(this).find('input[name="refLastName"]').val(),
              refAddress,
              $(this).find('input[name="refPhone"]').val(),
              $(this).find('input[name="refEmail"]').val(),
              $(this).find('input[name="refRelationship"]').val()
            ));
          });

          userObj['References'] = references;

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
