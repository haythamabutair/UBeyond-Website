/* ========================================================================
 *
 * Javascript functions for all of the pages
 *
 * ======================================================================== */




 var Global = (function() {

     // Code from stackoverflow post @ http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
     var getParameterByName = function(name, url) {
         if (!url) {
             url = window.location.href;
         }

         name = name.replace(/[\[\]]/g, "\\$&");
         var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
             results = regex.exec(url);

         if (!results) {
             return null;
         }

         if (!results[2]) {
             return '';
         }

         return decodeURIComponent(results[2].replace(/\+/g, " "));
     }

     return {
         getParameterByName: getParameterByName
     }
 })();



/* ========================================================================
  *
  * signin Javascript
  *
  * ======================================================================== */


/*
* Attempt to sign in to the website.
*/
function onSigninBtnClick(caller) {
event.preventDefault(); // Stop auto-navigation to href (chrome, firefox)

// So we can navigate to the target HREF on success
var href = document.getElementById(caller.id).href;

var email = document.getElementById('inputEmail').value;
var password = document.getElementById('inputPassword').value;

Database.authenticate(email, password, function(success, response) {
  // Sign-in succeeded
  if (success) {
    var userID = response;

    // TODO: Eventually, navigate to home page
    alert("Sign-in successful! userID: " + userID);
  }
  // Sign-in failed
  else {
    // TODO: Eventually, use a different notification system
    alert("Sign-in failed. Error:\n" + response);
  }
});

// Stop auto-navigation to href (IE)
return false;
}



/* ========================================================================
 *
 * mentee Javascript
 *
 * ======================================================================== */


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
      var allFilledOut = true;
      var mainForm = true;
      var radioForm = true;
      // If something is missing
      $('.form-group-mentee-required').children('input.form-control').each(function() {
        if ($(this).val() == '') {
              mainForm = false;
          }
      });

        // Check for student selection and the fields that matter
      if ($('input[name=studentRadio]:checked').val() == 'student'){

        $('#studentRegForm').children('.form-group-required').children('input.form-control').each(function(){
          if($(this).val() == ''){
              radioForm = false;
            }
          });

      }else{
        $('#employedRegForm').children('.form-group-required').children('input.form-control').each(function(){
          if($(this).val() == ''){
              radioForm = false;
            }
          });
        }

      if (radioForm == false || mainForm == false){
        allFilledOut = false;
      }

      if (!allFilledOut) {
          $('#menteeContBtn').attr('disabled', 'disabled');
      } else {
          $('#menteeContBtn').removeAttr('disabled');
      }
  });
});

/*
 * Begin registering a mentee in the database.
 *
 * TODO: Instead of alert(), use a more user-friendly alert system.
 */
function onMenteeContBtnClick(caller) {
  event.preventDefault(); // Stop auto-navigation to href (chrome, firefox)

  // So we can navigate to the target HREF on success
  var href = document.getElementById(caller.id).href;

  var email = document.getElementById('inputEmail').value;
  var password = document.getElementById('inputPassword').value;

  // Attempt to register the specified email and password
  Database.registerUser(email, password, function(success, response) {
    if (success) {
      // Update rest of mentee data
      var genderObj = document.getElementById('gender');

      var data = {
        "userType": "mentee",
        "email": email,
        "birthdate": document.getElementById('bday').value,
        "gender": genderObj.options[genderObj.selectedIndex].text,
        "name": {
          "first": document.getElementById('firstName').value,
          "middle": document.getElementById('middleInitial').value,
          "last": document.getElementById('lastName').value,
          "preferred": document.getElementById('preferredName').value
        },
        "phone": document.getElementById('phoneNumber').value
      };

      // Student data
      if (document.getElementById('studentRad').checked) {
        data["studentInfo"] = {
          "currentSchool": document.getElementById('currentSchool').value,
          "major": document.getElementById('major').value,
          "minor": document.getElementById('minor').value,
          "futurePlans": document.getElementById('afterGrad').value,
          "expectedGraduationDate": document.getElementById('studentGradDate').value,
          "interestedInPostGrad": document.getElementById('postGradCheckBx').checked
        };
      }
      // Employer data
      else {
        data["employeeInfo"] = {
          "employer": document.getElementById('currentEmployer').value,
          "latestDegree": document.getElementById('latestDegree').value,
          "latestSchool": document.getElementById('latestSchool').value,
          "graduationDate": document.getElementById('employedGradDate').value,
          "careerPlans": document.getElementById('careerPlan').value,
          "careerGoals": document.getElementById('careerGoals').value
        };
      }

      // Update database entry for newly-registered used and navigate to next page
      Database.updateUserData(data, function(success, response) {
        if(success) {
          // Now navigate to target href
          window.location.href = href;
        }
        else {
          alert(response);
        }
      });
    }
    else {
      alert(response);
    }
  });

  // Stop auto-navigation to href (IE)
  return false;
}



