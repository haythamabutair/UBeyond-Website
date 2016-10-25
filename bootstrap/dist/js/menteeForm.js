/*
 * Complete registering a mentee in the database and fill out a MenteeQuestionnaire.
 *
 * TODO: Instead of alert(), use a more user-friendly alert system.
 */
function onMenteeContBtn2Click(event) {
  event.preventDefault();

  // So we can navigate to the target HREF on success
  var href = $("#menteeContBtn2").attr('href');

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

  // Gather user registration information
  var userObj = Model.createUserObject(
    {},
    null, // TODO: this should be userID_headshot.ext (known by server)
    null, // TODO: this should be userID_resume.ext (known by server)
    $('#menteeBio').val(),
    $('#meetingDatePref').val(),
    $('#languagePref-mentee').val(),
    $('#languagePref-mentee').val(),
    $('#gender').val(),
    false // Initially not available
  );

  userObj['MenteeSkills']    = $('#menteeSkills').val();
  userObj['FieldPreference'] = $('#field-mentee').val();

  Database.updateMenteeData(userObj, function(success, response) {
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
          alert("Registration successful!");

          // TODO: Navigate to home page
        }
      });

    }
    // Alert if something went wrong
    else {
      alert("Something went wrong! Error:\n" + response);
    }
  });

  // Stop auto-navigation to href (IE)
  return false;
}

// Function made to trigger after a date has been picked
$(function(){
  $(document).mousemove(function(){
      var empty = false;
      $('.form-group-mentee-required').children('.form-control').each(function() {
          if ($(this).val() == '') {
              empty = true;
          }
      });

      if (empty) {
          $('#menteeContBtn2').attr('disabled', 'disabled');
      } else {
          $('#menteeContBtn2').removeAttr('disabled');
      }
  });
});

// Code needed to initialize the multiselect function
$(document).ready(function() {
 //then Setup the multiselect
 $('.need-multi').multiselect({
   // Shortens the height and makes the box small
   maxHeight: 200
 });
});
