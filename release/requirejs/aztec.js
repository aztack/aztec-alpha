/**
 * ---
 * description: The Aztec JavaScript framework
 * version: 0.0.1
 * namespace: $root
 * files:
 * - /aztec.js
 */

;define('aztec',[{}], function (){
    //'use strict';
    var exports = {};
    
    (function(global) {

    //quite if `define` already defined
    if (typeof define != 'undefined') {
        return;
    }

    var G = {},
        NAMESPAE_ROOT = 'aztec',
        requrieCache = {};

    //#include '$dependency'

    //validate given namespace, throw exception if not valid
    function validateNS(namespace, extraMsg) {
        if (!namespace || namespace.match(/[^_$.a-zA-Z0-9]/)) {
            throw 'Invalid Namespace: "' + namespace + '" ' + extraMsg + '!' +
                'namespace should contains only letters,numbers,underscores,dollar ' +
                'and sub-namespace is separated by dot.';
        }
        return true;
    }

    //create namespace from dot-separated namespace string
    function createNS(namespace, errormsg) {
        validateNS(namespace, errormsg);
        var i = 0,
            ns = G,
            parts = namespace.split('.'),
            len = parts.length,
            part = parts[0];

        for (; i < len; ++i) {
            part = parts[i];
            if (part == '$root') part = NAMESPAE_ROOT;
            if (typeof ns[part] == 'undefined') {
                ns = ns[part] = {};
            } else {
                ns = ns[part];
            }
        }
        return ns;
    }

    function require(namespace, fn, quiet) {
        var i = 0,
            cached,
            part,
            parts,
            len,
            ex,
            ns = G;
        if(namespace == '$root' || namespace == NAMESPAE_ROOT) {
            return G.aztec;
        }
        cached = requrieCache[namespace];
        if (cached) {
            return cached;
        }

        parts = namespace.split('.');
        len = parts.length;
        ex = namespace + ' is not defined!';

        if (len == 1 && namespace != '$root') {
            ns = global[namespace];
            if (typeof ns == 'undefined') {
                throw ex;
            }
        } else {
            for (; i < len; ++i) {
                part = parts[i];
                if (part == '$root') part = NAMESPAE_ROOT;
                ns = ns[part];
                if (typeof ns == 'undefined') {
                    if (quiet) return false;
                    throw ex;
                }
            }
        }
        requrieCache[namespace] = ns;
        return ns;
    }

    var load;

    function loadDependency(dependency, onLoaded) {
        var i = 0,
            len = dependency.length,
            notCached = [],
            ns, args;
        if (!load) {
            load = require('$root.browser.dom').load;
        }
        for (; i < len; ++i) {
            ns = dependency[i];
            if (!requrieCache[ns] && !require(ns, null, true)) {
                notCached.push(ns);
            }
        }
        if (notCached.length === 0) {
            onLoaded();
        } else {
            args = notCached.concat(onLoaded);
            load.apply(null, args);
        }
    }

    function cache(namespace, exported) {
        var parts, name, parent;
        //use factory returned object to
        //replace createNS created namespace object
        //if their are not the same one
        if (exported) {
            parts = namespace.split('.');
            name = parts.pop();
            if (parts.length > 0) {
                parent = require(parts.join('.'));
            } else {
                parent = G;
            }
            parent[name] = exported;
            requrieCache[namespace] = exported;
        }
    }

    global.define = function(namespace, dependency, factory) {
        var depends, f, len = arguments.length,
            ns, exported, config;
        if (len < 2 || len > 3) {
            return;
        } else if (len === 2) {
            depends = [];
            f = arguments[1];
        } else if (len === 3) {
            depends = dependency;
            f = factory;
        }
        config = G[NAMESPAE_ROOT].config;
        if (config && config.moduleDependency && config.moduleDependency[namespace]) {
            depends = config.moduleDependency[namespace];
            depends.shift();
        }
        if (depends.length === 0) {
            ns = createNS(namespace, 'in `define`');
            exported = f(require, ns);
            cache(namespace, exported);
        } else {
            loadDependency(depends, function() {
                ns = createNS(namespace, 'in `define`');
                exported = f(require, ns);
                cache(namespace, exported);
            });
        }
    };

    global.help = function(x) {
        var d = x.__doc__,
            t = typeof x.__doc__;
        if (t == 'undefined' || d === null) {
            console.log('%cno document found', 'color:red');
            return;
        } else if (t == 'function') {
            d = x.__doc__();
        } else if (d && d.length && d.join) {
            d = d.join('\n');
        }
        d = d.split('\n');
        console.log('%c%s', 'color:blue', d.shift());
        console.log('  %c%s', 'color:green', d.join('\n  '));
    };

    //create root namespace
    createNS(NAMESPAE_ROOT);
    //DEBUG
    global[NAMESPAE_ROOT] = G[NAMESPAE_ROOT];
    if (typeof console == 'undefined') {
        global.console = {
            log: function() {}
        };
    }
}(this));

/**
 * $root.browser.dom.load
 */
define('$root.browser.dom', function(require, exports) {
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

    exports.load = load;
    return exports;
});

/**
 * $root.browser.dom.ready
 * $root.browser.dom.isDomReady
 */
define('$root.browser.dom', function(require, exports) {
    var win = window,
        doc = win.document,
        domAlready = doc.readyState == 'complete',
        w3c = !! doc.addEventListener,
        ie = !w3c,
        timer,
        theDomIsReady = false,
        domReadyWaitter = [];

    /**
     * core algorithm, it's quit self-explanatory
     */
    if (domAlready) {
        /**
         * DOM already
         */
        onDomReady();
    } else if (w3c) {
        /**
         * W3C, the easiest way
         */
        doc.addEventListener("DOMContentLoaded", onDomContentLoad, false);

        // A fallback to window.onload, that will always work
        win.addEventListener("load", onDomReady, false);
    } else if (ie) {
        /**
         * IE, the tricky way
         */
        // Ensure firing before onload, maybe late but safe also for iframes
        doc.attachEvent("onreadystatechange", onDomContentLoad);
        win.attachEvent("onload", onDomReady);
        keepCheckUntilIEDomReady(onDomReady);
    }

    /**
     * remove event listener and then call `onDomReady`
     */
    function onDomContentLoad() {
        if (w3c) {
            doc.removeEventListener("DOMContentLoaded", onDomContentLoad, false);
        } else if (ie && doc.readyState === "complete") {
            doc.detachEvent("onreadystatechange", onDomContentLoad);
        }
        onDomReady();
    }

    /**
     * domready callback will be called in this function
     */
    function onDomReady() {
        // Make sure body exists, at least, in case IE gets a little overzealous (jQuery ticket #5443).
        if (!doc.body) {
            // let's not get nasty by setting a timeout too small.. (loop mania guaranteed if assets are queued)
            win.clearTimeout(timer);
            timer = win.setTimeout(onDomReady, 50);
            return;
        }
        //make sure only call once
        if (!theDomIsReady) {
            theDomIsReady = true;
            exports.isDomReady = true;
            var i = 0,
                len = domReadyWaitter.length,
                waiter;
            if (len === 0) return;
            for (; i < len; ++i) {
                waiter = domReadyWaitter[i];
                waiter.fn.call(waiter.context);
            }
        }
    }

    function keepCheckUntilIEDomReady(domReady) {
        var top = false;
        try {
            top = !win.frameElement && doc.documentElement;
        } catch (e) {}

        if (top && top.doScroll) {
            doScrollCheck();
        }

        function doScrollCheck() {
            if (!theDomIsReady) {
                try {
                    // Use the trick by Diego Perini
                    // http://javascript.nwbox.com/IEContentLoaded/
                    top.doScroll("left");
                } catch (e) {
                    win.clearTimeout(timer);
                    timer = win.setTimeout(doScrollCheck, 50);
                    return;
                }
                onDomReady();
            }
        }
    }

    function addWaiter(fn, context) {
        domReadyWaitter.push({
            context: context,
            fn: fn
        });
    }

    exports.isDomReady = false;
    exports.ready = function(fn, context) {
        context = context || win;
        if (theDomIsReady) {
            fn.call(context);
        } else {
            addWaiter(fn, context);
        }
    };
    return exports;
});
        
    ///sigils

    
    exports.__doc__ = "The Aztec JavaScript framework";
    return exports;
});
//end of $root