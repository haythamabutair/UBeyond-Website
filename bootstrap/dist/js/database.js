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
 * - Eventually, we should try to make this file be all-inclusive. IE registerUser(...)
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

    //
    // Mentee functions (TODO: Reorganize)
    //

    /*
     * Registers a new mentee in the database.
     */
    var registerMentee = function(menteeID, email, password, callback) {
        var ref = firebase.database();
        authenticate();

        // TODO: Adhere to schema via schema definitions (i.e., variables)
        //       (low-priority, since eventually moving backend)
        //
        // TODO: Check if email already registered

        var mentee = ref.ref("Users/Mentees/" + menteeID);

        // Read data and
        mentee.once("value").then(function(snapshot) {
            var status = "success";

            // Check if menteeID already exists
            if (snapshot.exists()) {
                status = "error: " + menteeID + " already registered.";
            }

            // Set up initial user information
            else {
                mentee.set({
                    "email": email, 
                    "password": password,
                    "isAvailable": false
                });
            }

            // TODO: signout/unauthenticate

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

            // Return status
            callback(status);
        });
    }

    //
    // Explicitly reveal pointers to functions we want to make public
    //
    return {
        initialize: initialize,
        // authenticate: authenticate, // Disallowed for now
        registerMentee: registerMentee,
        updateMenteeData: updateMenteeData
    }
})();