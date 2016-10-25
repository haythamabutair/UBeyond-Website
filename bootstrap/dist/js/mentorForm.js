/*
 * Complete registering a mentor in the database and fill out a MentorQuestionnaire.
 *
 * TODO: Instead of alert(), use a more user-friendly alert system.
 */
function onMentorContBtn2Click(event) {
  event.preventDefault();

  // So we can navigate to the target HREF on success
  var href = $('#mentorContBtn2').attr('href');

  // Collect remainder of mentor data
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
    $('#mentorBio').val(),
    $('#mentorSkills').val(),
    $('#preferedStartDate').val(),
    $('#fluentLang').val(),
    $('#languagePref').val(),
    $('#prefGender').val(),
    false // Initially not available
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

  userObj['Employer'] = $('#currentEmployer').val();
  userObj['YearsOfExperience'] = $('#yearsExp').val();
  userObj['FieldOfExpertise'] = $('#field').val();
  userObj['MenteeLevelPreference'] = levelPrefArr;
  userObj['Strengths'] = $('#mentorSkills').val();

  Database.updateMentorData(userObj, function(success, response) {
    // Collect mentee form data
    if (success) {
      var mentorFormData = {
        "WhatKindOfMentor": document.getElementById('mFormQ1').value,
        "PastEffectiveMentors": document.getElementById('mFormQ2').value,
        "WhatMadeMostInfluence": document.getElementById('mFormQ3').value,
        "GreatMentors": document.getElementById('mFormQ4').value,
        "MentoringImportance": document.getElementById('mFormQ5').value,
        "MenteeWillGain": document.getElementById('mFormQ6').value,
        "PlanToGain": document.getElementById('mFormQ7').value
      };

      // Submit mentor form and navigate to home page
      Database.setMentorFormData(mentorFormData, function(success, response) {
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
