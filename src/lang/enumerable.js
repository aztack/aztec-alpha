({
    description: "Enumerable Interface",
    version: '0.0.1',
    namespace: $root.lang.enumerable,
    imports: {
        _type: $root.lang.type,
        _ary: $root.lang.array
    },
    exports: [
        each,
        inject,
        all,
        some,
        find,
        findAll,
        map,
        compact,
        pluck,
        parallel
    ]
});

var _slice = Array.prototype.slice;

function _array_each(ary, fn, thisValue, stopWhenFnReturnFalse) {
    var i = 0,
        len = ary.length,
        ret;
    if (typeof stopWhenFnReturnFalse == 'undefined') {
        stopWhenFnReturnFalse = false;
    }
    for (; i < len; ++i) {
        ret = fn.call(thisValue, ary[i], i, i, ary);
        if (ret === false && stopWhenFnReturnFalse) break;
    }
    return ary;
}

function _object_each(obj, fn, thisValue, stopWhenFnReturnFalse) {
    var key, ret, i = 0;

    if (!_type.isFunction(fn)) return obj;

    if (typeof stopWhenFnReturnFalse == 'undefined') {
        stopWhenFnReturnFalse = false;
    }

    for (key in obj) {
        ret = fn.call(thisValue, obj[key], key, i++, obj);
        if (ret === false && stopWhenFnReturnFalse) break;
    }
    return obj;
}

/**
 * ##enum.each(obj)##
 * iterate over an array or object
 * @param  {Array|Object}   obj
 * @param  {Function} fn
 * @param  {Any}   thisValue
 * @param  {Boolean}   stop when fn return false
 * @return {object} return array or object being iterated
 *
 * ```javascript
 * var week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
 * enum.each(week,function(xxxday, key, index, ary){
 *     // key === index
 *     //...
 * })
 * enum.each({name:'mike',age:28},function(value, key, index, mike){
 *     // key is 'name','age' while index is 0, 1
 *     // mike is the object being iterated
 *     //...
 * },null, true);
 * ```
 */
function each(obj) {
    return _type.isArrayLike(obj) ? _array_each.apply(null, arguments) : _object_each.apply(null, arguments);
}


/**
 * ##enum.inject(obj, init, fn)##
 * @param  {Any} obj
 * @param  {Any} init, initial value
 * @param  {Function} fn
 * @return {Any}
 *
 * ```javascript
 * enum.inject([1,2,3,4,5,6,7,8,9,10],0,function(sum, item){
 *     sum += item;
 *     return sum;
 * });
 * => 55
 * ```
 */
function inject(obj, init, fn) {
    if (_type.isEmpty(obj)) return init;
    each(obj, function(v, k, i) {
        init = fn(init, v, k, i);
    });
    return init;
}

/**
 * ##enum.some(obj,fn)##
 * return true if one or more item in obj pass fn test(fn return true)
 * @param  {Array}   obj
 * @param  {Function} fn
 * @return {Boolean}
 */
function some(obj, fn) {
    var ret = false;
    each(obj, function(v, k, i) {
        if (fn.call(obj, v, k, i) === true) {
            ret = true;
            return false;
        }
    }, obj, true);
    return ret;
}

/**
 * ##enum.all(obj,fn)##
 * return true if all obj pass fn test(fn return true)
 * @param  {Array}   obj [description]
 * @param  {Function} fn   [description]
 * @return {Boolean}
 */
function all(obj, fn) {
    var ret = true;
    each(obj, function(v, k, i) {
        if (fn.call(obj, v, k, i) === false) {
            ret = false;
            return false;
        }
    }, obj, true);
    return ret;
}

/**
 * ##enum.find(obj,fn,returnValueOnly)##
 * return first which pass fn test(fn return true)
 * @param  {Array}   obj
 * @param  {Function} fn
 * @param  {Boolean} return value only
 * @return {Object} {key,value,index}|value
 */
function find(obj, fn, returnValueOnly) {
    returnValueOnly = typeof returnValueOnly == 'undefined' ? true : false;
    var ret = returnValueOnly ? null : {};
    each(obj, function(v, k, i) {
        if (fn.call(obj, v, k, i) === true) {
            if (returnValueOnly) {
                ret = v;
            } else {
                ret.key = k;
                ret.value = v;
                ret.index = i;
            }
            return false;
        }
    }, obj, true);
    return ret;
}

