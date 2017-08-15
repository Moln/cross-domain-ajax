
var cdp = require('./cross-domain-proxy');


cdp.onVerifyOrigin(function (origin) {
    var allowHost = [/\.ycgame.com$/, /localhost(:\d+)?$/, /127.0.0.\d+(:\d+)?$/];

    var isValid = false;
    for (var i = 0; i < allowHost.length; i++) {
        if (allowHost[i].test(origin)) {
            isValid = true;
        }
    }

    if (!isValid) {
        throw new Error('Invalid origin: ' + origin);
    }
});