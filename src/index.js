
var cdp = require('./cross-domain-proxy');

cdp.onVerifyOrigin(function (origin) {

    console.log(origin);
    if (!/localhost:8080$/.test(origin)) {
        throw new Error('Invalid origin ' + origin);
    }
});