/*
 * Complete registering a mentee in the database and fill out a MenteeQuestionnaire.
 */
function onMenteeContBtn2Click(event) {
  event.preventDefault();

  // Make sure a user is signed-in
  if (null == firebase.auth().currentUser) {
    Global.showNotification('You must complete step 1 of registration!', true);
    return false;
  }

  // So we can navigate to the target HREF on success
  var href = $('#menteeContBtn2').attr('href');

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
    resumeFile = firebase.auth().currentUser.uid + '_' + $('#resumeBtn')[0].files[0].name;
  }

  // Get uploaded headshot file name
  if ($('#picBtn')[0].files[0]) {
    headshotFile = firebase.auth().currentUser.uid + '_' + $('#picBtn')[0].files[0].name;
  }

  // Gather user registration information
  var userObj = Model.createUserObject(
    {},
    headshotFile,
    resumeFile,
    $('#menteeBio').val(),
    $('#meetingDatePref').val(),
    $('#languagePref-mentee').val(),
    $('#languagePref-mentee').val(),
    $('#gender').val(),
    true // Initially available
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
          // Navigate to home page via href in button of notification div
          // (see Global.showNotification)
          // TODO: Add notification 
          Global.showNotification('Registration successful!', false);
        }
      });

    }
    // Display notification on failure
    // TODO: Handle specific errors
    else {
      Global.showNotification('Something went wrong! Error:\n' + response, true);
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
