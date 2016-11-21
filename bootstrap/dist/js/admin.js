// TODO: Fucntion to confirm a mentor/mentee pair
// TODO: Function to dynamically create all mentor/mentee Pairs
// TODO: Method to get all information from Firebase.

// Get information from Database
$(function(){
     var database = firebase.database();
     var menteeMatching =  database.ref("MenteeMatch/");
     menteeMatching.on('value',function(snapshot){
            console.log(snapshot)
        });


});
//Create dropdown matches for Admin 
//Will be replacaed by Array Length from Firebase
counter = 1; 
// Will act as a helper function and pass in the information to set for the lists
$(function(){
    $("#cloneBtn").click(function(){
        counter++;
        var dropdown =  $("#matches-div > .container:first").clone(); 
        dropdown.find("a").attr("href","#collapse"+ counter); 
        var idName = "#collapse1";      
        dropdown.find(idName).attr("id","collapse" + counter);

        //Here will set the information for who the Mentors are.
        dropdown.appendTo("#matches-div:last");
    })
});

