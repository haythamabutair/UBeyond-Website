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

function makeYears(tag, start, stop) {
  if(document.getElementById(tag).length == 0){
    for(var i= start; i >=stop; i--){
      var x = document.createElement("option");
      x.innerHTML = i;
      x.value = i;
      document.getElementById(tag).appendChild(x);
    }
  }
}

function makeDays(tag) {
  if (document.getElementById(tag).length == 0){
    for(var i = 1; i <= 31; i++){
      var x = document.createElement("option");
      x.innerHTML = i;
      x.value = i;
      document.getElementById(tag).appendChild(x);
    }
  }
}
