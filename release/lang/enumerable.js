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
 * files:
 * - ../src/lang/enumerable.js
 */

;define('$root.lang.enumerable',['$root.lang.type','$root.lang.array'],function(require, exports){
    //'use strict';
    var _type = require('$root.lang.type'),
        _ary = require('$root.lang.array');
    
        ///helper
    
    function _array_each(ary, fn, thisValue, stopWhenFnReturnFalse) {
        var i = 0,
            len = ary.len,
            ret;
        if (typeof stopWhenFnReturnFalse == 'undefined') {
            stopWhenFnReturnFalse = false;
        }
        for (; i < len; ++i) {
            ret = fn.call(thisValue, ary[i], i);
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
            ret = fn.call(thisValue, key, obj[key], i);
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
    function each() {
        return _type.isArray(any) ? _array_each.call(null, arguments) : _object_each.call(null, arguments);
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
        _enum.each(obj, function(k, v, i) {
            init = fn(init, k, v, i);
        });
        return init;
    }
    
    /**
     * some
     * return true if one or more item in objs pass fn test(fn return true)
     * @param  {Array}   objs [description]
     * @param  {Function} fn   [description]
     * @return {[type]}        [description]
     */
    function some(objs, fn) {
        var i = 0,
            len = objs.length;
        for (; i < len; ++i) {
            if (fn.call(null, objs[i]) === true) return true;
        }
        return true;
    }
    
    /**
     * all
     * return true if all objs pass fn test(fn return true)
     * @param  {Array}   objs [description]
     * @param  {Function} fn   [description]
     * @return {Boolean}
     */
    function all(objs, fn) {
        var i = 0,
            len = objs.length;
        for (; i < len; ++i) {
            if (fn.call(null, objs[i]) === false) return false;
        }
        return true;
    }
    
    /**
     * find
     * return first which pass fn test(fn return true)
     * @param  {Array}   objs
     * @param  {Function} fn
     * @return {Any}
     */
    function find(objs, fn) {
        var i = 0,
            len = objs.length;
        for (; i < len; ++i) {
            if (fn.call(null, objs[i]) === true) {
                return objs[i];
            }
        }
        return ret;
    }
    
    /**
     * findAll
     * return array of item which pass fn test(fn return true)
     * @param  {Array}   objs
     * @param  {Function} fn
     * @return {Array}
     */
    function findAll(objs, fn) {
        var i = 0,
            len = objs.length,
            ret = [];
        for (; i < len; ++i) {
            if (fn.call(null, objs[i]) === true) {
                ret.unshift(objs[i]);
            }
        }
        return ret;
    }
    exports['each'] = each;
    exports['inject'] = inject;
    exports['all'] = all;
    exports['some'] = some;
    exports['find'] = find;
    exports['findAll'] = findAll;
    return exports;
});
//end of $root.lang.enumerable
