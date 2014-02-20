({
    description: 'Arguments Utils',
    namespace: $root.lang.arguments,
    imports: {
        _fn: $root.lang.fn,
        _type: $root.lang.type
    },
    exports: [
        toArray,
        varArg
    ]
});

///vars
var _slice = Array.prototype.slice,
    varArgTypeMapping = {
        "string": "string",
        "undefined": "undefined",
        "null": _type.isNull,
        "array": _type.isArray,
        "nullOrUndefined": _type.isNullOrUndefined,
        "empty": _type.isEmpty,
        "number": "number",
        "int": _type.isInteger,
        "integer": _type.isInteger,
        "function": "function",
        "boolean": "boolean",
        "object": "object",
        "plainObject": _type.isPlainObject,
        "primitive": _type.isPrimitive,
        "regexp": _type.isRegExp,
        "emptyObject": _type.isEmptyObject,
        "regex": _type.isRegExp
    };
///exports

/**
 * toArray
 * convert `arguments` into an array
 * @param  {Arguments} args
 * @param  {Integer} n
 * @return {Array}
 */
function toArray(args, n) {
    return _slice.call(args, n || 0);
}

function check(pred, arg) {
    var t = varArgTypeMapping[pred],
        regexMatch;
    if (typeof t == 'string') {
        if (typeof arg != t) {
            return false;
        }
    } else if (typeof pred == 'function') {
        if (!pred(arg)) {
            return false;
        }
    } else if (typeof t == 'function') {
        if (!t(arg)) {
            return false;
        }
    } else {
        regexMatch = pred.match(/array<(.*?)>/);
        if (regexMatch) {
            if (arg.length > 0) {
                if (!check(varArgTypeMapping[regexMatch[1]], arg[0])) {
                    return false;
                }
            }
        } else {
            throw Error('unsupported type:' + pred + ' in function varArg');
        }
    }
    return true;
}
/**
 * varArg
 * handle variadic arguments
 * @param  {Arguments} args
 * @return {varArg}
 * @remark
 *     function fn_with_variadic_args() {
 *         return varArg(arguments)
 *             .when(function(){
 *                 //no params
 *                 return ['',0];
 *             })
 *             .when('string',_type.isNumber,function(s,i){
 *                 //first param is a string and second param is a number
 *                 return [s,i];
 *             })
 *             .when('*','*',function(a,b){
 *                 //two params which is not string and number at the same time
 *                 return [String(a), Number(b)]
 *             })
 *             .invokeNew(Person);
 *     }
 */
function varArg(args, context) {
    var signatures = [];

    function getArgs() {
        var i = 0,
            j = 0,
            t,
            len1 = signatures.length,
            len2,
            sig,
            pred,
            match,
            regexMatch,
            ret;

        for (; i < len1; ++i) {
            sig = signatures[i];
            len2 = sig.types.length;
            match = true;
            for (; j <= len2; ++j) {
                if (len2 !== args.length) {
                    match = false;
                    break;
                }
                pred = sig.types[j];
                if (pred == '*') {
                    continue;
                }
                match = check(pred, args[j]);
                if (!match) break;
            }
            if (match) {
                ret = sig.fn.apply(context, args);
                if(ret) {
                    if(typeof ret.length == 'undefined'){
                        return [ret];
                    } else {
                        return toArray(ret);
                    }
                }
                return ret;
            }
        }
        return [];
    }
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
        bind: function(func) {
            var args = getArgs();
            return typeof func == 'undefined' ? _fn.noop : function() {
                return _fn.apply(func, context, args);
            };
        },
        bindNew: function(ctor) {
            return _fn.bindApplyNew(ctor, getArgs());
        },
        invoke: function(func) {
            return func.apply(context, getArgs());
        },
        invokeNew: function(ctor) {
            return _fn.applyNew(ctor, getArgs());
        },
        args: function() {
            return getArgs();
        },
        resolve: function() {
            getArgs();
        }
    };
}