/**
 * ##enum.findAll(obj,fn,returnValueOnly)##
 * return array of item which pass fn test(fn return true)
 * @param  {Array}   obj
 * @param  {Function} fn
 * @param  {Boolean} return value only
 * @return {Array} {key,value,index}|value
 */
function findAll(obj, fn, returnValueOnly) {
    returnValueOnly = typeof returnValueOnly == 'undefined' ? true : false;
    var ret = [];
    each(obj, function(v, k, i) {
        if (fn.call(obj, v, k, i) === true) {
            if (returnValueOnly) {
                ret.push(v);
            } else {
                ret.push({
                    key: k,
                    value: v,
                    index: i
                });
            }
        }
    }, obj, true);
    return ret;
}

/**
 * ##enum.map(obj,fn,context)##
 * @param  {Array|Object}   obj
 * @param  {Function} fn
 * @param  {Any}   context
 * @return {Array|Object}
 */
function map(obj, fn, context) {
    var ret;
    if (_type.isArrayLike(obj)) {
        ret = [];
        _array_each(obj, function(v, k, i) {
            ret.push(fn.call(context, v, k, i));
        });
    } else {
        ret = [];
        _object_each(obj, function(v, k, i) {
            ret[i] = fn.call(context, v, k, i);
        });
    }
    return ret;
}

/**
 * ##enum.pluck(obj,key,doNotReturn)##
 * @param  {Array|Object} obj
 * @param  {String} key
 * @param  {Boolean} do not return anything,
 * @return {Object|Undefined} object|undefined
 */
function pluck(obj, key, doNotReturn) {
    var f;
    if (typeof doNotReturn == 'undefined') {
        doNotReturn = false;
    }
    if (key[0] == '&') {
        key = key.substring(1);
        f = function(e) {
            return e[key] ? e[key].call(e) : undefined;
        };
    } else {
        f = function(e) {
            return e[key];
        };
    }
    if (doNotReturn) {
        if (_type.isArrayLike(obj)) {
            _array_each(obj, function(v, k, i) {
                f.call(null, v, k, i);
            });
        } else {
            _object_each(obj, function(v, k, i) {
                f.call(null, v, k, i);
            });
        }
    } else {
        return map(obj, f);
    }
}


/**
 * ##enum.compact(obj)##
 * remove null/undfined item in array or object.
 * different from `array.compact` which also remove empty string and empty array recursively
 * @param  {Array|Object} obj
 * @return {Array|Object} array|object
 */
function compact(obj) {
    var ret;
    if (_type.isArrayLike(obj)) {
        ret = [];
        _array_each(obj, function(v, k, i) {
            if (v === null || typeof v == 'undefined') return;
            ret.push(v);
        });
    } else {
        ret = {};
        _object_each(obj, function(v, k, i) {
            if (v === null || typeof v == 'undefined') return;
            ret[k] = v;
        });
    }
    return ret;
}

/**
 * ##enum.parallel(ary1,ary2[,...,short])###
 * iterate 2 or more array at the same time
 * @param {Array} ary1
 * @param {Array} ary2
 * @param {Boolean} short, if true use shortest array length as iteration upper bounds
 * @return {Undefined} undefined
 *
 * ```javascript
 *  parallel([1,2,3],['a','b'],['A','B'],function(){console.log(arguments)},true);
 *  =>  1 a A 0
 *      2 b B 1
 * ```
 */
function parallel() {
    var len = arguments.length;
    if (len === 0) {
        return;
    } else if (len == 1) {
        return arguments[0];
    }
    var args = _slice.call(arguments),
        upbounds = Math.max,
        up, lengths, i = 0,
        j, fn, items, ret;
    if (args[args.length - 1] === true) {
        upbounds = Math.min;
        args.pop();
    }
    if (typeof args[args.length - 1] == 'function') {
        fn = args.pop();
        ret = [];
    }
    if (args.length === 2) {
        up = upbounds(args[0].length, args[1].length);
        for (; i < up; ++i) {
            if (fn) {
                fn.call(null, args[0][i], args[1][i], i);
            } else {
                ret.push([args[0][i], args[1][i]]);
            }
        }
    } else {
        lengths = pluck(args, 'length');
        up = upbounds.apply(null, lengths);
        for (; i < up; ++i) {
            items = [];
            for (j = 0; j < args.length; ++j) {
                items.push(args[j][i]);
            }
            items.push(i);
            if(fn) {
                fn.apply(null, items);
            } else {
                ret.push(items);
            }
        }
    }
}