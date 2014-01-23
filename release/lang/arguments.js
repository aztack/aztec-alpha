/**
 * ---
 * description: Arguments Utils
 * namespace: $root.lang.arguments
 * imports:
 *   _fn: $root.lang.fn
 * exports:
 * - toArray
 * - varArg
 * files:
 * - /lang/arguments.js
 */

;define('$root.lang.arguments',['$root.lang.fn'],function(require, exports){
    //'use strict';
    var _fn = require('$root.lang.fn');
    
        ///vars
    var _slice = Array.prototype.slice;
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
    
                    //param type check
                    t = typeof pred;
                    if (t == 'string') {
                        if (typeof args[j] != pred) {
                            match = false;
                            break;
                        }
                    } else if (t === 'function') {
                        if (!pred(args[j])) {
                            match = false;
                            break;
                        }
                    }
                }
                if (match) {
                    return sig.fn.apply(null, args);
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
                return _fn.bind.apply(null, context, args);
            },
            bindNew: function(ctor) {
                return _fn.bindApplyNew(ctor, getArgs());
            },
            invoke: function(func) {
                return func.apply(context, getArgs());
            },
            invokeNew: function(ctor) {
                return _fn.applyNew(ctor, getArgs());
            }
        };
    }
    exports['toArray'] = toArray;
    exports['varArg'] = varArg;
    return exports;
});
//end of $root.lang.arguments
