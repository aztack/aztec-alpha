/**
 * ---
 * description: Function
 * version: 0.0.1
 * namespace: $root.lang.fn
 * imports:
 *   _type: $root.lang.type
 *   _ary: $root.lang.array
 *   _enum: $root.lang.enumerable
 * exports:
 * - Callbacks
 * - bind
 * - bindNew
 * - noop
 * - increase
 * - decrease
 * - call
 * files:
 * - /lang/fn.js
 */

;define('$root.lang.fn',['$root.lang.type','$root.lang.array','$root.lang.enumerable'],function(require, exports){
    //'use strict';
    var _type = require('$root.lang.type'),
        _ary = require('$root.lang.array'),
        _enum = require('$root.lang.enumerable');
    
        ///exports
    
    var isFunction = _type.isFunction,
        _slice = Array.prototype.slice;
    
    /**
     * Callbacks
     */
    function Callbacks() {
        var list = [],
            proto = {};
    
        /**
         * Callback#add
         */
        proto.add = function() {
            var i = 0,
                fn,
                len = arguments.length;
            for (; i < len; ++i) {
                fn = arguments[i];
                if (_type.isFunction(fn)) {
                    list.push(fn);
                }
            }
            return this;
        };
    
        /**
         * fire
         * fire all registered functions with given args on context
         * @param  {Any} context
         * @param  {Array} args
         * @return {Callbacks}
         */
        proto.fire = function(context, args) {
            var i = 0,
                fn,
                len = list.length;
            for (; i < len; ++i) {
                fn = list[i];
                fn.apply(context, args);
            }
            return this;
        };
    
        /**
         * remove
         * remove given callback functions from list
         * @return {Callbacks}
         */
        proto.remove = function() {
            var i = 0,
                pos, fn,
                len = arguments.length;
            for (; i < len; ++i) {
                fn = arguments[i];
                if (!_type.isFunction(fn)) return this;
                pos = list.indexOf(fn);
                if (pos >= 0) {
                    list.splice(pos, 1);
                }
            }
            return this;
        };
        return proto;
    }
    
    /**
     * A do-nothing-function
     * @return {Undefined}
     */
    function noop() {}
    
    /**
     * bind
     * bind fn to context just like calling this fn on context
     * @param  {Function} fn function to be bind to the context
     * @param  {Any}   context this value
     * @return {Function}
     */
    function bind(fn, context) {
        if (!isFunction(fn)) {
            throw TypeError("first argument must be a function");
        }
    
        var len = 1 + (arguments.length >= 2),
            args = _ary.toArray(arguments, len);
    
        return function() {
            var args2 = args.concat(_ary.toArray(arguments));
            fn.call(context, args2);
        };
    }
    
    /**
     * if first parameter is a function, call it with second parameter as `this`
     * remaining parameters as arguments
     * @param  {Any} maybeFunc
     * @param  {Any} context
     * @return {Any}
     */
    function call(fn, context) {
        if (!_type.isFunction(fn)) return;
        var args = _slice.call(arguments, 2);
        return fn.apply(context, args);
    }
    
    function checkVarCtorArguments(args) {
        var argLen = args.length;
        if (argLen === 2) {
            args = _type.isArray(args[1]) ? args[1] : [args];
        } else if (argLen === 1) {
            args = [];
        } else if (argLen > 2) {
            args = Array.prototype.slice.call(args, 1);
        } else {
            throw Error('`varCtor` needs at least 1 parameter');
        }
        return args;
    }
    
    function bindNew(ctor) {
        var args = checkVarCtorArguments(arguments),
            len = args.length;
    
        switch (len) {
            case 0:
                return function() {
                    return new ctor();
                };
            case 1:
                return function() {
                    return new ctor(args[0]);
                };
            case 2:
                return function() {
                    return new ctor(args[0], args[1]);
                };
            case 3:
                return function() {
                    return new ctor(args[0], args[1], args[2]);
                };
            case 4:
                return function() {
                    return new ctor(args[0], args[1], args[2], args[3]);
                };
            case 5:
                return function() {
                    return new ctor(args[0], args[1], args[2], args[3], args[4]);
                };
            case 6:
                return function() {
                    return new ctor(args[0], args[1], args[2], args[3], args[4], args[5]);
                };
            case 7:
                return function() {
                    return new ctor(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
                };
            default:
                throw Error("`varCtor` supports up to 7 args, you provide " + len);
        }
    }
    
    function callNew(ctor) {
        var args = checkVarCtorArguments(arguments),
            len = args.length;
    
        switch (len) {
            case 0:
                return new ctor();
            case 1:
                return new ctor(args[0]);
            case 2:
                return new ctor(args[0], args[1]);
            case 3:
                return new ctor(args[0], args[1], args[2]);
            case 4:
                return new ctor(args[0], args[1], args[2], args[3]);
            case 5:
                return new ctor(args[0], args[1], args[2], args[3], args[4]);
            case 6:
                return new ctor(args[0], args[1], args[2], args[3], args[4], args[5]);
            case 7:
                return new ctor(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
            default:
                throw Error("`varCtor` supports up to 7 args, you provide " + len);
        }
    }
    exports['Callbacks'] = Callbacks;
    exports['bind'] = bind;
    exports['bindNew'] = bindNew;
    exports['noop'] = noop;
//     exports['increase'] = increase;
//     exports['decrease'] = decrease;
    exports['call'] = call;
    return exports;
});
//end of $root.lang.fn
