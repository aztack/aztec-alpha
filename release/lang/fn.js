/**
 * ---
 * description: Function
 * version: 0.0.1
 * namespace: $root.lang.fn
 * imports:
 *   _type: $root.lang.type
 *   _ary: $root.lang.array
 *   _obj: $root.lang.object
 * exports:
 * - Callbacks
 * - noop
 * - bind
 * - call
 * - bindCallNew
 * - bindApplyNew
 * - callNew
 * - applyNew
 * - stop
 * - breakpoint
 * files:
 * - /lang/fn.js
 */

;define('$root.lang.fn',['$root.lang.type','$root.lang.array','$root.lang.object'],function(require, exports){
    //'use strict';
    var _type = require('$root.lang.type'),
        _ary = require('$root.lang.array'),
        _obj = require('$root.lang.object');
    
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
    
    function apply(fn, context, args) {
        if (!_type.isFunction(fn)) return;
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
            throw Error('first argument must be a function');
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
    
    function breakpoint() {
        debugger;
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
    exports['Callbacks'] = Callbacks;
    exports['noop'] = noop;
    exports['bind'] = bind;
    exports['call'] = call;
    exports['bindCallNew'] = bindCallNew;
    exports['bindApplyNew'] = bindApplyNew;
    exports['callNew'] = callNew;
    exports['applyNew'] = applyNew;
    exports['stop'] = stop;
    exports['breakpoint'] = breakpoint;
    return exports;
});
//end of $root.lang.fn
