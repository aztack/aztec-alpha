/**
 * #Function#
 * ========
 * - Dependencies: 
 * - Version: 0.0.1
 */

(function(global, factory) {
    if (typeof define === 'function' && define.amd) {
        define('lang/fn', [], factory);
    } else if (typeof module == 'object') {
        module.exports = factory(exports, module, require);
    } else {
        var $root = global.$root,
            exports = $root._createNS('$root.lang.fn');
        factory(exports);
    }
}(this, function(exports) {
    'use strict';
    exports = exports || {};
    
    ///exports
    
    var _toString = Object.prototype.toString,
        _slice = Array.prototype.slice,
        isFunction = function(f) {
            return typeof f == 'function';
        },
        isArray = Array.isArray || function isArray(arg) {
            return _toString.call(arg) == '[object Array]';
        },
        firstArgMustBeFn = 'first argument must be a function';
    
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
    
    function return1st(a) {
        return a;
    }
    
    function return2nd(a, b) {
        return b;
    }
    
    function return3rd(a, b, c) {
        return c;
    }
    
    function return4th(a, b, c, d) {
        return d;
    }
    
    /**
     * bind
     * bind fn to context just like calling this fn on context
     * @param  {Function} fn function to be bind to the context
     * @param  {Any}   context this value
     * @return {Function}
     */
    function bind(self, context) {
        if (!isFunction(self)) {
            throw TypeError(firstArgMustBeFn);
        }
    
        var args = _slice.call(arguments, 2);
    
        return function() {
            var args2 = args;
            if (arguments.length > 0) {
                args2 = args.concat(_slice.call(arguments));
            }
            return self.apply(context, args2);
        };
    }
    
    /**
     * bindTimeout
     * @param  {Function} fn
     * @param  {Any}   context
     * @param  {Integer}   ms
     * @return {Function}
     */
    function bindTimeout(self, context, ms) {
        if (!isFunction(self)) {
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
                self.apply(context, args2);
            }, ms || 0);
        };
    }
    
    /**
     * if first parameter is a function, call it with second parameter as `this`
     * remaining parameters as arguments
     * @param  {Any} maybeFunc
     * @param  {Any} context
     * @return {Any}
     */
    function call(self, context) {
        if (!isFunction(self)) return;
        var args = _slice.call(arguments, 2);
        return self.apply(context, args);
    }
    
    function apply(self, context, args) {
        if (!isFunction(self)) return;
        //ie7 and 8 require 2nd argument for Function.prototype.apply must be a array or arguments
        args = _slice.call(args);
        return self.apply(context, args);
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
        if (!isFunction(ctor)) {
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
        if (!isArray(args)) {
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
    
    function log(fn) {
        if (typeof console !== 'undefined' && typeof console.log == 'function') {
            console.log(arguments);
        }
        fn.apply(this, arguments);
    }
    
    /**
     * ntimes
     * return a function which can be called n times
     * @param  {Integer}   n
     * @param  {Function} fn
     * @return {Function}
     */
    function ntimes(self, n) {
        var ret;
        return function() {
            if (n > 0) {
                ret = self.apply(null, arguments);
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
    function once(self) {
        return ntimes(1, self);
    }
    
    /**
     * delay
     * @param  {Function} fn
     * @param  {Integer}   ms
     * @param  {[type]} context [description]
     * @return {Function}
     */
    function delay(self, ms, context) {
        if (!isFunction(self)) {
            throw TypeError(firstArgMustBeFn);
        }
        var args = _slice.call(arguments, context ? 3 : 2),
            h = setTimeout(function() {
                clearTimeout(h);
                self.apply(context, args);
            }, ms);
    }
    
    /**
     * memoize
     * @param  {Function} self
     * @param  {Function} hashFn
     * @return {Function}
     */
    function memoize(self, hashFn) {
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
    
            ret = self.apply(null, arguments);
            cache[key] = ret;
            return ret;
        };
    }
    
    function wrap(self, wrapper) {
        if (isFunction(self)) {
            throw TypeError(firstArgMustBeFn);
        }
        return function() {
            return wrapper(self);
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
    
    function debounce(self, delay, context) {
        var timer = null;
        return function() {
            var args = Array.prototype.slice.call(arguments);
            clearTimeout(timer);
            timer = setTimeout(function() {
                clearTimeout(timer);
                timer = null;
                self.apply(context, args);
            }, delay);
        };
    }
    
    exports['noop'] = noop;
    exports['alwaysTrue'] = alwaysTrue;
    exports['alwaysFalse'] = alwaysFalse;
    exports['alwaysNull'] = alwaysNull;
    exports['alwaysUndefined'] = alwaysUndefined;
    exports['return1st'] = return1st;
    exports['return2nd'] = return2nd;
    exports['return3rd'] = return3rd;
    exports['return4th'] = return4th;
    exports['bind'] = bind;
    exports['bindTimeout'] = bindTimeout;
    exports['call'] = call;
    exports['apply'] = apply;
    exports['bindCallNew'] = bindCallNew;
    exports['bindApplyNew'] = bindApplyNew;
    exports['callNew'] = callNew;
    exports['applyNew'] = applyNew;
    exports['log'] = log;
    exports['ntimes'] = ntimes;
    exports['once'] = once;
    exports['delay'] = delay;
    exports['memoize'] = memoize;
    exports['wrap'] = wrap;
    exports['compose'] = compose;
    exports.__doc__ = "Function";
    exports.VERSION = '0.0.1';
    return exports;
}));
//end of $root.lang.fn
