//Global Var to allow onClick options to happen once info in inputed.
var canUseBtn = false;


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
      var empty = false;
      $('.form-group-mentor-required').children('input.form-control').each(function() {
          if ($(this).val() == '') {
              empty = true;
          }
      });

      if (empty) {
          $('#mentorContBtn').attr('disabled', 'disabled');
          canUseBtn = false;
      } else {
          $('#mentorContBtn').removeAttr('disabled');
          canUseBtn = true;
      }
  });
});

/*
 * Begin registering a mentor in the database.
 *
 * TODO: Instead of alert(), use a more user-friendly alert system.
 */
function onMentorContBtnClick(event) {
  event.preventDefault(); // Stop auto-navigation to href (chrome, firefox)
  //Check to see that all required information is provided.
  if(canUseBtn == true){
    // So we can navigate to the target HREF on success
    var href = document.getElementById("mentorContBtn").href;

    var email = document.getElementById('inputEmail').value;
    var password = document.getElementById('inputPassword').value;

    // Attempt to register the specified email and password
    Database.registerUser(email, password, function(success, response) {
      if (success) {
        // Update rest of mentor data
        var genderObj = document.getElementById('gender');
        var stateObj = document.getElementById('state_id');

        // Build address string
        var addressStr = document.getElementById('street1ID').value + "\n";
        
        if ('' != document.getElementById('street2ID').value) {
          addressStr.concat(document.getElementById('street2ID').value).concat("");
        }

        addressStr.concat(document.getElementById('cityID').value).concat("\n");
        addressStr.concat(stateObj.options[stateObj.selectedIndex].value).concat(", ");
        addressStr.concat(document.getElementById('zipID').value);

        // Collect personal info
        var mentorObj = Model.createPersonObject(
            document.getElementById('firstName').value,
            document.getElementById('lastName').value,
            document.getElementById('middleInitial').value,
            document.getElementById('preferredName').value,
            addressStr,
            document.getElementById('phoneNumber').value,
            email,
            genderObj.options[genderObj.selectedIndex].text,
            null, // TODO: Get languages spoken
            document.getElementById('bday').value
        );

        // Update database entry for newly-registered used and navigate to next page
        Database.updateMentorData(mentorObj, function(success, response) {
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
  }

  // Stop auto-navigation to href (IE)
  return false;
}
