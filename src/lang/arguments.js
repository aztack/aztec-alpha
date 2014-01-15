({
    description: 'Arguments Utils',
    namespace: $root.lang.arguments,
    exports: [
        toArray,
        varArg
    ]
});

///vars
var _slice = Array.prototype.slice;
///exports
function toArray(_arguments, n) {
    return _slice.call(_arguments, n || 0);
}

/**
 * varArg
 * handle variadic arguments
 * @param  {Arguments} args
 * @return {varArg}
 */
function varArg(args) {
    var signatures = [];
    return {
        when: function() {
            var types = toArray(arguments),
                fn = types.pop();
            signatures.push({
                fn: fn,
                types: types
            });
            return this;
        },
        asArgumentsOf: function(func) {
            var i = 0,
                j = 0,
                len1 = signatures.length,
                len2,
                sig,
                pred,
                match,
                ret;

            for (; i < len1; ++i) {
                sig = signatures[i];
                len2 = sig.types.length;
                match = true;
                for (; j < len2; ++j) {
                    if (len2 !== args.length) {
                        match = false;
                        break;
                    }
                    pred = sig.types[j];
                    if (typeof pred == 'string') {
                        if (typeof args[j] != pred) {
                            match = false;
                            break;
                        }
                    } else if (typeof pred === 'function') {
                        if (!pred(args[j])) {
                            match = false;
                            break;
                        }
                    }
                }
                if (match) {
                    ret = calculatedArgs = sig.fn.apply(null, args);
                    func.apply(null, ret);
                }
            }
        }
    };
}