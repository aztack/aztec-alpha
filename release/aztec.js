/**
 * ---
 * description: The Aztec JavaScript framework
 * version: 0.0.1
 * namespace: $root
 * files:
 * - ../src/aztec.js
 */

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
}(this));
