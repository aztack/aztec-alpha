({
    description: 'The Aztec JavaScript framework',
    version: '0.0.1',
    namespace: $root,
    notransform: true,
    priority: 0
});
(function(global) {

    if (typeof define === 'function' && define.amd) {
        return;
    }

    var G = global.$root = {};

    function createNS(namespace) {
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
    }

    function help() {
        var name, v;
        if (G.lang) {
            for (name in G.lang) {
                if (!G.lang.hasOwnProperty(name)) continue;
                console.log('%c$root.lang.' + name + ': ' + G.lang[name].__doc__,'color:green');
                console.dir(G.lang[name]);
            }
        }
        if (G.ui) {
            for (name in G.ui) {
                if (!G.ui.hasOwnProperty(name)) continue;
                console.log('%c$root.ui.' + name + ': ' + G.ui[name].__doc__,'color:green');
                console.dir(G.ui[name]);
            }
        }
    }

    if (Object.defineProperty) {
        Object.defineProperty(G, '_createNS', {
            enumerable: false,
            value: createNS
        });
        Object.defineProperty(G, '_help', {
            enumerable: false,
            value: help
        });
    } else {
        G._createNS = createNS;
        G._help = help;
    }

}(this));