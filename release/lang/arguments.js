/**
 * ---
 * description: Arguments Utils
 * namespace: $root.lang.arguments
 * imports:
 *   _fn: $root.lang.fn
 *   _type: $root.lang.type
 * exports:
 * - toArray
 * - varArg
 * - registerPlugin
 * files:
 * - /lang/arguments.js
 * - /lang/arguments.ext.js
 */

;define('$root.lang.arguments',[
    '$root.lang.fn',
    '$root.lang.type'
], function (require, exports){
    //'use strict';
    var _fn = require('$root.lang.fn'),
        _type = require('$root.lang.type');
    
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
            "->": "function",
            "boolean": "boolean",
            "bool": "boolean",
            "object": "object",
            "plainObject": _type.isPlainObject,
            "primitive": _type.isPrimitive,
            "emptyObject": _type.isEmptyObject,
            "{}": _type.isEmptyObject,
            "regex": _type.isRegExp,
            "regexp": _type.isRegExp,
            "*": _fn.alwaysTrue
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
    
    function registerPlugin(name, pred) {
        if (arguments.length < 2) {
            throw Error('registerPlugin needs 2 parameters');
        } else if (typeof pred != 'function') {
            throw Error('registerPlugin needs 2nd parameter to be a function');
        }
        name = name.toString();
        varArgTypeMapping[name] = function() {
            return !!pred.apply(null, arguments);
        };
    }
    
    function check(pred, arg) {
        var t = varArgTypeMapping[pred],
            i,
            regexMatch, pattern;
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
                    pattern = regexMatch[1];
                    if (pattern == '*') return true;
                    for (i = 0; i < arg.length; ++i) {
                        if (!check(varArgTypeMapping[pattern], arg[i])) {
                            return false;
                        }
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
        var signatures = [],
            otherwise;
    
        function postprocess(ret) {
            if (ret) {
                if (typeof ret.length == 'undefined') {
                    return [ret];
                } else if (_type.isArray(ret)) {
                    return ret;
                } else {
                    return toArray(ret);
                }
            }
        }
    
        function getArgs() {
            var i = 0,
                j = 0,
                t, f,
                sigCount = signatures.length,
                paramCount,
                sig,
                pred,
                match,
                regexMatch,
                ret;
    
            //iterate over different signatures
            for (; i < sigCount; ++i) {
                sig = signatures[i];
                paramCount = sig.types.length;
                match = true;
                //iterate over every type of current signature
                for (;
                    (j === 0 && paramCount === 0) || j < paramCount; ++j) {
                    if (paramCount !== args.length) {
                        match = false;
                        break;
                    }
                    pred = sig.types[j];
                    if (pred == '*') {
                        //skip type checking if meet '*''
                        continue;
                    }
                    match = check(pred, args[j]);
                    if (!match) break;
                }
                if (match) {
                    ret = sig.fn.apply(context, args);
                    return postprocess(ret);
                }
            }
            if (typeof otherwise == 'function') {
                ret = otherwise.apply(context, args);
                return postprocess(ret);
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
            otherwise: function(fn) {
                otherwise = fn;
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
            },
            signatures: function() {
                var ret = [],
                    i, len = signatures.length;
                for (; i < len; ++i) {
                    ret.push(signatures.types);
                }
                return ret;
            }
        };
    }
    // /lang/arguments.ext.js
    /**
     * Arguments Module Extension
     */
    /* varArgTypeMapping must be exist */
    if (varArgTypeMapping) {
    
      var vat = varArgTypeMapping;
    
      vat.gt0 = function(n) {
        return _type.isNumber(n) && n > 0;
      };
    
      vat.lt0 = function(n) {
        return _type.isNumber(n) && n < 0;
      };
    
      vat.egt0 = function(n) {
        return _type.isNumber(n) && n >= 0;
      };
    
      vat.elt0 = function(n) {
        return _type.isNumber(n) && n <= 0;
      };
    
      vat.pattern = vat['string|regexp'] = vat['regexp|string'] = function(s) {
        return _type.isString(s) || _type.isRegExp(s);
      };
    
      vat.jquery = function(jq) {
        return jq instanceof jQuery;
      };
    
      vat.element = function(ele) {
        return ele && ele.nodeType === 1;
      };
    
      vat.htmlFragment = function (s) {
        return typeof s == 'string' && s.charAt(0) === '<' && s.charAt( s.length - 1 ) === '>' && s.length >= 3;
      };
    }
    
    exports['toArray'] = toArray;
    exports['varArg'] = varArg;
    exports['registerPlugin'] = registerPlugin;
    exports.__doc__ = "Arguments Utils";
    return exports;
});
//end of $root.lang.arguments
