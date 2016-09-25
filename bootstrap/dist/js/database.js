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

    // Database configurations
    var config = {
        apiKey: "AIzaSyAz1Z5At4sp5oZ6EIrxLZQeYS2BGIpgIbg",
        authDomain: "ubeyond-website.firebaseapp.com",
        databaseURL: "https://ubeyond-website.firebaseio.com",
        storageBucket: "ubeyond-website.appspot.com",
        messagingSenderId: "1065235196568"
    };

    // URI headers for questionnaires
    var MENTEE_FORM = "MenteeQuestionnaires";
    var MENTOR_FORM = "MentorQuestionnaires";

    //
    // Meta functions.
    //

    /*
     * TODO: Documentation
     */
    var initialize = function() {
        firebase.initializeApp(config);
    }

    /*
     * Authenticate the user via email/password.
     *
     * Since the authentication is done asynchronously, the result of the authentication is returned
     * via a callback function.
     *
     * Callback: function(success, response)
     * If the authentication is successful, the callback recieves (true, userID). If it fails, the
     * callback receives (false, errorMessage).
     *
     * Example:
     * Database.authenticate(user.email, user.password, function(success, response) {
     *     if (!success) alert(response);
     *     else {
     *         user.id = response;
     *     }
     * });
     */
    var authenticate = function(email, password, callback) {
        firebase.auth().signInWithEmailAndPassword(email, password).then(
            // On success
            function(user) {
                callback(true, user.uid);
            },
            // On failure
            function(error) {
                callback(false, error.code + ": " + error.message);
            }
        );
    }

    /*
     * Sign out of the database.
     */
    var unauthenticate = function() {
        // TODO: only do this when we sign out via a button
        //firebase.auth().signOut();
    }

    /*
     * Registers a new user in the database.
     *
     * Since the registration is done asynchronously, the result of the registration is returned via
     * a callback function.
     *
     * Callback: function(success, response)
     * If the registration is successful, the callback recieves (true, userID). If it fails, the
     * callback receives (false, errorMessage).
     *
     * Example:
     * Database.registerUser(user.email, user.password, function(success, response) {
     *     if (!success) alert(response);
     *     else {
     *         userID = response;
     *     }
     * });
     */
    var registerUser = function(email, password, callback) {
        var ref = firebase.database();

        // If a user is already signed-in, sign them out
        if (firebase.auth().currentUser) {
            firebase.auth().signOut().then(function() {
                // Try again once user is signed-out
                registerUser(email, password, callback);
            });
            // TODO: what if signOut() fails? -- it shouldn't but could add test case
        }
        else {
            firebase.auth().createUserWithEmailAndPassword(email, password).then(
                // On success
                function(user) {
                    callback(true, user.uid);
                },
                // On failure
                function(error) {
                    callback(false, error.code + ": " + error.message);
                }
            );
        }
    }

    /*
     * Updates fields in the database for the currently-signed-in user.
     *
     * Since the update is done asynchronously, the result of the update operation is returned via a
     * callback function.
     *
     * Callback: function(success, response)
     * If the update operation is successful, the callback recieves (true, null). If it fails, the
     * callback receives (false, errorMessage).
     *
     * Example:
     * Database.updateUserData({"phoneNumber": "555-867-5309"}, function(success, response) {
     *     if (!success) alert(response);
     * });
     */
    var updateUserData = function(fields, callback) {
        var ref = firebase.database();
        var currentUser = firebase.auth().currentUser;

        // Make sure a user is signed-in
        if (currentUser) {
            ref.ref("Users/" + currentUser.uid).update(fields, function(error) {
                // Check if update was successful
                if (error) {
                    callback(false, error.code + ": " + error.message);
                }
                else {
                    callback(true, null);
                }
            });
        }
        else {
            callback(false, "cust-auth/no-sign-in: Not signed in");
        }
    }

    /*
     * TODO: Documentation
     */
    var setFormData = function(form, fields, callback) {
        var ref = firebase.database();
        var currentUser = firebase.auth().currentUser;

        // Make sure a user is signed-in
        if (currentUser) {
            ref.ref(form + "/" + currentUser.uid).set(fields, function(error) {
                // Check if operation was successful
                if (error) {
                    callback(false, error.code + ": " + error.message);
                }
                else {
                    callback(true, null);
                }
            });
        }
        else {
            callback(false, "cust-auth/no-sign-in: Not signed in");
        }
    }

    //
    // Mentee functions
    //

    /*
     * Set the mentee's MenteeQuestionnaire data.
     */
    var setMenteeFormData = function(fields, callback) {
        setFormData(MENTEE_FORM, fields, callback);
    }

    //
    // Mentor functions
    //

    /*
     * Set the mentor's MentorQuestionnaire data.
     */
    var setMentorFormData = function(fields, callback) {
        setFormData(MENTOR_FORM, fields, callback);
    }

    //
    // Explicitly reveal pointers to functions we want to make public
    //
    return {
        initialize: initialize,
        authenticate: authenticate,
        registerUser: registerUser,
        updateUserData: updateUserData,
        setMenteeFormData: setMenteeFormData,
        setMentorFormData: setMentorFormData
    }
})();