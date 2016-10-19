/* -----------------------------------------------------------------------------------------------
 * 
 * model.js
 *
 * <Describe file>
 *
 * -----------------------------------------------------------------------------------------------
 */

var Model = (function() {

    /*
     * TODO: Documentation
     */
    var createPersonObject = function(
            firstName,
            lastName,
            middleInitial,
            preferredName,
            address,
            phoneNumber,
            email,
            gender,
            languages, /* array */
            birthdate
    ) {
        // Return JSON object
        return {
            "FirstName":     firstName,
            "LastName":      lastName,
            "MiddleInitial": middleInitial,
            "PreferredName": preferredName,
            "Address":       address,
            "PhoneNumber":   phoneNumber,
            "Email":         email,
            "Gender":        gender,
            "Languages":     languages, 
            "Birthdate":     birthdate
        }
    }

    /*
     * TODO: Documentation
     * Note: Modifies an existing PERSON object
     */
    var createUserObject = function(
            personObject,     /* TODO: These shouldn't need to be set, the paths should be known */
            headshotFilename, /* Path known by server */
            resumeFilename,   /* Path known by server */
            bio,
            preferredStartDate,
            languagePreference,
            genderPreference,
            userType,
            isAvailable
    ) {
        personObject["HeadshotFilename"]   = headshotFilename;
        personObject["ResumeFilename"]     = resumeFilename;
        personObject["Bio"]                = bio;
        personObject["PreferredStartDate"] = preferredStartDate;
        personObject["LanguagePreference"] = languagePreference;
        personObject["GenderPreference"]   = genderPreference;
        personObject["UserType"]           = userType;
        personObject["IsAvailable"]        = isAvailable;
    }

    /*
     * TODO: Documentation
     * Note: Modifies an existing USER object
     */
    var createMenteeObject = function(
            userObject
    )
    {

    }

    return {
        createPersonObject: createPersonObject,
        createUserObject: createUserObject
    }

})();