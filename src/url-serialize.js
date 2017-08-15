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
