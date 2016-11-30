/* -----------------------------------------------------------------------------------------------
 * 
 * model.js
 *
 * Provides functions for packing data into objects whose structure matches the schema of the
 * database.
 *
 * -----------------------------------------------------------------------------------------------
 */

var Model = (function() {

    /*
     * Structures persob object data into a schema-adhering object.
     *
     * See Mentee and Mentor in database.
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

        if (middleInitial != "") {
            baseObject["MiddleInitial"] = middleInitial;
        }

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
     * Structures user object data into a schema-adhering object.
     *
     * See Mentee and Mentor in database.
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

        // Not possible for a pending match to exist at creation
        baseObject["PendingApproval"]    = false;

        // Return personObject for convenience
        return baseObject;
    }

    /*
     * Structures mentor reference data into a schema-adhering object.
     *
     * See MentorReference in database.
     */
    var createReferenceObject = function(
            baseObject,
            firstName,
            lastName,
            address,
            phoneNumber,
            email,
            relationship
    ) {
        baseObject["FirstName"]    = firstName;
        baseObject["LastName"]     = lastName;
        baseObject["Address"]      = address;
        baseObject["PhoneNumber"]  = phoneNumber;
        baseObject["Email"]        = email;
        baseObject["Relationship"] = relationship;

        return baseObject;
    }

    return {
        createPersonObject: createPersonObject,
        createUserObject: createUserObject,
        createReferenceObject: createReferenceObject
    }

})();