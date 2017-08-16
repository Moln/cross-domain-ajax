var pm = require('@moln/postmessage');
var ajax = require('./ajax');

var extend = function () {
    var options, name, src, copy,
        target = arguments[0] || {},
        i = 1,
        length = arguments.length;


    if (typeof target !== "object") {
        target = {};
    }

    for (; i < length; i++) {
        if ((options = arguments[i]) != null) {
            // Extend the base object
            for (name in options) {
                src = target[name];
                copy = options[name];

                if (target === copy) {
                    continue;
                }

                target[name] = copy;
            }
        }
    }

    return target;
};

var serializeScale = function (obj) {
    var result = {};
    for (var i in obj) {
        if (typeof obj[i] != 'function') {
            result[i] = obj[i];
        }
    }

    return result;
};
var setResponseJson = function (request) {
    var cType;
    if (cType = request.getResponseHeader('Content-Type')) {
        //application/json; charset=utf-8
        //application/hal+json
        if (/application\/([\w\b]*)json([\w\b]*)/.test(cType)) {
            request.responseJSON = window.JSON.parse(request.responseText);
        }
    }
};

var verifyOrigin = function () {};

var onVerifyOrigin = function (cb) {
    verifyOrigin = cb;
};

pm.bind('cross-ajax', function (params) {
    verifyOrigin(params.origin);
    var data = params.data;

    ajax(extend(data, {
        headers: {
            'X-Referer': document.referrer
        },
        success: function (data, request) {
            setResponseJson(request);
            pm.send({
                target: window.parent,
                type: 'cross-ajax.success',
                data: data
            });
        },
        error: function (request) {
            setResponseJson(request);
            pm.send({
                target: window.parent,
                type: 'cross-ajax.error',
                data: request
            });
        },
        complete: function (request) {
            setResponseJson(request);
            var result = request.status >= 200 && request.status < 300 ? 'success' : 'error';
            params.callback(result, serializeScale(request));
            pm.send({
                target: window.parent,
                type: 'cross-ajax.complete',
                data: request
            });
        }
    }))
});

module.exports = {
    onVerifyOrigin: onVerifyOrigin
};