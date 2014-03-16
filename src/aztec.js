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
            if (!requrieCache[ns]) {
                notCached.push(ns);
            }
        }
        if (notCached.length === 0) {
            onLoaded();
        } else {
            args = notCached.concat(onLoaded);
            load.call(null, args);
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
            ns, exported;
        if (len < 2 || len > 3) {
            return;
        } else if (len === 2) {
            depends = [];
            f = arguments[1];
        } else if (len === 3) {
            depends = dependency;
            f = factory;
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
            console.log('%cno document found','color:red');
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
    createNS('aztec');
    //DEBUG
    global.aztec = G.aztec;
    if (typeof console == 'undefined') {
        global.console = {
            log: function() {}
        };
    }
}(this));