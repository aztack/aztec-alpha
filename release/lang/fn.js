/**
 * ---
 * description: Function
 * version: 0.0.1
 * namespace: $root.lang.fn
 * imports:
 *   _type: $root.lang.type
 *   _obj: $root.lang.object
 * exports:
 * - Callbacks
 * - noop
 * - alwaysTrue
 * - alwaysFalse
 * - alwaysNull
 * - alwaysUndefined
 * - bind
 * - bindTimeout
 * - call
 * - apply
 * - bindCallNew
 * - bindApplyNew
 * - callNew
 * - applyNew
 * - breakpoint
 * - log
 * - stop
 * - ntimes
 * - once
 * - delay
 * - memoize
 * - wrap
 * - compose
 * files:
 * - /lang/fn.js
 */

;define('$root.lang.fn',[
    '$root.lang.type',
    '$root.lang.object'
], function (require, exports){
    //'use strict';
    var _type = require('$root.lang.type'),
        _obj = require('$root.lang.object');
    
        ///exports
    
    var isFunction = _type.isFunction,
        _slice = Array.prototype.slice,
        firstArgMustBeFn = 'first argument must be a function';
    
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
         * fireAll
         * fire all registered functions with given args on context
         * @param  {Any} context
         * @param  {Array} args
         * @return {Callbacks}
         */
        proto.fireAll = function(context, args) {
            var i = 0,
                fn,
                len = list.length;
            for (; i < len; ++i) {
                fn = list[i];
                fn.apply(context, args);
            }
            return this;
        };
    
        proto.fire = function(context, args) {
            var i = 0,
                fn,
                len = list.length;
            for (; i < len; ++i) {
                fn = list[i];
                if (fn.apply(context, args) === false) {
                    break;
                }
            }
            return this;
        };
    
        /**
         * remove
         * remove given callback from list or callback at given position
         * @return {Callbacks}
         */
        proto.remove = function(callbackOrIndex) {
            var index;
            if (_type.isFunction(callbackOrIndex)) {
                index = list.indexOf(callbackOrIndex);
            } else if (_type.isInteger(callbackOrIndex)) {
                index = callbackOrIndex;
            }
            list.splice(index, 1);
            return this;
        };
    
        proto.get = function(index) {
            return list[index];
        };
        return proto;
    }
    
    /**
     * A do-nothing-function
     * @return {Undefined}
     */
    function noop() {}
    
    function alwaysTrue() {
        return true;
    }
    
    function alwaysFalse() {
        return false;
    }
    
    function alwaysNull() {
        return null;
    }
    
    function alwaysUndefined() {
        return;
    }
    
    /**
     * bind
     * bind fn to context just like calling this fn on context
     * @param  {Function} fn function to be bind to the context
     * @param  {Any}   context this value
     * @return {Function}
     */
    function bind(fn, context) {
        if (!isFunction(fn)) {
            throw TypeError(firstArgMustBeFn);
        }
    
        var args = _slice.call(arguments, 2);
    
        return function() {
            var args2 = args;
            if (arguments.length > 0) {
                args2 = args.concat(_slice.call(arguments));
            }
            return fn.apply(context, args2);
        };
    }
    
    /**
     * bindTimeout
     * @param  {Function} fn
     * @param  {Any}   context
     * @param  {Integer}   ms
     * @return {Function}
     */
    function bindTimeout(fn, context, ms) {
        if (!isFunction(fn)) {
            throw TypeError(firstArgMustBeFn);
        }
    
        var args = _slice.call(arguments, 3);
    
        return function() {
            var args2 = args;
            if (arguments.length > 0) {
                args2 = args.concat(_slice.call(arguments));
            }
    
            var handle = setTimeout(function() {
                clearTimeout(handle);
                fn.apply(context, args2);
            }, ms);
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
    
    function apply(fn, context, args) {
        if (!_type.isFunction(fn)) return;
        //ie7 and 8 require 2nd argument for Function.prototype.apply must be a array or arguments
        args = _slice.call(args);
        return fn.apply(context, args);
    }
    
    
    /**
     * bindCallNew
     * bind parameters to a constructor
     * @param  {Function} ctor, constructor
     * @return {Function} a function expecting 0 paramter, returning an instance create with ctor
     */
    function bindCallNew() {
        var ctor, args;
        ctor = arguments[0];
        if (!_type.isFunction(ctor)) {
            throw Error(firstArgMustBeFn);
        }
        args = arguments;
        if (args.length > 8) {
            throw Error("second argument.length must less than 8, you provide " + args.len);
        }
        return function() {
            return callNew.apply(null, args);
        };
    }
    
    /**
     * bindApplyNew
     * @param  {Function} ctor
     * @param  {Array} args
     * @return {Function}}
     */
    function bindApplyNew(ctor, args) {
        var len;
        if (!_type.isArray(args)) {
            throw Error('Arguments list has wrong type: second argument must be an array');
        }
        if (args.length > 7) {
            throw Error("second argument.length must less than 8, you provide " + args.len);
        }
        return function() {
            return applyNew(ctor, args, 'bindApplyNew');
        };
    }
    
    /**
     * callNew
     * call `new constructor` with given parameters
     * @param  {Function} ctor, constructor
     * @return {Function} an instance create with ctor and given parameters
     */
    function callNew(ctor) {
        var argLen = arguments.length,
            args;
        if (argLen === 1) {
            args = [];
        } else if (argLen > 1) {
            args = _slice.call(arguments, 1);
        } else if (arglen === 0) {
            throw Error('`callNew` needs at least 1 parameter');
        } else if (argLen > 7) {
            throw Error("`callNew` supports up to 7 args, you provide " + args.len);
        }
        return applyNew(ctor, args);
    }
    
    /**
     * applyNew
     * @param  {Function} ctor
     * @param  {Array} args
     * @return {object}
     */
    function applyNew(ctor, args) {
        var len = args.length;
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
        }
    }
    
    function breakpoint(fn) {
        debugger;
        return fn.apply(this, arguments);
    }
    
    function log(fn) {
        if (typeof console !== 'undefined' && typeof console.log == 'function') {
            console.log(arguments);
        }
        fn.apply(this, arguments);
    }
    
    /**
     * stop
     * stop at a method call of context by insert a `debugger` statement before
     * @param  {String} path, path of a method
     * @param  {Object} context
     * @param  {Function} sniffer
     * @return {Object} context
     * @remark
     *     var obj = {fn:{do:function(){}}};
     *     stop('fn.do', obj, function(){
     *         console.log(arguments);
     *     });
     *     //will print out arguments everytime when `obj.fn.do` is called
     *     stop('fn.do', obj)
     *     //will stop before `obj.fn.do` is called(only if debug console is openning)
     */
    function stop(path, context, sniffer) {
        if (_type.isEmpty(context)) {
            throw Error('second argument must provide');
        }
    
        var origin = _obj.tryget(context, path);
        if (!_type.isFunction(origin)) {
            throw Error(path + ' is not a function');
        }
    
        _obj.tryset(context, path, function() {
            (sniffer || breakpoint).apply(context, arguments);
            origin.apply(context, arguments);
        });
        return context;
    }
    
    /**
     * ntimes
     * return a function which can be called n times
     * @param  {Integer}   n
     * @param  {Function} fn
     * @return {Function}
     */
    function ntimes(fn, n) {
        var ret;
        return function() {
            if (n > 0) {
                ret = fn.apply(null, arguments);
                n--;
                return ret;
            } else return ret;
        };
    }
    
    /**
     * once
     * return a function which can be called only once
     * @param  {Function} fn
     * @return {Function}
     */
    function once(fn) {
        return ntimes(1, fn);
    }
    
    /**
     * delay
     * @param  {Function} fn
     * @param  {Integer}   ms
     * @return {Function}
     */
    function delay(fn, ms) {
        if (!isFunction(fn)) {
            throw TypeError(firstArgMustBeFn);
        }
        var args = _slice.call(arguments, 2),
            h = setTimeout(function() {
                clearTimeout(h);
                fn.apply(null, args);
            }, ms);
    }
    
    /**
     * memoize
     * @param  {Function} fn
     * @param  {Function} hashFn
     * @return {Function}
     */
    function memoize(fn, hashFn) {
        var cache = {};
        return function() {
            var key = arguments[0],
                ret;
            if (isFunction(hashFn)) {
                key = hashFn.apply(null, arguments);
            }
            if (key in cache) {
                return cache[key];
            }
    
            ret = fn.apply(null, arguments);
            cache[key] = ret;
            return ret;
        };
    }
    
    function wrap(fn, wrapper) {
        if (isFunction(fn)) {
            throw TypeError(firstArgMustBeFn);
        }
        return function() {
            return wrapper(fn);
        };
    }
    
    function compose() {
        var args = _slice.call(arguments);
        return function() {
            var i = 0,
                len = args.length,
                fn,
                ret = arguments;
            for (; i < len; ++i) {
                fn = args[i];
                if (typeof fn != 'function') continue;
                ret = fn.apply(null, ret);
            }
            return ret;
        };
    }
    
    function debounce(fn, delay, context) {
        var timer = null;
        return function() {
            var args = Array.prototype.slice.call(arguments);
            clearTimeout(timer);
            timer = setTimeout(function() {
                clearTimeout(timer);
                timer = null;
                fn.apply(context, args);
            }, delay);
        };
    }
    
    exports['Callbacks'] = Callbacks;
    exports['noop'] = noop;
    exports['alwaysTrue'] = alwaysTrue;
    exports['alwaysFalse'] = alwaysFalse;
    exports['alwaysNull'] = alwaysNull;
    exports['alwaysUndefined'] = alwaysUndefined;
    exports['bind'] = bind;
    exports['bindTimeout'] = bindTimeout;
    exports['call'] = call;
    exports['apply'] = apply;
    exports['bindCallNew'] = bindCallNew;
    exports['bindApplyNew'] = bindApplyNew;
    exports['callNew'] = callNew;
    exports['applyNew'] = applyNew;
    exports['breakpoint'] = breakpoint;
    exports['log'] = log;
    exports['stop'] = stop;
    exports['ntimes'] = ntimes;
    exports['once'] = once;
    exports['delay'] = delay;
    exports['memoize'] = memoize;
    exports['wrap'] = wrap;
    exports['compose'] = compose;
    return exports;
});
//end of $root.lang.fn
