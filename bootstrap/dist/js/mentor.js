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

// function to register new mentor in database
function onMentorContBtnClick(caller) {
  event.preventDefault(); // Stop auto-navigation to href (chrome, firefox)
  
  // So we can navigate to the target HREF on success
  var href = document.getElementById(caller.id).href;

  // Get initial register variables
  var username = document.getElementById('inputUsername').value;
  var email = document.getElementById('inputEmail').value;
  var password = document.getElementById('inputPassword').value;

  // Call register function and store result
  var result = Database.registerMentor(username, email, password, function(result) {
    if (result == "success") {
      // Update rest of mentor data
      var genderObj = document.getElementById('gender');
      var stateObj = document.getElementById('state_id');

      var data = {
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

      Database.updateMentorData(username, data);

      // Now navigate to target href
      window.location.href = href + "?username=" + username;
    }
    else {
      // TODO: some other alert would be better probably
      alert(result);
    }
  });

  // Stop auto-navigation to href (IE)
  return false;
}