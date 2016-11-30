//Count of how many Mentee's and mentor's
var menteeCount = 0;
var mentorCount = 0;
//LanguagePreference & MenteeLevelPrefence are arrays from Firebase
var listOfMentorKeys = ["First Name","Last Name","Birthdate","Gender", "Languages", "Gender Preference","Bio",
"Language Preference", "Preferred StartDate", "Years Of Experience", "Field Of Expertise", "Mentee Level Preference","Employer", "Strenghts"];
var listOfMenteeKeys =  ["First Name","Last Name","Birthdate","Gender", "Languages", "Gender Preference","Bio",
"Language Preference", "Preferred StartDate", "Mentee Skills", "Field Of Expertise", "Field Preference", "Employment Status"];

$(function(){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            //Add check here to see if user is an admin then call function
            getMatches();
        } else {
            // No user is signed in.
        }
    });
});


function getMatches(){
    //Setup Firebase Ref information and get current Admin
    var database = firebase.database();
    var menteeMatches = database.ref("MenteeMatch/");
    var mentorMatches = database.ref("MentorMatch/");

    //Gets all of the matches
    var count = 0;
    menteeMatches.on('value',function(snapshot){
        if(snapshot.val() != null){
            //Loop through each pair of matches
            snapshot.forEach(function(childSnapshot){
                //Addes containers for each mentor/mentee match

                var mentee = childSnapshot.key;
                var mentor;
                for(x in childSnapshot.val()){
                    mentor = childSnapshot.val()[x]["User"];
                }
                makeContainters(count, mentee , mentor);
                count++;
                // Firebase calls to get Specific information about mentor and mentee
                var mentorInfo = database.ref("Mentor/" + mentor);
                var menteeInfo = database.ref("Mentee/" + mentee);

                //Get Mentee Information
                menteeInfo.once('value',function(snapshot){
                    //Can be a student or employed
                    if(snapshot.val().EmploymentStatus == "student"){
                        //Firabse call to get student information
                        var studentInfo = database.ref("StudentInfo/" + mentee);
                        studentInfo.once('value', function(childSnapshot){
                            createMenteeObject(snapshot.val(), childSnapshot.val());
                        });

                    }else{
                        //Firebase call to get Employed Information
                        var employedInfo = database.ref("EmployeeInfo/" + mentee);
                        employedInfo.once('value', function(childSnapshot){
                            createMenteeObject(snapshot.val(), childSnapshot.val());
                        });
                    }
                }); //End MenteeInfo Method

                //Gets information about Mentor
                mentorInfo.once('value',function(snapshot){
                     createMentorObject(snapshot.val());
                });

            }); //End of Foreach method for each pair

        } //End Of snapshot != Null

    });//End of Mentee Matching

    //Checkes mentor matches as well. Have to check both
    mentorMatches.on('value',function(snapshot){
      if(snapshot.val() != null){
          //Loop through each pair of matches
          snapshot.forEach(function(childSnapshot){
              //Addes containers for each mentor/mentee match

              var mentor = childSnapshot.key;
              var mentee;
              for(x in childSnapshot.val()){
                  mentee = childSnapshot.val()[x]["User"];
              }
              makeContainters(count, mentee , mentor);
              count++;
              // Firebase calls to get Specific information about mentor and mentee
              var mentorInfo = database.ref("Mentor/" + mentor);
              var menteeInfo = database.ref("Mentee/" + mentee);

              //Get Mentee Information
              menteeInfo.once('value',function(snapshot){
                  //Can be a student or employed
                  if(snapshot.val().EmploymentStatus == "student"){
                      //Firabse call to get student information
                      var studentInfo = database.ref("StudentInfo/" + mentee);
                      studentInfo.once('value', function(childSnapshot){
                          createMenteeObject(snapshot.val(), childSnapshot.val());
                      });

                  }else{
                      //Firebase call to get Employed Information
                      var employedInfo = database.ref("EmployeeInfo/" + mentee);
                      employedInfo.once('value', function(childSnapshot){
                          createMenteeObject(snapshot.val(), childSnapshot.val());
                      });
                  }
              }); //End MenteeInfo Method\

              //Gets information about Mentor
              mentorInfo.once('value',function(snapshot){
                      createMentorObject(snapshot.val());
              });

          }); //End of Foreach method for each pair

      } //End Of snapshot != Null

  });//End of Mentor Matching

}//End of getMatches()

//dynamically makes the container to hold the information of mentors and metee matching
function makeContainters(index, menteeUID, mentorUID){
    //Main container to hold all the information
    var container = document.getElementById("containerMM");
    var fluidContainer = document.createElement("div");
    var informationDiv = document.createElement("div");
    //Make div's for mentee and mentor since Firebase calls are async don't know when they will return
    var menteeDiv = document.createElement("div");
    var mentorDiv = document.createElement("div");

    var mentorTitle = document.createElement("h3");
    var menteeTitle = document.createElement("h3");
    //Function to creat buttons
    var btnDiv = createButtons(index, menteeUID, mentorUID);

    fluidContainer.setAttribute("class","row well");
    fluidContainer.setAttribute("id","mentee-mentor-comparision" + index);
    informationDiv.setAttribute("clsss","col-md-12 dyn-div");
    //Need to handle floating div problem
    fluidContainer.style.backgroundColor = "#F0F8FF"
    //Need to handle floating div problem
    informationDiv.setAttribute("style","overflow: hidden;");
    menteeDiv.setAttribute("class","col-md-6");
    menteeDiv.setAttribute("id","mentee"+ index);
    mentorDiv.setAttribute("class","col-md-6");
    mentorDiv.setAttribute("id","mentor"+index);

    mentorTitle.innerText = "Mentor";
    menteeTitle.innerText = "Mentee";
    menteeDiv.appendChild(menteeTitle);
    mentorDiv.appendChild(mentorTitle);


    informationDiv.appendChild(menteeDiv);
    informationDiv.appendChild(mentorDiv);
    fluidContainer.appendChild(informationDiv);
    fluidContainer.appendChild(btnDiv);
    container.appendChild(fluidContainer);
}

