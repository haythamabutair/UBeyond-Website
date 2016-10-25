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
  // Stop auto-navigation to href (chrome, firefox)
  event.preventDefault();
  
  //Check to see that all required information is provided.
  if(canUseBtn == true){
    // So we can navigate to the target HREF on success
    var href = $('#mentorContBtn').attr('href');
    
    var email    = $('#inputEmail').val();
    var password = $('#inputPassword').val();

    // Attempt to register the specified email and password
    Database.registerUser(email, password, function(success, response) {
      if (success) {
        // Build address string
        var addressStr = $('#street1ID').val()
          + ' ' + $('#street2ID').val()
          + ', ' + $('#cityID').val()
          + ', ' + $('#state_id').val()
          + ', ' + $('#zipID').val();

        // Gather personal registration info
        var personObj = Model.createPersonObject(
          {},
          $('#firstName').val(),
          $('#lastName').val(),
          $('#middleInitial').val(),
          $('#preferredName').val(),
          addressStr,
          $('#phoneNumber').val(),
          email,
          $('#gender').val(),
          $('#bday').val()
        );

        // Update database entry for newly-registered used and navigate to next page
        Database.updateMentorData(personObj, function(success, response) {
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
