$(document).ready(function() {

  fetchData();

  //
  //TESTER USERS FOR THE HOMEPAGES
  //
  // firebase.auth().signInWithEmailAndPassword("example.mentee@host.com", "testpassword").then(function(error) {
  //   // alert(error);
  //   fetchData();
  // })
  // firebase.auth().signInWithEmailAndPassword("mentortest@gmail.com", "asdasd").then(function(error) {
  //   // alert(error);
  //   fetchData();
  // })



});


//This function gets the database, currentuser, and currentuser matches through
//closure calls and calls functions to display the data correctly from the db
function fetchData() {

  if (firebase.auth().currentUser != null) {



    //get the db, currentUser and current user id for the user session
    var db = firebase.database();
    var curUser = firebase.auth().currentUser;
    var curUserID = firebase.auth().currentUser.uid;


    // get references to the current user: one of these will be null and the
    // null value be checked later on to do appropriate information fetching
    var menteeRef = db.ref("Mentee/" + curUserID);
    var mentorRef = db.ref("Mentor/" + curUserID);




    // Get database info for current user and call helper functions to display the info
    // if mentee get mentee info and StudentInfo/EmployeeInfo data and display the info
    // if mentor then supply mentor info to display the info
    menteeRef.on("value", function(snapData) {
      if (snapData.val() != null) {
        // console.log("menteeRefSnapDataVal: " + snapData.val());
        var refInfo;

        if (snapData.val()["EmploymentStatus"] == "student") {
          refInfo = db.ref("StudentInfo/" + curUserID);
        } else {
          refInfo = db.ref("EmployeeInfo/" + curUserID);
        }

        refInfo.on("value", function(infoSnapshot) {
          // console.log(infoSnapshot.val());

          var menteeMatchToRef = db.ref("MenteeMatch/" + curUserID);

          //check if the mentee has any matches.
          //if yes, then get the match and populate match fields
          //if no, then just use user's info and hide match field

          menteeMatchToRef.on("value", function(matchSnapshot) {

            if (matchSnapshot.val() != null) {
              //this will be strings of all user matches
              var menteeCheckArray = [];
              //this has db ref for all user matches
              var menteeMatchArray = []

              //for all the matches (non duplicate) for the current user, add them to match array
              for (x in matchSnapshot.val()) {
                var matchUser = matchSnapshot.val()[x]["User"];

                if (!menteeCheckArray.includes(matchUser)) {
                  menteeCheckArray.push(matchUser);
                  menteeMatchArray.push(db.ref("Mentor/" + matchUser));
                }
              }

              // console.log(menteeMatchArray);

              //show the 2 columns because there is data available
              $(".home-user-col").show();
              $(".home-match-col").show();

              //call the display data functions to fill in the page
              displayDataMentee(snapData.val(), infoSnapshot.val());
              displayDataMenteesMatch(menteeMatchArray);
            } else {
              $(".home-user-col").show();
              //call the display data functions to fill in the page
              displayDataMentee(snapData.val(), infoSnapshot.val());
            }
          });

        });
      }
    });


    mentorRef.on("value", function(mentorSnapData) {
      if (mentorSnapData.val() != null) {
      // console.log(mentorSnapData.val());

        //get the matches for the current user
        var mentorMatchToRef = db.ref("MentorMatch/" + curUserID);
        mentorMatchToRef.on("value", function(mentorMatchSnapshot) {

          if (mentorMatchSnapshot.val() != null) {
            //this will be strings of all user matches
            var mentorCheckArray = [];
            //this has db ref for all user matches
            var mentorMatchArray = []

            //for all the matches (non duplicate) for the current user, add them to match array
            for (x in mentorMatchSnapshot.val()) {
              var matchUser = mentorMatchSnapshot.val()[x]["User"];

              if (!mentorCheckArray.includes(matchUser)) {
                mentorCheckArray.push(matchUser);
                mentorMatchArray.push(db.ref("Mentor/" + matchUser));
              }
            }

            $(".home-user-col").show();
            $(".home-match-col").show();

            displayDataMentor(mentorSnapData.val());
            displayDataMentorsMatch(mentorMatchArray);
            // console.log(mentorMatchArray);
          } else {
            displayDataMentor(mentorSnapData.val());
            // $(".home-match-col").hide();
            $(".home-user-col").show();
          }

        });
      }
    });


  } else {
    // alert("NO USER");

    function Redirect() {
        window.location = "mentorshipatlanta.info";
      }
    setTimeout('Redirect()', 1000);


  }
}

