/*
 * Complete registering a mentee in the database and fill out a MenteeQuestionnaire.
 *
 * TODO: Instead of alert(), use a more user-friendly alert system.
 */
function onMenteeContBtn2Click(caller) {
  event.preventDefault(); // Stop auto-navigation to href (chrome, firefox)

  // So we can navigate to the target HREF on success
  var href = document.getElementById(caller.id).href;

  // Collect remainder of mentee data
  var genderPrefObj = document.getElementById('gender');

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
  var menteeData = {
    "bio": document.getElementById('menteeBio').value,
    "languagePreference": document.getElementById('languagePref').value,
    "fieldPreference": document.getElementById('fieldPref').value,
    "genderPreference": genderPrefObj.options[genderPrefObj.selectedIndex].text,
    "firstMeetingDatePreference": document.getElementById('meetingDatePref').value
  };

  Database.updateUserData(menteeData, function(success, response) {
    // Collect mentee form data
    if (success) {
      var menteeFormData = {
        "areasToImprove": document.getElementById('mFormQ1').value,
        "howToImprove": document.getElementById('mFormQ2').value,
        "signalOfSuccess": document.getElementById('mFormQ3').value,
        "whenSatisfied": document.getElementById('mFormQ4').value,
        "howMentorCanHelp": document.getElementById('mFormQ5').value,
        "improvementTimeframe": document.getElementById('mFormQ6').value
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
