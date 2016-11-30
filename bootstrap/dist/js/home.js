$(document).ready(function() {
  firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
          // Fetch user profile data
          fetchData();
      }
  });

  //
  //TESTER USERS FOR THE HOMEPAGES
  //
  // firebase.auth().signInWithEmailAndPassword("test_emailhere123@gmail.com", "testPassword").then(function(error) {
  //   // alert(error);
  //   fetchData();
  // })
  // firebase.auth().signInWithEmailAndPassword("testtest@gmail.com", "asdasd").then(function(error) {
  //   // alert(error);
  //   fetchData();
  // })
  // firebase.auth().signInWithEmailAndPassword("mentor_test_123@test.com", "testPassword").then(function(error) {
  //   // alert(error);
  //   fetchData();
  // });
  // firebase.auth().signInWithEmailAndPassword("testty@gmail.com", "asdasd").then(function(error) {
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
      if (snapData.val() !== null) {
        //console.log("menteeRefSnapDataVal: " + snapData.val());
        var refInfo;

        if (snapData.val()["EmploymentStatus"] == "student") {
          refInfo = db.ref("StudentInfo/" + curUserID);
        } else {
          refInfo = db.ref("EmployeeInfo/" + curUserID);
        }



        var menteeMatchID = snapData.val()["Match"]

        refInfo.on("value", function(infoSnapshot) {
          //console.log(infoSnapshot.val());

          if (menteeMatchID != null) {
            $(".home-user-col").show();
            $(".home-match-col").show();

            //call the display data functions to fill in the page
            displayDataMentee(snapData.val(), infoSnapshot.val());
            displayDataMenteesMatch(db.ref("Mentor/" + menteeMatchID));
          } else {
            $(".home-user-col").show();
            //call the display data functions to fill in the page
            displayDataMentee(snapData.val(), infoSnapshot.val());
          }

        });
      }
    });


    mentorRef.on("value", function(mentorSnapData) {
      if (mentorSnapData.val() != null) {
      // console.log(mentorSnapData.val());

        mentorMatchID = mentorSnapData.val()["Match"]

        //if there is a match, show and display match data. else show user data
        if (mentorMatchID != null) {
          $(".home-user-col").show();
          $(".home-match-col").show();

          displayDataMentor(mentorSnapData.val());
          displayDataMentorsMatch(db.ref("Mentee/" + mentorMatchID));
        } else {
          $(".home-user-col").show();

          displayDataMentor(mentorSnapData.val());
        }
      }
    });


  } else {
    // alert("NO USER");
    setTimeout('redirect()', 1000);
  }
}

function redirect() {
  window.location = "mentorshipatlanta.info";
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

  Database.getDownloadURL(snapDataAsJson["HeadshotFilename"], function(result, response) {
    if (result) {
      $("#home-user-pic").attr("src", response)
    }
  });


}

//
// DISPLAY THE MATCHES' DATA into the html
//
//TODO implement this code and home.html to be able to display multiple matches.
//It currently only displays one match
function displayDataMenteesMatch(menteeMatch) {

  var menteeMatchOneRef = menteeMatch;

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
    Database.getDownloadURL(menteeMatchSnapVal["HeadshotFilename"], function(result, response) {
      if (result) {
        $("#home-match-pic").attr("src", response)
      }
    });

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

  //display their picture if present
  Database.getDownloadURL(snapDataAsJson["HeadshotFilename"], function(result, response) {
    console.log(response)
    if (result) {
      $("#home-user-pic").attr("src", response)
    }
  });
}

//displaying user's match's info if user is a mentor
function displayDataMentorsMatch(mentorMatch) {

  var mentorMatchOneRef = mentorMatch;


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

    //display their picture if present
    Database.getDownloadURL(mentorMatchSnapVal["HeadshotFilename"], function(result, response) {
      if (result) {
        $("#home-match-pic").attr("src", response)
      }
    });

  });
}
