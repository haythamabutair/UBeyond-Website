/*
 * Attempt to sign in to the website.
 */
function onSigninBtnClick(caller) {
  event.preventDefault(); // Stop auto-navigation to href (chrome, firefox)
  
  // So we can navigate to the target HREF on success
  var href = document.getElementById(caller.id).href;
  var email = document.getElementById('inputEmail').value;
  var password = document.getElementById('inputPassword').value;
  
  Database.authenticate(email, password, function(success, response) {
    // Sign-in succeeded
    if (success) {
      var userID = response;
      //Loop through admins and see if userID is an Admin
      var adminRef = firebase.database().ref("Admin/");
      adminRef.child(userID).once('value', function(snapshot) {
        if (snapshot.val() !== null){
          window.open("adminPage.html","_self");
        }else{
          window.open("home.html", "_self");
        }
      });

    }
    // Sign-in failed
    else {
      // TODO: Eventually, use a different notification system
      alert("Sign-in failed. Error:\n" + response);
    }
  });
  // Stop auto-navigation to href (IE)
  return false;
}