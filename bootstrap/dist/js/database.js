/* -----------------------------------------------------------------------------------------------
 * 
 * database.js
 *
 * <Describe file>
 *
 * <Notice that any files that include this must also include firebase scripts>
 *
 * <Warning about how this will likely be moved to server-side>
 *
 * TODO:
 * - Can we port this to npm? That way we can simply require() firebase.
 * - Keep track of DB schema so we can't add a data endpoint that doesn't exist.
 *
 * -----------------------------------------------------------------------------------------------
 */

/*
 * Object module, use like Database.<function> or Database.<var>
 */
var Database = (function() {
    //
    // Module members
    //

    var config = {
        apiKey: "AIzaSyAz1Z5At4sp5oZ6EIrxLZQeYS2BGIpgIbg",
        authDomain: "ubeyond-website.firebaseapp.com",
        databaseURL: "https://ubeyond-website.firebaseio.com",
        storageBucket: "ubeyond-website.appspot.com",
        messagingSenderId: "1065235196568"
    };

    //
    // Meta functions.
    //

    /*
     * Call this function on page load. Initializes the firebase connection.
     */
    var initialize = function() {
        firebase.initializeApp(config);
    }

    /*
     * Anonymously sign-in to the database so we can read/write.
     *
     * Note: Anonymous sign-in must only be used during private development stage.
     */
    var authenticate = function() {
        firebase.auth().signInAnonymously().catch(function(error) {
            var errorCode = "error.code: " + error.code;
            var errorMessage = "error.message: " + error.message;

            // Log authentication error to console
            console.log("Authentication error:\n" + errorCode + "\n" + errorMessage);
        });
    }

    /*
     * Sign out of the database.
     */
    var unauthenticate = function() {
        firebase.auth().signOut();
    }

    /*
     * Attempt to log the specified user in.
     *
     * This function uses an asynchronous firebase call, thus it will provide its return value to
     * the provided callback function.
     *
     * Returns true if the login succeeded, otherwise false.
     *
     * Note: in production, make sure password encrypted end-to-end.
     */
    var signin = function(username, password, callback) {
        var ref = firebase.database();
        authenticate();

        // Fetch all users
        var users = ref.ref("Users/");
        users.once("value").then(function(snapshot) {
            var admins = snapshot.child("Admins");
            var mentees = snapshot.child("Mentees");
            var mentors = snapshot.child("Mentors");

            // TODO: Could return {status: true/false, class: admin/mentor/mentee}
            // TODO: Could distinguish between password failure and username unrecognized
            // TODO: Support encryption

            // Check admins
            if (admins.hasChild(username)) {
                callback(admins.child(username).child("password").val() == password);
            }
            // Check mentees
            else if (mentees.hasChild(username)) {
                callback(mentees.child(username).child("password").val() == password);
            }
            // Check mentors
            else if (mentors.hasChild(username)) {
                callback(mentors.child(username).child("password").val() == password);
            }
            // Username not found
            else {
                callback(false);
            }

            // Close connection
            unauthenticate();
        });
    }

    //
    // Mentee functions
    //

    /*
     * Registers a new mentee in the database.
     */
    var registerMentee = function(username, email, password, callback) {
        var ref = firebase.database();
        authenticate();

        // TODO: Adhere to schema via schema definitions (i.e., variables)
        //       (low-priority, since eventually moving backend)
        //
        // TODO: Check if email already registered

        var users = ref.ref("Users/");
        var mentee = ref.ref("Users/Mentees/" + username);

        // Read data
        users.once("value").then(function(snapshot) {
            var status = "success";
            var isUnique = !snapshot.hasChild("Admins/" + username)
                    && !snapshot.hasChild("Mentees/" + username)
                    && !snapshot.hasChild("Mentors/" + username);
            
            // Check if username already registered
            if (!isUnique) {
                status = "error: " + username + " already registered.";
            }
            // Set up initial user information
            else {
                mentee.set({
                    "email": email, 
                    "password": password,
                    "isAvailable": false
                });
            }

            // Close connection
            unauthenticate();

            // Return status
            callback(status);
        });
    }

    /*
     * Updates mentee fields in the database.
     *
     * Note: in production, use a token to ensure that the person requesting this update has perms,
     *       or use firebase perms.
     *
     * Note: could use proper JS classes/etc... instead of accepting any random fields user suggests
     *       (could overwrite pass, for instance)
     */
    var updateMenteeData = function(menteeID, fields, callback) {
        var ref = firebase.database();
        authenticate();

        var mentee = ref.ref("Users/Mentees/" + menteeID);

        // Update data if mentee exists
        mentee.once("value").then(function(snapshot) {
            var status = "success";

            // Check that menteeID exists
            if (!snapshot.exists()) {
                status = "error: " + menteeID + " not found.";
            }
            else {
                mentee.update(fields);
            }

            // Close connection
            unauthenticate();

            // Return status
            callback(status);
        });
    }

    var updateMenteeFormData = function(menteeID, fields, callback) {
        var ref = firebase.database();
        authenticate();

        // TODO: Could check to make sure mentee exists
        // TODO: Could require authentication to make sure menteeID actually signed-in

        var menteeForm = ref.ref("MenteeQuestionnaires/" + menteeID);
        menteeForm.set(fields);

        unauthenticate();
        callback(true);
    }

    //
    // Mentor functions
    //

    /*
     * Registers a new mentor in the database.
     */
    var registerMentor = function(username, email, password, callback) {
        var ref = firebase.database();
        authenticate();

        // TODO: Adhere to schema via schema definitions (i.e., variables)
        //       (low-priority, since eventually moving backend)
        //
        // TODO: Check if email already registered

        var users = ref.ref("Users/");
        var mentor = ref.ref("Users/Mentors/" + username);

        // Read data
        users.once("value").then(function(snapshot) {
            var status = "success";
            var isUnique = snapshot.hasChild("Admins/" + username)
                    || snapshot.hasChild("Mentees/" + username)
                    || snapshot.hasChild("Mentors/" + username);

            // Check if username already registered
            if (!isUnique) {
                status = "error: " + username + " already registered.";
            }
            // Set up initial user information
            else {
                mentor.set({
                    "email": email, 
                    "password": password,
                    "isAvailable": false
                });
            }

            // Close connection
            unauthenticate();

            // Return status
            callback(status);
        });
    }

    /*
     * Updates mentor fields in the database.
     *
     * Note: in production, use a token to ensure that the person requesting this update has perms,
     *       or use firebase perms.
     *
     * Note: could use proper JS classes/etc... instead of accepting any random fields user suggests
     *       (could overwrite pass, for instance)
     */
    var updateMentorData = function(mentorID, fields, callback) {
        var ref = firebase.database();
        authenticate();

        var mentor = ref.ref("Users/Mentors/" + mentorID);

        // Update data if mentee exists
        mentor.once("value").then(function(snapshot) {
            var status = "success";

            // Check that mentorID exists
            if (!snapshot.exists()) {
                status = "error: " + mentorID + " not found.";
            }
            else {
                mentor.update(fields);
            }

            // Close connection
            unauthenticate();

            // Return status
            callback(status);
        });
    }

    //
    // Explicitly reveal pointers to functions we want to make public
    //
    return {
        initialize: initialize,
        signin: signin,
        registerMentee: registerMentee,
        updateMenteeData: updateMenteeData,
        updateMenteeFormData: updateMenteeFormData,
        registerMentor: registerMentor,
        updateMentorData: updateMentorData
    }
})();