//displaying the homepage user data
function displayDataMentee(snapDataAsJson, studentOrEmployeeInfo) {

  //if current user is mentee (only way this code should run) hide this fields
  $("#home-user-fieldExpertise-header").hide();


  //Sets all the current user fields from the given user's database information
  $("#home-user-name").text(snapDataAsJson["FirstName"] + " " + snapDataAsJson["LastName"]);
  $("#home-user-fieldPreference").text(snapDataAsJson["FieldPreference"]);
  $("#home-user-languagePreference").text(snapDataAsJson["LanguagePreference"]);
  $("#home-user-bio-para").text(snapDataAsJson["Bio"]);

  //sets whether is student or employed and fills home page with user fields
  if (snapDataAsJson["EmploymentStatus"] == "student") {
    $("#home-user-status").text("STUDENT");
    $("#home-user-majorOrEmployer").text(studentOrEmployeeInfo["Major"]);
  } else {
    $("#home-user-status").text("EMPLOYED");
    $("#home-user-majorOrEmployer").text(studentOrEmployeeInfo["Employer"]);
  }

  //TODO
  //gets user pic...currently we dont have the actual pic. this is not working
  // if (snapDataAsJson["HeadshotFilename"] != null) {
  //   $("#home-user-pic").attr("src", snapDataAsJson["HeadshotFilename"]);
  // }


}

//
// DISPLAY THE MATCHES' DATA into the html
//
//TODO implement this code and home.html to be able to display multiple matches.
//It currently only displays one match
function displayDataMenteesMatch(menteeMatchArray) {

  var menteeMatchOneRef = menteeMatchArray[0];

  menteeMatchOneRef.on("value", function(menteeMatchSnap) {
    // console.log("test", menteeMatchSnap.val());
    var menteeMatchSnapVal = menteeMatchSnap.val();



    //if current user is mentee (only way this code should run) hide this fields
    $("#home-match-fieldPreference-header").hide();

    //sets all the match's data from the match's database info
    $("#home-match-name").text(menteeMatchSnapVal["FirstName"] + " " + menteeMatchSnapVal["LastName"]);
    $("#home-match-majorOrEmployer").text(menteeMatchSnapVal["Employer"]);
    $("#home-match-fieldExpertise").text(menteeMatchSnapVal["FieldOfExpertise"]);
    $("#home-match-languagePreference").text(menteeMatchSnapVal["LanguagePreference"]);
    $("#home-match-gender").text(menteeMatchSnapVal["Gender"]);
    $("#home-match-bio-para").text(menteeMatchSnapVal["Bio"]);
    $("#home-match-contact-email").text(menteeMatchSnapVal["Email"]);
    $("#home-match-contact-phoneNumber").text(menteeMatchSnapVal["PhoneNumber"]);


    //TODO implement getting the match's picture and uplodading to the page
    // if (menteeMatchSnapVal["HeadshotFilename"] != null) {
    //   $("#home-match-pic").attr("src", menteeMatchSnapVal["HeadshotFilename"]);
    // }

  });
}


//dispalying the homepage user data if user is mentor
function displayDataMentor(snapDataAsJson) {

  //if current user is mentor (only way this code should run) hide this fields
  $("#home-user-fieldPreference-header").hide();

  //Sets all the current user fields from the given user's database information
  $("#home-user-name").text(snapDataAsJson["FirstName"] + " " + snapDataAsJson["LastName"]);
  $("#home-user-status").text("MENTOR");
  $("#home-user-majorOrEmployer").text(snapDataAsJson["Employer"]);
  $("#home-user-fieldExpertise").text(snapDataAsJson["FieldOfExpertise"]);
  $("#home-user-languagePreference").text(snapDataAsJson["LanguagePreference"]);
  $("#home-user-bio-para").text(snapDataAsJson["Bio"]);


}

//displaying user's match's info if user is a mentor
function displayDataMentorsMatch(mentorMatchArray) {

  var mentorMatchOneRef = menteeMatchArray[0];


  mentorMatchOneRef.on("value", function(mentorMatchSnap) {
    // console.log("test", mentorMatchSnap.val());
    var mentorMatchSnapVal = mentorMatchSnap.val();

    //if current user is mentor (only way this code should run) hide this fields
    $("#home-match-fieldExpertise-header").hide();

    //sets all the match's data from the match's database info
    $("#home-match-name").text(mentorMatchSnapVal["FirstName"] + " " + mentorMatchSnapVal["LastName"]);
    $("#home-match-majorOrEmployer").hide();
    $("#home-match-fieldPreference").text(mentorMatchSnapVal["FieldPreference"]);
    $("#home-match-languagePreference").text(mentorMatchSnapVal["LanguagePreference"]);
    $("#home-match-gender").text(mentorMatchSnapVal["Gender"]);
    $("#home-match-bio-para").text(mentorMatchSnapVal["Bio"]);
    $("#home-match-contact-email").text(mentorMatchSnapVal["Email"]);
    $("#home-match-contact-phoneNumber").text(mentorMatchSnapVal["PhoneNumber"]);


    //TODO implement getting the match's picture and uplodading to the page
    // if (mentorMatchSnapVal["HeadshotFilename"] != null) {
    //   $("#home-match-pic").attr("src", mentorMatchSnapVal["HeadshotFilename"]);
    // }

  });
}