function createButtons(index, menteeUid, mentorUid){

    //Create html objects
    var btnDiv = document.createElement("div");
    var accceptBtn = document.createElement("button");
    var declineBtn = document.createElement("button");

    //Set attributes
    btnDiv.setAttribute("class", 'text-center')
    accceptBtn.setAttribute("type", "button");
    accceptBtn.setAttribute("class", "btn btn-lg btn-primary");
    accceptBtn.innerText = "Accept"
    declineBtn.setAttribute("type", "button");
    declineBtn.setAttribute("class", "btn btn-lg btn-danger");
    declineBtn.innerText = "Reject"

    //Set function to send information back to firebase and remove from html
    accceptBtn.addEventListener("click", function(){
        onAccept(index, menteeUid, mentorUid)
    } ,false);
    declineBtn.addEventListener("click", function(){
        onReject(index, menteeUid, mentorUid)
    } ,false);

    btnDiv.appendChild(accceptBtn);
    btnDiv.appendChild(declineBtn);
    return btnDiv;
}


function onAccept(index, menteeUid, mentorUid){
    // remove div with mentee and mentor
    $("#mentee-mentor-comparision" + index).remove();
    //Use Ajax calls to send information back to the server
    $.ajax({
        url:"http://mentorshipatlanta.info/match/confirm/"+ mentorUid + "/" + menteeUid,
        type: "POST",
        success: function(response){
            console.log('It sent' + response);
        },
        error: function(xhr){
            console.log('It failed' + xhr);

        }
    });
}

function onReject(index, menteeUid, mentorUid){
    $("#mentee-mentor-comparision" + index).remove();

    $.ajax({
        url: "http://mentorshipatlanta.info/match/reject/"+ mentorUid + "/" + menteeUid,
        type: "POST",
        success: function(response){
            console.log('reject endpoint returned successfully with ' + response);

            // Run matching algorithm for mentee
            $.ajax({
                url: "http://mentorshipatlanta.info/match/mentee/" + menteeUid,
                type: "POST",
                success: function(response) {
                    console.log("matching endpoint for mentee returned successfully with " + response);
                },
                error: function(xhr) {
                    console.log("matching endpoint for mentee returned an error: " + xhr);
                }
            });

            // Run matching algorithm for mentor
            $.ajax({
                url: "http://mentorshipatlanta.info/match/mentor/" + mentorUid,
                type: "POST",
                success: function(response) {
                    console.log("matching endpoint for mentor returned successfully with " + response);
                },
                error: function(xhr) {
                    console.log("matching endpoint for mentor returned an error: " + xhr);
                }
            });
        },
        error: function(xhr){
            console.log('reject endpoint returned an error: ' + xhr);
        }
    });
}

// Helpre method to hit the matching algorithm endpoint for a user
function triggerMatchingAlgorithm(userID) {

}

// Helper method to create elements
function createElements(elementType, inText){
    var temp = document.createElement(elementType);
    temp.innerText = inText;
    return temp;
}

//Code to dynamically make Mentee HTML Objects, Needs addon because of changing data
function createMenteeObject(coreSnapShot, addOnSnapShot){
    var mainContainer = document.getElementById("mentee" + menteeCount);
    menteeCount++;

    var dl = document.createElement("dl");
    dl.setAttribute("class", "dl-horizontal");
    mainContainer.appendChild(dl);

    //Add Core Mentee Info
    listOfMenteeKeys.forEach(function(value){
        var tempdt = createElements("dt",value)
        var tempdd = createElements("dd",coreSnapShot[value.replace(/\s/g, '')])
        dl.appendChild(tempdt);
        dl.appendChild(tempdd);
    });

    //Specific add on data ie. Worker or student
    for (var key in addOnSnapShot){
        var value = addOnSnapShot[key];
        var tempdt = createElements("dt",key);
        var tempdd = createElements("dd",value);
        dl.appendChild(tempdt);
        dl.appendChild(tempdd);
    }
}

//Code to dynamically make Mentor HTML and add it to the page.
function createMentorObject(mentorSnapshot){
    var mainContainer = document.getElementById("mentor" + mentorCount);
    mentorCount++;

    var dl = document.createElement("dl");
    dl.setAttribute("class", "dl-horizontal");
    mainContainer.appendChild(dl);


    //Loop through the Keys and creates an element for each
    listOfMentorKeys.forEach(function(value){
        var tempdt = createElements("dt",value)
        var tempdd = createElements("dd",mentorSnapshot[value.replace(/\s/g, '')])
        dl.appendChild(tempdt);
        dl.appendChild(tempdd);
    });
}
