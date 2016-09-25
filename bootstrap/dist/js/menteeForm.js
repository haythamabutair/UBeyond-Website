// function to register new mentee in database
function onMenteeContBtn2Click(caller) {
  event.preventDefault(); // Stop auto-navigation to href (chrome, firefox)
  
  // So we can navigate to the target HREF on success
  var href = document.getElementById(caller.id).href;

  // TODO: Should authenticate that username in URL param is actually this user

  // Get username from URL parameter
  var username = Global.getParameterByName("username", window.href);

  // Make sure username was found
  if (username == null) {
    // TODO: navigate back to mentee.html
    alert("Username not provided in URL.");
  }
  else {
    // Collect remainder of mentee data
    var languagePref = document.getElementById('languagePref').value;
    var fieldPref = document.getElementById('fieldPref').value;
    var genderPrefObj = document.getElementById('gender');
    var genderPref = genderPrefObj.options[genderPrefObj.selectedIndex].text;
    var firstMeetingDatePref = document.getElementById('meetingDatePref').value;
    var bio = document.getElementById('menteeBio').value;
    // TODO: Resume upload
    // TODO: Headshot upload

    var menteeData = {
      "languagePreference": languagePref,
      "fieldPreference": fieldPref,
      "genderPreference": genderPref,
      "firstMeetingDatePreference": firstMeetingDatePref,
      "bio": bio
    };

    Database.updateMenteeData(username, menteeData, function(result) {
      // Collect mentee form data
      if (result == "success") {
        var areasToImprove = document.getElementById('mFormQ1').value;
        var howToImprove = document.getElementById('mFormQ2').value;
        var signalOfSuccess = document.getElementById('mFormQ3').value;
        var whenSatisfied = document.getElementById('mFormQ4').value;
        var howMentorCanHelp = document.getElementById('mFormQ5').value;
        var improvementTimeframe = document.getElementById('mFormQ6').value;

        var menteeFormData = {
          "areasToImprove": areasToImprove,
          "howToImprove": howToImprove,
          "signalOfSuccess": signalOfSuccess,
          "whenSatisfied": whenSatisfied,
          "howMentorCanHelp": howMentorCanHelp,
          "improvementTimeframe": improvementTimeframe
        };

        // Submit mentee form
        Database.setMenteeFormData(username, menteeFormData, function(result){
          // TODO: Could use a better alert system
          alert("Registration completed!");
        });

      }
      // Alert if something went wrong
      else {
        alert("Sorry, something went wrong... " + result);
      }
    });
  }

  // Stop auto-navigation to href (IE)
  return false;
}