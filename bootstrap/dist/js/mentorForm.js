/*
 * Complete registering a mentor in the database and fill out a MentorQuestionnaire.
 *
 * TODO: Instead of alert(), use a more user-friendly alert system.
 */
function onMentorContBtn2Click(caller) {
  // So we can navigate to the target HREF on success
  var href = document.getElementById(caller.id).href;

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
  var mentorData = {
    "currentEmployer": document.getElementById('currentEmployer').value,
    "fieldExpertise": document.getElementById('fieldExpertise').value,
    "yearsOfExperience": document.getElementById('yearsExp').value,
    "languages": document.getElementById('fluentLangs').value,
    "menteeLevelPreference": {
      "highschool": document.getElementById('hsLevelCheck').checked,
      "undergrad": document.getElementById('undergradLevelCheck').checked,
      "graduate": document.getElementById('gradLevelCheck').checked
    },
    "strengths": document.getElementById('menteeBio').value
  }

  Database.updateUserData(mentorData, function(success, response) {
    // Collect mentee form data
    if (success) {
      var mentorFormData = {
        "whatKindOfMentor": document.getElementById('mFormQ1').value,
        "pastEffectiveMentors": document.getElementById('mFormQ2').value,
        "howStoodOut": document.getElementById('mFormQ3').value,
        "qualitiesOfGoodMentor": document.getElementById('mFormQ4').value,
        "whyImportant": document.getElementById('mFormQ5').value,
        "menteeWillGain": document.getElementById('mFormQ6').value,
        "mentorWillGain": document.getElementById('mFormQ7').value
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
