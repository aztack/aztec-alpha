({
    description: 'Load',
    version: '0.0.1',
    namespace: $root,
    priority: 1,
    deprecated: true
});
(function(){
    var win = window,
        doc = win.document,
        dummyScript = doc.createElement('script'),
        supportAsync = 'async' in dummyScript,
        supportReadyState = 'readyState' in dummyScript,
        config = require('$root').config,
        moduleUrls = null;
    if (config && config.moduleUrls) {
        moduleUrls = config.moduleUrls;
    }

    function loadScript(src, opts) {
        var node = doc.createElement('script'),
            loaded = false,
            head = doc.head || doc.getElementsByTagName('head')[0];
        opts = opts || {};
        if (moduleUrls !== null) {
            src = moduleUrls[src] || moduleUrls[src.replace('.js', '')] || src;
        }

        node.type = 'text/' + (opts.type || 'javascript');
        node.charset = opts.charset || 'utf-8';
        node.onload = node.onreadystatechange = function() {
            if (!loaded && (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) {
                loaded = true;
                node.onload = node.onreadystatechange = null;
                console.log(src + ' loaded');
                if (typeof opts.callback == 'function') {
                    opts.callback.call(node);
                }
                if (opts.removeAfterLoaded && head && node.parentNode) {
                    head.removeChild(node);
                }
            }
        };

        if (supportAsync) {
            //async=false: parellel downloading, execute in order, non-blocking
            node.async = false;
            node.src = src;
        } else if (supportReadyState) {
            node.src = src;
        } else {
            //defer=true: parellel downloading, execute in order, after dom ready
            node.defer = true;
            node.src = src;
        }
        head.insertBefore(node, head.lastChild);
    }

    function load() {
        var i = 0,
            args = Array.prototype.slice.call(arguments),
            len = args.length,
            callback,
            config,
            src;

        if (moduleUrls === null) {
            config = require('$root').config;
            if (config && config.moduleUrls) {
                moduleUrls = config.moduleUrls;
            }
        }
        if (typeof args[len - 1] == 'function') {
            callback = args.pop();
            len = args.length;
        }
        if (len > 1) {
            for (; i < len; ++i) {
                src = '' + args[i];
                loadScript(src, {
                    callback: i !== len - 1 ? null : callback
                });
            }
        } else if (len == 1) {
            if (args[0].splice) {
                load.apply(exports, args[0]);
            } else if (typeof args[0] == 'string') {
                loadScript(args[0], {
                    callback: callback
                });
            } else {
                throw Error('the only parameter is not an Array');
            }
        } else {
            throw Error('wrong argument list');
        }
    }
})();