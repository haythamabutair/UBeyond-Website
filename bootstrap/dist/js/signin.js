function onSigninBtnClick(caller) {
  event.preventDefault(); // Stop auto-navigation to href (chrome, firefox)
  
  // So we can navigate to the target HREF on success
  var href = document.getElementById(caller.id).href;

  var username = document.getElementById('inputUsername').value;
  var password = document.getElementById('inputPassword').value;
  
  // Try sign-in
  Database.signin(username, password, function(result) {
    // TODO: Probably should use a better alert method

    // True: signed in
    if (result) {
        alert("Welcome back to U-Beyond, " + username + "!")
    }
    // False: incorrect username/password
    else {
        alert("Incorrect username/password.");
    }
  });

  // Stop auto-navigation to href (IE)
  return false;
}