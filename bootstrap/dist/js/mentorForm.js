/*
 * Complete registering a mentor in the database and fill out a MentorQuestionnaire.
 *
 * TODO: Instead of alert(), use a more user-friendly alert system.
 */
function onMentorContBtn2Click(event) {
  event.preventDefault();

  // So we can navigate to the target HREF on success
  var href = document.getElementById("mentorContBtn2").href;

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

  var mentorObj = {};

  // TODO: Defaulting these to null. Shannor: fill these in when you add the fields
  Model.createUserObj(
    mentorObj,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null
  );

  mentorObj["Employer"] = document.getElementById('currentEmployer').value;
  mentorObj["FieldOfExpertise"] = document.getElementById('fieldExpertise').value;
  mentorObj["YearsOfExperience"] = document.getElementById('yearsExp').value;
  mentorObj["Languages"] = document.getElementById('fluentLangs').value;
  mentorObj["MenteeLevelPreference"] = {
    "HighSchool": document.getElementById('hsLevelCheck').checked,
    "Undergraduate": document.getElementById('undergradLevelCheck').checked,
    "Graduate": document.getElementById('gradLevelCheck').checked
  };
  mentorObj["Strengths"] = document.getElementById('menteeBio').value;

  Database.updateMentorData(mentorObj, function(success, response) {
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