/* ========================================================================
 *
 * menteeForm Javascript
 *
 * ======================================================================== */


/*
* Complete registering a mentee in the database and fill out a MenteeQuestionnaire.
*
* TODO: Instead of alert(), use a more user-friendly alert system.
*/
function onMenteeContBtn2Click(caller) {
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


// Function made to trigger after a date has been picked
$(function(){
 $(document).mousemove(function(){
     var empty = false;
     $('.form-group-mentee-required').children('input.form-control').each(function() {
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



/* ========================================================================
 *
 * mentor Javascript
 *
 * ======================================================================== */


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
// Function to make the datepicker pop up
// $(function() {
//    $( "#birthdate-mentor-datepicker" ).datepicker();
// });

// Function made to trigger after a date has been picked
$(function(){
 $(document).mousemove(function(){
     var empty = false;
     $('.form-group-mentor-required').children('input.form-control').each(function() {
         if ($(this).val() == '') {
             empty = true;
         }
     });

     if (empty) {
         $('#mentorContBtn').attr('disabled', 'disabled');
     } else {
         $('#mentorContBtn').removeAttr('disabled');
     }
 });
});

/*
* Begin registering a mentor in the database.
*
* TODO: Instead of alert(), use a more user-friendly alert system.
*/
function onMentorContBtnClick(caller) {
 event.preventDefault(); // Stop auto-navigation to href (chrome, firefox)

 // So we can navigate to the target HREF on success
 var href = document.getElementById(caller.id).href;

 var email = document.getElementById('inputEmail').value;
 var password = document.getElementById('inputPassword').value;

 // Attempt to register the specified email and password
 Database.registerUser(email, password, function(success, response) {
   if (success) {
     // Update rest of mentor data
     var genderObj = document.getElementById('gender');
     var stateObj = document.getElementById('state_id');

     var data = {
       "userType": "mentor",
       "email": email,
       "birthdate": document.getElementById('bday').value,
       "gender": genderObj.options[genderObj.selectedIndex].text,
       "name": {
         "first": document.getElementById('firstName').value,
         "middle": document.getElementById('middleInitial').value,
         "last": document.getElementById('lastName').value,
         "preferred": document.getElementById('preferredName').value
       },
       "phone": document.getElementById('phoneNumber').value,
       "address": {
         "street1": document.getElementById('street1ID').value,
         "street2": document.getElementById('street2ID').value,
         "city": document.getElementById('cityID').value,
         "state": stateObj.options[stateObj.selectedIndex].value,
         "zip": document.getElementById('zipID').value
       }
     };

     // Update database entry for newly-registered used and navigate to next page
     Database.updateUserData(data, function(success, response) {
       if(success) {
         // Now navigate to target href
         window.location.href = href;
       }
       else {
         alert(response);
       }
     });
   }
   else {
     alert(response);
   }
 });

 // Stop auto-navigation to href (IE)
 return false;
}




 /* ========================================================================
  *
  * mentorForm Javascript
  *
  * ======================================================================== */

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



// Function made to trigger after a date has been picked
$(function(){
  $(document).mousemove(function(){
      var empty = false;
      $('.form-group-mentor-required').children('input.form-control').each(function() {
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
