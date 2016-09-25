// function to register new mentor in database
function onMentorContBtn2Click(caller) {
  event.preventDefault(); // Stop auto-navigation to href (chrome, firefox)
  
  // So we can navigate to the target HREF on success
  var href = document.getElementById(caller.id).href;

  // TODO: Should authenticate that username in URL param is actually this user

  // Get username from URL parameter
  var username = Global.getParameterByName("username", window.href);

  // Make sure username was found
  if (username == null) {
    // TODO: navigate back to mentor.html
    alert("Username not provided in URL.");
  }
  else {
    // Collect remainder of mentor data
    var currentEmployer = document.getElementById('currentEmployer').value;
    var fieldOfExpertise = document.getElementById('fieldExpertise').value;
    var yearsOfExperience = document.getElementById('yearsExp').value;
    var languages = document.getElementById('fluentLangs').value;
    var hsLevelPref = document.getElementById('hsLevelCheck').checked;
    var undergradLevelCheck = document.getElementById('undergradLevelCheck').checked;
    var gradLevelCheck = document.getElementById('gradLevelCheck').checked;
    var strengths = document.getElementById('menteeBio').value;
    // TODO: Resume upload
    // TODO: Headshot upload

    var mentorData = {
      "currentEmployer": currentEmployer,
      "fieldExpertise": fieldExpertise,
      "yearsOfExperience": yearsOfExperience,
      "languages": languages,
      "menteeLevelPreference": {
        "highschool": hsLevelPref,
        "undergrad": undergradLevelCheck,
        "graduate": gradLevelCheck
      },
      "strengths": strengths
    }

    Database.updateMentorData(username, mentorData, function(result) {
      // Collect mentee form data
      if (result == "success") {
        var whatKindOfMentor = document.getElementById('mFormQ1').value;
        var pastEffectiveMentors = document.getElementById('mFormQ2').value;
        var howStoodOut = document.getElementById('mFormQ3').value;
        var qualitiesOfGoodMentor = document.getElementById('mFormQ4').value;
        var whyImportant = document.getElementById('mFormQ5').value;
        var menteeWillGain = document.getElementById('mFormQ6').value;
        var mentorWillGain = document.getElementById('mFormQ7').value;

        var mentorFormData = {
          "whatKindOfMentor": whatKindOfMentor,
          "pastEffectiveMentors": pastEffectiveMentors,
          "howStoodOut": howStoodOut,
          "qualitiesOfGoodMentor": qualitiesOfGoodMentor,
          "whyImportant": whyImportant,
          "menteeWillGain": menteeWillGain,
          "mentorWillGain": mentorWillGain
        };

        // Submit mentor form
        Database.setMentorFormData(username, mentorFormData, function(result){
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