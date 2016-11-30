
var Global = (function() {
    
    // Code from stackoverflow post @ http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
    var getParameterByName = function(name, url) {
        if (!url) {
            url = window.location.href;
        }

        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);

        if (!results) {
            return null;
        }

        if (!results[2]) {
            return '';
        }

        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    // To display an alert() more gracefully
    //
    // TODO: Take in the ID of the html element that will be displayed as the notification
    var showNotification = function(message, isError) {
        // TODO: use something other than alert()
        alert(message);
    }

    return {
        getParameterByName: getParameterByName,
        showNotification: showNotification
    }
})();