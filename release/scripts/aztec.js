/**
 * ---
 * description: The Aztec JavaScript framework
 * version: 0.0.1
 * namespace: $root
 * notransform: true
 * priority: 0
 * files:
 * - src/aztec.js
 */


(function(global) {

    if (typeof define === 'function' && define.amd) {
        return;
    }

    var G = global.$root = {};

    $root._createNS = function(namespace) {
        var i = 0,
            ns = G,
            parts = namespace.split('.'),
            len = parts.length,
            part = parts[0];

        for (; i < len; ++i) {
            part = parts[i];
            if (part == '$root') {
                part = G;
                continue;
            }
            if (typeof ns[part] == 'undefined') {
                ns[part] = {};
            }
            ns = ns[part];
        }
        return ns;
    };

}(this));