var pm = require('@moln/postmessage');

var CrossAjax = function (proxyUrl) {
    var self = this;
    var ifr = document.createElement('iframe');
    ifr.src = proxyUrl;
    ifr.style.display = 'none';
    document.body.appendChild(ifr);

    this.iframe = ifr;
    this._readyCalls = [];
    self._isReady = false;
    this.iframe.onload = function () {
        for (var i = 0; i < self._readyCalls.length; i++) {
            self._readyCalls[i].call(self);
        }

        self._isReady = true;
    };
};

CrossAjax.prototype.ready = function (cb) {
    if (this._isReady) {
        cb.call(self);
    } else {
        this._readyCalls.push(cb);
    }
};

CrossAjax.prototype.ajax = function (params) {
    var args = {};

    for (var i in params) {
        if (typeof params[i] != 'function') {
            args[i] = params[i];
        }
    }
    pm.send(
        'cross-ajax',
        this.iframe.contentWindow,
        args,
        {
            callback: function (result, req) {
                if (result == 'success' && params.success) {
                    params.success(req.responseJSON || req.responseText, req);
                } else if (result == 'error' && params.error) {
                    params.error(req);
                }
                if (params.complete) {
                    params.complete(req);
                }
            }
        }
    );
};

module.exports = CrossAjax;