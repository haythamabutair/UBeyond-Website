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
            baseObject,
            firstName,
            lastName,
            middleInitial,
            preferredName,
            address,
            phoneNumber,
            email,
            gender,
            birthdate
    ) {
        baseObject["FirstName"]     = firstName;
        baseObject["LastName"]      = lastName;
        baseObject["MiddleInitial"] = middleInitial;
        baseObject["PreferredName"] = preferredName;
        baseObject["Address"]       = address;
        baseObject["PhoneNumber"]   = phoneNumber;
        baseObject["Email"]         = email;
        baseObject["Gender"]        = gender;
        baseObject["Birthdate"]     = birthdate;

        // Return baseObject for convenience
        return baseObject;
    }

    /*
     * TODO: Documentation
     * Note: Modifies an existing PERSON object
     */
    var createUserObject = function(
            baseObject,
            headshotFilename, /* Path known by server */
            resumeFilename,   /* Path known by server */
            bio,
            preferredStartDate,
            languages, /* array */
            languagePreference,
            genderPreference,
            isAvailable
    ) {
        baseObject["HeadshotFilename"]   = headshotFilename;
        baseObject["ResumeFilename"]     = resumeFilename;
        baseObject["Bio"]                = bio;
        baseObject["PreferredStartDate"] = preferredStartDate;
        // Languages technically in Person model, but not available until here
        baseObject["Languages"]          = languages;
        baseObject["LanguagePreference"] = languagePreference;
        baseObject["GenderPreference"]   = genderPreference;
        baseObject["IsAvailable"]        = isAvailable;

        // Return personObject for convenience
        return baseObject;
    }

    return {
        createPersonObject: createPersonObject,
        createUserObject: createUserObject
    }

})();