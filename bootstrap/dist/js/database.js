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

    // URI headers for user types
    var ADMIN  = "Admin";
    var MENTEE = "Mentee";
    var MENTOR = "Mentor";

    // URI headers for questionnaires
    var MENTEE_FORM = "MenteeQuestionnaires";
    var MENTOR_FORM = "MentorQuestionnaires";

    // URI headers for info structures
    var STUDENT_INFO   = "StudentInfo";
    var EMPLOYYEE_INFO = "EmployeeInfo";

    // URI headers for file storage
    const STORAGE_RESUME   = "documents"; // document storage node
    const STORAGE_HEADSHOT = "images";    // image storage node

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
    var updateUserData = function(userType, fields, callback) {
        var ref = firebase.database();
        var currentUser = firebase.auth().currentUser;

        // Make sure a user is signed-in
        if (currentUser) {
            ref.ref(userType + "/" + currentUser.uid).update(fields, function(error) {
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

    var updateMenteeData = function(fields, callback) {
        updateUserData(MENTEE, fields, callback);
    }

    var updateMentorData = function(fields, callback) {
        updateUserData(MENTOR, fields, callback);
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


    var setStudentInfoData = function(fields, callback) {
        setFormData(STUDENT_INFO, fields, callback);
    }


    var setEmployeeInfoData = function(fields, callback) {
        setFormData(EMPLOYYEE_INFO, fields, callback);
    }

    //
    // File upload functions
    //

    /*
     * Uploads a file to the firebase database.
     *
     * @path:       path at which to save the file in the database.
     * @file:       file to upload.
     * @callback:   callback function to call upon completion.
     *
     * TODO: Example
     *
     * NOTE: file upload requires authentication.
     */
    var uploadFile = function(path, file, callback) {
        const storageRef = firebase.storage().ref();
        var fileRef = storageRef.child(path);

        // Upload file
        fileRef.put(file).then(function(snapshot) {
            callback(true, null);
        }).catch(function(error) {
            callback(false, error.code + ": " + error.message);
        });
    }

    /*
     * TODO: Documentation
     */
    var uploadResume = function(file, callback) {
        var currentUser = firebase.auth().currentUser;

        // Ensure a user is signed-in
        if (currentUser) {
            var fileName = currentUser.uid + "_" + file.name;
            var filePath = STORAGE_RESUME + "/" + fileName;

            // Call file upload function
            uploadFile(filePath, file, callback);
        }
        else {
            callback(false, "cust-auth/no-sign-in: Not signed in");
        }
    }

    /*
     * TODO: Documentation
     */
    var uploadHeadshot = function(file, callback) {
        var currentUser = firebase.auth().currentUser;

        // Ensure a user is signed-in
        if (currentUser) {
            var fileName = currentUser.uid + "_" + file.name;
            var filePath = STORAGE_HEADSHOT + "/" + fileName;

            // Call file upload function
            uploadFile(filePath, file, callback);
        }
        else {
            callback(false, "cust-auth/no-sign-in: Not signed in");
        }
    }

    /*
     * Returns the downloadUrl to the callback for the file stored at the specified path in the
     * database.
     *
     * @storagePath:    the local path on the database at which this file is found, for
     *                  example, 'images/my_image.png'
     *
     * @callback:       callback function
     *
     * Callback: function(success, response)
     *   If the update operation is successful, the callback recieves (true, null). If it fails, the
     *   callback receives (false, errorMessage).
     *
     * Returns null to the callback if:
     *         file doesn't exist,
     *         an error occurs,
     *         or there is no user signed-in.
     * Returns the download URL of the file otherwise.
     */
    var getDownloadURL = function(storagePath, callback) {
        var currentUser = firebase.auth().currentUser;

        // Authentication required for storage interaction
        if (currentUser) {
            var storageRef = firebase.storage().ref();
            var fileRef = storageRef.child(storagePath);

            // fetch download URL asynchronously
            fileRef.getDownloadURL().then(function(downloadURL) {
                callback(true, downloadURL);
            }).catch(function(error) {
                callback(false, error.code + ": " + error.message);
            });
        }
        else {
            callback(false, "cust-auth/no-sign-in: Not signed in");
        }
    }

    //
    // Explicitly reveal pointers to functions we want to make public
    //
    return {
        initialize: initialize,
        authenticate: authenticate,
        registerUser: registerUser,
        updateMenteeData: updateMenteeData,
        updateMentorData: updateMentorData,
        setMenteeFormData: setMenteeFormData,
        setMentorFormData: setMentorFormData,
        setStudentInfoData: setStudentInfoData,
        setEmployeeInfoData: setEmployeeInfoData,
        uploadResume: uploadResume,
        uploadHeadshot: uploadHeadshot,
        getDownloadURL: getDownloadURL
    }
})();
