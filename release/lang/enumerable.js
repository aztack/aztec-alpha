/**
 * ---
 * description: Enumerable Interface
 * version: 0.0.1
 * namespace: $root.lang.enumerable
 * imports:
 *   _type: $root.lang.type
 *   _ary: $root.lang.array
 * exports:
 * - each
 * - inject
 * - all
 * - some
 * - find
 * - findAll
 * - map
 * - compact
 * - pluck
 * files:
 * - /lang/enumerable.js
 */

;define('$root.lang.enumerable',[
    '$root.lang.type',
    '$root.lang.array'
], function (require, exports){
    //'use strict';
    var _type = require('$root.lang.type'),
        _ary = require('$root.lang.array');
    
        var _slice = Array.prototype.slice;
    
    ///helper
    
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
    
    /// exports
    
    /**
     * each
     * iterate over an array or object
     * @return {object} return array or object being iterated
     */
    function each(obj) {
        return _type.isArray(obj) ? _array_each.apply(null, arguments) : _object_each.apply(null, arguments);
    }
    
    /**
     * Inject
     * @param  {Any} obj
     * @param  {Any} init
     * @param  {Function} fn
     * @return {Any}
     */
    function inject(obj, init, fn) {
        if (_type.isEmpty(obj)) return init;
        each(obj, function(v, k, i) {
            init = fn(init, v, k, i);
        });
        return init;
    }
    
    /**
     * some
     * return true if one or more item in objs pass fn test(fn return true)
     * @param  {Array}   objs
     * @param  {Function} fn
     * @return {Boolean}
     */
    function some(objs, fn) {
        var ret = false;
        each(objs, function(v, k, i) {
            if (fn.call(objs, v, k, i) === true) {
                ret = true;
                return false;
            }
        }, objs, true);
        return ret;
    }
    
    /**
     * all
     * return true if all objs pass fn test(fn return true)
     * @param  {Array}   objs [description]
     * @param  {Function} fn   [description]
     * @return {Boolean}
     */
    function all(objs, fn) {
        var ret = true;
        each(objs, function(v, k, i) {
            if (fn.call(objs, v, k, i) === false) {
                ret = false;
                return false;
            }
        }, objs, true);
        return ret;
    }
    
    /**
     * find
     * return first which pass fn test(fn return true)
     * @param  {Array}   objs
     * @param  {Function} fn
     * @param  {Boolean} returnValueOnly
     * @return {Object}
     */
    function find(objs, fn, returnValueOnly) {
        returnValueOnly = typeof returnValueOnly == 'undefined' ? true : false;
        var ret = returnValueOnly ? null : {};
        each(objs, function(v, k, i) {
            if (fn.call(objs, v, k, i) === true) {
                if (returnValueOnly) {
                    ret = v;
                } else {
                    ret.key = k;
                    ret.value = v;
                    ret.index = i;
                }
                return false;
            }
        }, objs, true);
        return ret;
    }
    
    /**
     * findAll
     * return array of item which pass fn test(fn return true)
     * @param  {Array}   objs
     * @param  {Function} fn
     * @param  {Boolean} returnValueOnly
     * @return {Array}
     */
    function findAll(objs, fn, returnValueOnly) {
        returnValueOnly = typeof returnValueOnly == 'undefined' ? true : false;
        var ret = [];
        each(objs, function(v, k, i) {
            if (fn.call(objs, v, k, i) === true) {
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
        }, objs, true);
        return ret;
    }
    
    /**
     * map
     * @param  {Array|Object}   objs
     * @param  {Function} fn
     * @param  {Any}   context
     * @return {Array|Object}
     */
    function map(objs, fn, context) {
        var ret;
        if (_type.isArray(objs)) {
            ret = [];
            _array_each(objs, function(v, k, i) {
                ret.push(fn.call(context, v, k, i));
            });
        } else {
            ret = {};
            _object_each(objs, function(v, k, i) {
                ret[k] = fn.call(context, v, k, i);
            });
        }
        return ret;
    }
    
    /**
     * pluck
     * @param  {Object|Array} objs
     * @param  {String} key
     * @return {[type]}
     */
    function pluck(objs, key, doNotReturn) {
        var f;
        if (typeof doNotReturn == 'undefined') {
            doNotReturn = false;
        }
        if (key[0] == '&') {
            key = key.substring(1);
            f = function(e, i) {
                return e[key] ? e[key].call(e) : undefined;
            };
        } else {
            f = function(e, i) {
                return e[key];
            };
        }
        if (doNotReturn) {
            if (_type.isArray(objs)) {
                _array_each(objs, function(v, k, i) {
                    f.call(context, v, k, i);
                });
            } else {
                ret = {};
                _object_each(objs, function(v, k, i) {
                    f.call(context, v, k, i);
                });
            }
        } else {
            return map(objs, f);
        }
    }
    
    
    /**
     * compact
     * @param  {Array|Object} objs
     * @return {Array}
     */
    function compact(objs) {
        var ret;
        if (_type.isArray(objs)) {
            ret = [];
            _array_each(objs, function(v, k, i) {
                if (v === null || typeof v == 'undefined') return;
                ret.push(v);
            });
        } else {
            ret = {};
            _object_each(objs, function(v, k, i) {
                if (v === null || typeof v == 'undefined') return;
                ret[k] = v;
            });
        }
        return ret;
    }
    
    exports['each'] = each;
    exports['inject'] = inject;
    exports['all'] = all;
    exports['some'] = some;
    exports['find'] = find;
    exports['findAll'] = findAll;
    exports['map'] = map;
    exports['compact'] = compact;
    exports['pluck'] = pluck;
    return exports;
});
//end of $root.lang.enumerable
