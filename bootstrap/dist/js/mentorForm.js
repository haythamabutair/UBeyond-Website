/*
 * Complete registering a mentor in the database and fill out a MentorQuestionnaire.
 */
function onMentorContBtn2Click(event) {
  event.preventDefault();

  // Make sure a user is signed-in
  if (null == firebase.auth().currentUser) {
    Global.showNotification('You must complete step 1 of registration!', true);
    return false;
  }

  // So we can navigate to the target HREF on success
  var href = $('#mentorContBtn2').attr('href');

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
      $('.form-group-mentor-required').children('.form-control').each(function() {
          if ($(this).val() == '') {
              empty = true;
          }
      });

      if (empty) {
          $('#mentorContBtn2').attr('disabled', 'disabled');
      } else {
          $('#mentorContBtn2').removeAttr('disabled');
      }
  });
});
 // Code needed to initialize the multiselect function
$(document).ready(function() {
  //First Copies the Languages to every place that needs them
  $("#languagePref > option").clone().appendTo('.languageSelection')
  //then Setup the multiselect
  $('.need-multi').multiselect({
    // Shortens the height and makes the box small
    maxHeight: 200
  });
});
