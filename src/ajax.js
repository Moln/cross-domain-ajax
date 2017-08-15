var urlSerialize = require('./url-serialize');

module.exports = window.ajax = function (params) {
    var defaults = {
        url: false,
        type: "GET",
        data: "",
        contentType: "application/x-www-form-urlencoded",
        async: true,
        success: function (data) {
        },
        error: function (request) {
        },
        charset: "UTF-8"
    };

    for (var i in defaults) {
        if (params[i] === undefined) params[i] = defaults[i];
    }

    if (!params.url) alert('Url not empty!');
    var request;
    this.httpRequest = function () {
        if (typeof XMLHttpRequest != "undefined") {
            request = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            var aVersions = ["Msxml2.XMLHttp.5.0", "Msxml2.XMLHttp.4.0", "Msxml2.XMLHttp.3.0", "Msxml2.XMLHttp", "Microsoft.XMLHttp"];
            for (var i = 0; i < aVersions.length; i++) {
                try {
                    request = new ActiveXObject(aVersions[i]);
                    break;
                } catch (e) {
                }
            }
        }
        if (request) {
            this.initReq();
        } else {
            alert("Your browser does not permit the use of all " +
                "of this application's features!");
        }
    };

    this.initReq = function () {
        request.open(params.type, params.url, params.async);
        /* Set the Content-Type header for a POST request */
        request.setRequestHeader("Content-Type", params.contentType + "; charset=" + params.charset);
        request.setRequestHeader("X-Requested-With", "XMLHttpRequest");

        if (params.headers) {
            for (var i in params.headers) {
                request.setRequestHeader(i, params.headers[i]);
            }
        }
        try {
            request.send(urlSerialize(params.data));
        } catch (e) {
            return false;
        }
        request.onreadystatechange = this.handleResponse;
        return true;
    };

    this.handleResponse = function () {
        if (request.readyState == 4) {
            if (request.status >= 200 && request.status < 300) {
                params.success(request.responseText, request);
            } else {
                params.error(request);
            }

            params.complete && params.complete(request);
        }
    };
    this.httpRequest();

    if (!params.async) {
        if (request.status >= 200 && request < 300) params.success(request.responseText);
        else params.error(request);
    }

    return request;
};