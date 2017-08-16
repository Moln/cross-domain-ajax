(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	
	var cdp = __webpack_require__(3);

	cdp.onVerifyOrigin(function (origin) {

	    console.log(origin);
	    if (!/localhost:8080$/.test(origin)) {
	        throw new Error('Invalid origin ' + origin);
	    }
	});

/***/ }),
/* 1 */,
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	(function (root, window, factory) {
	    var name = 'pm';

	    if (true)
	        module.exports = factory(window);
	    else if (typeof define === 'function' && define.amd)
	        define([], factory);
	    else if (typeof exports === 'object')
	        exports[name] = factory(window);
	    else
	        root[name] = factory(window);
	})(this, window, function (window) {
	    'use strict';

	    //@see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON
	    if (!window.JSON) {
	        window.JSON = {
	            parse: function (sJSON) {
	                return eval("(" + sJSON + ")");
	            },
	            stringify: function (str) {
	                var strLine = function (str) {
	                    return str.replace(/"/g, "\\$&").replace(/\n/g, "\\n");
	                }
	                if (str instanceof Object) {
	                    var sOutput = "";
	                    if (str.constructor === Array) {
	                        for (var nId = 0; nId < str.length; sOutput += this.stringify(str[nId]) + ",", nId++) {
	                        }
	                        return "[" + sOutput.substr(0, sOutput.length - 1) + "]";
	                    }
	                    if (str.toString !== Object.prototype.toString) {
	                        return "\"" + strLine(str.toString()) + "\"";
	                    }
	                    for (var sProp in str) {
	                        sOutput += "\"" + strLine(sProp) + "\":" + this.stringify(str[sProp]) + ",";
	                    }
	                    return "{" + sOutput.substr(0, sOutput.length - 1) + "}";
	                }
	                // console.log(typeof str);
	                if (typeof str === "unknown") {
	                    return "\"[unknown]\"";
	                }
	                if (typeof str === "string") {
	                    return "\"" + strLine(str) + "\"";
	                } else {
	                    try {
	                        //Fix [object]
	                        this.parse(String(str));

	                        return String(str);
	                    } catch (e) {
	                        if (!str.toString) {
	                            return "\"["+typeof(str)+"]\"";
	                        } else {
	                            return "\""+String(str)+"\"";
	                        }
	                    }
	                }
	            }
	        };
	    }

	    var extend = function () {
	        var a = arguments[0];
	        for (var i = 1, len = arguments.length; i < len; i++) {
	            var b = arguments[i];
	            for (var prop in b) {
	                a[prop] = b[prop];
	            }
	        }
	        return a;
	    };

	    var handlers = {
	        postMessage: function () {
	            var self = this,
	                dispatch = function (e) {
	                    var data = window.JSON.parse(e.data);

	                    if (data.type) {
	                        pm.trigger({
	                            data: data,
	                            origin: e.origin,
	                            source: e.source
	                        });
	                    }
	                };

	            this.send = function (target, data, origin) {
	                data = window.JSON.stringify(data);
	                target.postMessage(data, origin);
	            };

	            if (window.addEventListener) {
	                window.addEventListener("message", dispatch, false);
	            } else if (window.attachEvent) {
	                window.attachEvent("onmessage", dispatch);
	            }
	        },
	        opener: function () {
	            var self = this;
	            var curOrigin = window.location.protocol + '//' + window.location.host;
	            var postMessage = [];
	            var dispatch = function (params) {
	                //real document
	                try {
	                    if (params.source.window.document && params.source.window.document != document) {
	                        params.source.window.document.domain = 'unknownhost';
	                        console.warn('Error document, not real.');
	                    }
	                    return;
	                } catch (e) {
	                }

	                if (params.origin != '*' && params.origin.replace(/\//g, '') != curOrigin.replace(/\//g, '')) {
	                    return;
	                }

	                pm.trigger({
	                    data: window.JSON.parse(params.data),
	                    origin: params.source.origin,
	                    source: params.source.window
	                });
	            };

	            var c = setInterval(function () {
	                if (window.opener && window.opener.postMessage) {
	                    var pmData = window.opener.postMessage;
	                    for (var i = 0; i < pmData.length;) {
	                        if (pmData[i].target == window) {
	                            dispatch(pmData.splice(i, 1)[0]);
	                        } else i++;
	                    }
	                }
	            }, 100);

	            this.send = function (target, data, origin) {
	                postMessage.push({
	                    source: {
	                        window: window,
	                        origin: curOrigin
	                    },
	                    data: window.JSON.stringify(data),
	                    origin: origin,
	                    target: target
	                });
	                try {
	                    target.opener = {postMessage: postMessage};
	                } catch (e) {
	                    console.warn("Target not support \"opener.postMessage\";" + e.message);
	                }
	            };
	        },
	        hash: function () {
	            //todo hash hack
	        }
	    };

	    var handler = new handlers[window.postMessage ? 'postMessage' : 'opener']();

	    var events = {}, eventTick = 0;
	    var pm = {
	        handler: handler,
	        defaults: {
	            target: null, /* target window (required) */
	            type: null, /* message type (required) */
	            data: null, /* message data (required) */
	            callback: null, /* call callback (optional) */
	            complete: null, /* complete callback (optional) */
	            origin: "*"    /* postmessage origin (optional) */
	        },
	        send: function (argType, argTarget, argData, argOptions) {

	            var options = {};
	            if (typeof argType == 'object') {
	                options = argType;
	            } else {
	                options = extend({
	                    type: argType,
	                    target: argTarget,
	                    data: argData
	                }, argOptions);
	            }
	            var o = extend({}, pm.defaults, options),
	                target = o.target, id = ++eventTick;
	            if (!o.target || !o.type) {
	                throw new Error("Arguments [target,type] required");
	            }

	            o.callback && this.bind('postMessage.callback.' + id, function (e) {
	                if (e.source == o.target) {
	                    o.callback.apply(e, e.data);
	                }
	            }, true);
	            o.complete && this.bind('postMessage.complete.' + id, function (e) {
	                if (e.source == o.target) {
	                    o.complete.call(e, e.data);
	                }
	            }, true);

	            handler.send(target, {
	                data: o.data,
	                type: o.type,
	                callback: o.callback ? true : false,
	                complete: o.complete ? true : false,
	                id: id
	            }, o.origin || '*');
	            return id;
	        },

	        bind: function (type, fn, once) {
	            events[type] = events[type] || [];
	            events[type].push([function (msg) {
	                var data = msg.data,
	                    callback = function () {
	                        msg.callback && handler.send(msg.source, {
	                            data: Array.prototype.slice.call(arguments),
	                            type: 'postMessage.callback.' + msg.id
	                        }, msg.origin);
	                    },
	                    rs = fn.call(this, {
	                        data: data,
	                        source: msg.source,
	                        origin: msg.origin,
	                        callback: callback
	                    });

	                msg.complete && handler.send(msg.source, {
	                    data: rs,
	                    type: 'postMessage.complete.' + msg.id
	                }, msg.origin);
	            }, once]);
	        },
	        one: function (type, fn) {
	            this.bind(type, fn, true);
	        },
	        trigger: function (e) {
	            e.data.origin = e.origin;
	            e.data.source = e.source;
	            if (events[e.data.type]) {
	                for (var i = 0; i < events[e.data.type].length; i++) {
	                    events[e.data.type][i][0](e.data);
	                    if (events[e.data.type][i][1]) {
	                        events[e.data.type].splice(i, 1);
	                    }
	                }
	            }
	        }
	    };

	    return pm;
	});


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	var pm = __webpack_require__(2);
	var ajax = __webpack_require__(4);

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
	    console.log('verifyOrigin', verifyOrigin);
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

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	var urlSerialize = __webpack_require__(5);

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

/***/ }),
/* 5 */
/***/ (function(module, exports) {

	module.exports = function (params) {
	    var query = '';
	    if (typeof(params) == "string") {
	        query = params;
	    } else if (params instanceof window.Array) {
	        for (var i = 0; i < params.length; i++) {
	            query += '&' + encodeURIComponent(params[i].name) + '=' + encodeURIComponent(params[i].value)
	        }
	        query = query.substr(1);
	    } else if (typeof(params) == "object") {
	        for (var i in params) {
	            query += '&' + encodeURIComponent(i)+'='+encodeURIComponent(params[i]) ;
	        }
	        query = query.substr(1);
	    }
	    return query;
	};


/***/ })
/******/ ])
});
;
//# sourceMappingURL=demo-proxy.js.map