var ajax = require('./ajax');
var CrossAjax = require('./cross-domain-ajax');

var cajax = new CrossAjax('http://127.0.0.2:8080/cross-proxy.html');
// ajax({
//     url: 'package.json',
//     success: function (data, req) {
//         console.log(data);
//         window.req = req;
//     },
//     error: function () {
//         console.log("error", arguments);
//     },
//     complete: function () {
//         // console.log(arguments);
//     }
// });
cajax.ready(function () {
    cajax.ajax({
        url: 'package.json',
        success: function (data, req) {
            console.log(data, req);
        },
        error: function () {
            console.log(arguments);
        },
        complete: function () {
            console.log(arguments);
        }
    });
});
window.cajax = cajax;

