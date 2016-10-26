//Global Var to allow onClick options to happen once info in inputed.
var canUseBtn = false;


// function to hide/show registration input fields depending on selection of student/notStudent radio buttons
function showHideRegisterInfo() {
  var ifStudent = document.getElementById('studentRad');
  var ifNotStudent = document.getElementById('notStudentRad');
  var ifHighSchoolStudent = document.getElementById('radio-highschool')

  studentRegForm.style.display = ifStudent.checked ? "block" : "none";
  levelRadios.style.display = ifStudent.checked ? "block" : "none";
  employedRegForm.style.display = ifNotStudent.checked ? "block" : "none";
  //Check to handle when changing from Student to Non-student
  //And adjusting all possible swaps
  if(ifStudent.checked){
    showStudentLevels()
  }
}
//Method for what to show based on the radio buttons pressed.
function showStudentLevels(){
  //gets radio buttons for if your a student and if in highschool
  var ifStudent = document.getElementById('studentRad');
  var ifHighSchoolStudent = document.getElementById('radio-highschool')
  //If both are checked show highschool informaton
  if(ifStudent.checked && ifHighSchoolStudent.checked){
    highSchoolStudentRegForm.style.display = 'block'
    studentRegForm.style.display = 'none'
    //Show Grad or UnderGrad information
  }else if(ifStudent.checked && !ifHighSchoolStudent.checked){
    highSchoolStudentRegForm.style.display = 'none'
    studentRegForm.style.display = 'block'
    //Show nothing relating to students since its non-student selected
  }else{
    highSchoolStudentRegForm.style.display = 'none'
    studentRegForm.style.display ='none'
  }

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
        //Check if its a highschool student or not
        if($('input[name=levelRadio]:checked').val()== 'highSchool'){
          $('#highSchoolStudentRegForm').children('.form-group-required').children('.form-control').each(function(){
            if($(this).val() == ''){
                radioForm = false;
              }
            });
        }else{
          $('#studentRegForm').children('.form-group-required').children('.form-control').each(function(){
            if($(this).val() == ''){
                radioForm = false;
              }
            });
        }
      }else{
        $('#employedRegForm').children('.form-group-required').children('.form-control').each(function(){
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
        canUseBtn = false;
      } else {
        $('#menteeContBtn').removeAttr('disabled');
        canUseBtn = true;
      }
  });
});

/*
 * Begin registering a mentee in the database.
 *
 * TODO: Instead of alert(), use a more user-friendly alert system.
 */
function onMenteeContBtnClick(event) {
  event.preventDefault(); // Stop auto-navigation to href (chrome, firefox)
  //Check to see that all required information is provided.
  if(canUseBtn == true){
  // So we can navigate to the target HREF on success
    var href = document.getElementById("menteeContBtn").href;

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
  }

  // Stop auto-navigation to href (IE)
  return false;
}
