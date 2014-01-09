// ({
//   description: "Function",
//   version: '0.0.1',
//   namespace: $root.lang.fn,
//   imports: {
//     _type: $root.lang.type,
//     _ary: $root.lang.array,
//     _enum: $root.lang.enumerable
// },
//   exports: [isFunction, Callbacks, bind, noop, increase, decrease]
// })

;define('$root.lang.fn',['$root.lang.type','$root.lang.array','$root.lang.enumerable'],function(require, exports){
    //'use strict';
    var _type = require('$root.lang.type'),_ary = require('$root.lang.array'),_enum = require('$root.lang.enumerable');
    
  ///exports

var isFunction = _type.isFunction;

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
 * bind
 * bind fn to context just like calling fn on context
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
 * A do-nothing-function
 * @return {Undefined}
 */
function noop() {}

function increase(x) {
    return x + 1;
}

function decrease(x) {
    return x - 1;
}

function forge0(old, replacement, ctx) {
    return function() {
        var ret = replacement.apply(null, arguments);
        return old.apply(ctx, ret);
    };
}

function forge$(old, replacement, ctx) {
    return function() {
        var ret = old.apply(ctx, arguments);
        return replacement.apply(ctx, arguments);
    };
}
  exports['isFunction'] = isFunction;
    exports['Callbacks'] = Callbacks;
    exports['bind'] = bind;
    exports['noop'] = noop;
    exports['increase'] = increase;
    exports['decrease'] = decrease;
    return exports;
});
//end of $root.lang.fn
