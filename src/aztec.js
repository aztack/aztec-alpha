({
    description: 'The Aztec JavaScript framework',
    version: '0.0.1',
    namespace: $root
});
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
                'namespace should contains only letters,numbers,underscores,dollar' +
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

    function require(namespace, fn) {
        var i = 0,
            cached,
            part,
            parts,
            len,
            ex,
            ns = G;

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
                    throw ex;
                }
            }
        }
        requrieCache[namespace] = ns;
        return ns;
    }

    function loadDependency(dependency, onLoaded) {
        onLoaded();
    }

    global.define = function(namespace, dependency, factory) {
        if (arguments.length == 2) {
            factory = arguments[1];
        } else if (arguments.length == 1) {
            factory = arguments[0];
        }
        loadDependency(dependency, function() {
            var ns = createNS(namespace, 'in `define`'),
                exported = factory(require, ns),
                parts, name, parent;

            //use factory returned object to
            //replace createNS created namespace object
            if (exported !== ns) {
                parts = namespace.split('.');
                name = parts.pop();
                parent = require(parts.join('.'));
                parent[name] = exported;
            }
            requrieCache[namespace] = exported;
        });
    };

    //create root namespace
    createNS('aztec');

    /**
     * browser.dom.ready, inspired by https://github.com/headjs/headjs
     */
    define('$root.browser.dom', [], function(require, exports) {
        var doc = document,
            win = global,
            domAlready = doc.readyState == 'complete',
            w3c = !! doc.addEventListener,
            ie = !w3c,
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
            global.addEventListener("load", onDomReady, false);
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

        var timer;

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

        exports.ready = function(fn, context) {
            context = context || global;
            if (theDomIsReady) {
                fn.call(context);
            } else {
                addWaiter(fn, context);
            }
        };
        return exports;
    });

}(this));