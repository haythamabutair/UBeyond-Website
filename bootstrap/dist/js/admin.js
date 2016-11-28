//Count of how many Mentee's and mentor's
var menteeCount = 0;
var mentorCount = 0;
//LanguagePreference & MenteeLevelPrefence are arrays from Firebase
var listOfMentorKeys = ["First Name","Last Name","Birthdate","Gender", "Languages", "Gender Preference","Bio",
"Language Preference", "Preferred StartDate", "Years Of Experience", "Field Of Expertise", "Mentee Level Preference","Employer", "Strenghts"];
var listOfMenteeKeys =  ["First Name","Last Name","Birthdate","Gender", "Languages", "Gender Preference","Bio",
"Language Preference", "Preferred StartDate", "Mentee Skills", "Field Of Expertise", "Field Preference", "Employment Status"];

// Sign-in to use Firebase, Will change after Login Screen Linked 
$(function(){
    var email = "dev@ubeyond-website.com";
    var password = "qCLcZjQFtqTpDHW"
    Database.authenticate(email, password, function(success, response) {
        // Sign-in succeeded
        if (success) {
            var userID = response;
            getMatches();
        }
        else {

        }
    });
});



function getMatches(){
    //Setup Firebase Ref information and get current Admin 
    var database = firebase.database();
    var curUser = firebase.auth().currentUser;
    var curUserID = firebase.auth().currentUser.uid;
    var menteeMatches = database.ref("MenteeMatch/");

    //Gets all of the matches 
    var count = 0;
    menteeMatches.on('value',function(snapshot){
        if(snapshot.val() != null){
            //Loop through each pair of matches  
            snapshot.forEach(function(childSnapshot){
                //Addes containers for each mentor/mentee match 
                makeContainters(count);
                count++;
                var mentee = childSnapshot.key;
                var mentor;  
                for(x in childSnapshot.val()){
                    mentor = childSnapshot.val()[x]["User"];
                }

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

}//End of getMatches()

//dynamically makes the container to hold the information of mentors and metee matching 
function makeContainters(index){
    //Main container to hold all the information 
    var container = document.getElementById("containerMM");
    var fluidContainer = document.createElement("div");
    var informationDiv = document.createElement("div");
    //Make div's for mentee and mentor since Firebase calls are async don't know when they will return
    var menteeDiv = document.createElement("div");
    var mentorDiv = document.createElement("div");
    //Function to creat buttons 
    var btnDiv = createButtons(index);
    
    fluidContainer.setAttribute("class","row well");
    fluidContainer.setAttribute("id","mentee-mentor-comparision" + index);
    informationDiv.setAttribute("clsss","col-md-12");
    //Need to handle floating div problem 
    informationDiv.setAttribute("style","overflow: hidden;");
    menteeDiv.setAttribute("class","col-md-6");
    menteeDiv.setAttribute("id","mentee"+ index);
    mentorDiv.setAttribute("class","col-md-6");
    mentorDiv.setAttribute("id","mentor"+index);
    
    informationDiv.appendChild(menteeDiv);
    informationDiv.appendChild(mentorDiv);
    fluidContainer.appendChild(informationDiv);
    fluidContainer.appendChild(btnDiv);
    container.appendChild(fluidContainer);
}

function createButtons(index){

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
    accceptBtn.setAttribute('onclick','onAccept(' + index +')');
    declineBtn.setAttribute('onclick','onReject(' + index + ')');

    btnDiv.appendChild(accceptBtn);
    btnDiv.appendChild(declineBtn); 
    return btnDiv;
}


function onAccept(index){
    // remove div with mentee and mentor
    $("#mentee-mentor-comparision" + index).remove();
    console.log(menteeKeys)
    //Send information back to firebase
}

function onReject(index){
    $("#mentee-mentor-comparision" + index).remove();

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

