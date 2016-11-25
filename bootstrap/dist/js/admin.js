// TODO: Fucntion to confirm a mentor/mentee pair
// TODO: Function to dynamically create all mentor/mentee Pairs
// TODO: Method to get all information from Firebase.

//Gloabal arrays to hold the matching pairs, share the same index
var listOfMentees =  [];
var listOfMentors = [];
var menteeCount = 0;
var mentorCount = 0;
//LanguagePreference & MenteeLevelPrefence are arrays from Firebase
var listOfMentorKeys = ["FirstName","LastName","Birthdate","Gender", "Languages", "GenderPreference","Bio",
"LanguagePreference", "PreferredStartDate", "YearsOfExperience", "FieldOfExpertise", "MenteeLevelPreference","Employer", "Strenghts"]

var listOfMenteeKeys =  ["FirstName","LastName","Birthdate","Gender", "Languages", "GenderPreference","Bio",
"LanguagePreference", "PreferredStartDate", "MenteeSkills", "FieldOfExpertise", "FieldPreference", "EmploymentStatus"]

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
            //Loop through each pair 
            snapshot.forEach(function(childSnapshot){
                makeContainters(count)
                count++;
                var mentee = childSnapshot.key;
                var mentor;  
                for(x in childSnapshot.val()){
                    mentor = childSnapshot.val()[x]["User"];
                }

                // Needed to get information about Mentor and Mentee
                var mentorInfo = database.ref("Mentor/" + mentor);
                var menteeInfo = database.ref("Mentee/" + mentee);
                var studentInfo = database.ref("StudentInfo/" + mentee);

                //Get Mentee Information 
                menteeInfo.once('value',function(snapshot){
                    //Need to get student Info, if Student 
                    if(snapshot.val().EmploymentStatus == "student"){
                        studentInfo.once('value', function(childSnapshot){
                            createMenteeObject(snapshot.val(), childSnapshot.val());
                        });

                    }else{
                        // TODO: Check if Mentee is a Employee/Worker
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

//dynamically makes the container to 
function makeContainters(index){
    //Main container to hold all the information 
    var container = document.getElementById("containerMM");
    var fluidContainer = document.createElement("div");
    var rowDiv = document.createElement("div");
    fluidContainer.setAttribute("class","container-fluid");
    fluidContainer.setAttribute("id","mentee-mentor-comparision" + index);
    rowDiv.setAttribute("clsss","row");
    rowDiv.setAttribute("id","row-comparision"+index)
    var btnDiv = createButtons(index);
    fluidContainer.appendChild(rowDiv);

    fluidContainer.appendChild(btnDiv);
    container.appendChild(fluidContainer);
}

function createButtons(index){

    var btnDiv = document.createElement("div");
    btnDiv.setAttribute("class", "row");
    var colDiv = document.createElement("div");
    colDiv.setAttribute("class","col-md-6");
    btnDiv.appendChild(colDiv);
    var accceptBtn = document.createElement("button");
    var declineBtn = document.createElement("button");
    accceptBtn.setAttribute("type", "button");
    accceptBtn.setAttribute("class", "btn btn-primary group" + index);
    accceptBtn.innerText = "Accept"
    declineBtn.setAttribute("type", "button");
    declineBtn.setAttribute("class", "btn btn-danger group" + index);
    declineBtn.innerText = "Reject"
    colDiv.appendChild(accceptBtn);
    colDiv.appendChild(declineBtn); 
     
    return btnDiv;
}

// Helper method to create elements 
function createElements(elementType, inText){
    var temp = document.createElement(elementType);
    temp.innerText = inText;
    return temp;
}

function createMenteeObject(coreSnapShot, addOnSnapShot){
    var mainContainer = document.getElementById("row-comparision" + menteeCount);
    menteeCount++;

    var mainDiv = document.createElement("div");
    mainDiv.setAttribute("class","col-md-6 mentee")

    var dl = document.createElement("dl");
    mainDiv.appendChild(dl);

    //Add Core Mentee Info 
    listOfMenteeKeys.forEach(function(value){
        var tempdt = createElements("dt",value)
        var tempdd = createElements("dd",coreSnapShot[value])
        dl.appendChild(tempdt);
        dl.appendChild(tempdd);
    });
    
    //Specific add on data, Want all of it 
    for (var key in addOnSnapShot){
        var value = addOnSnapShot[key];
        var tempdt = createElements("dt",key);
        var tempdd = createElements("dd",value);
        dl.appendChild(tempdt);
        dl.appendChild(tempdd);
    }

    mainContainer.appendChild(mainDiv);
}


function createMentorObject(mentorSnapshot){
    var mainContainer = document.getElementById("row-comparision" + mentorCount);
    mentorCount++;

    var mainDiv = document.createElement("div");
    mainDiv.setAttribute("class","col-md-6 mentor")
    var dl = document.createElement("dl");
    mainDiv.appendChild(dl);


    //Loop through the Keys and creates an element for each 
    listOfMentorKeys.forEach(function(value){
        var tempdt = createElements("dt",value)
        var tempdd = createElements("dd",mentorSnapshot[value])
        dl.appendChild(tempdt);
        dl.appendChild(tempdd);
    });
    
    mainContainer.appendChild(mainDiv);
}

