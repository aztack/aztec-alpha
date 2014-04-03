/**
 * ---
 * description: Ruby String like string module
 * version: 0.0.1
 * namespace: $root.lang.array
 * imports:
 *   _type: $root.lang.type
 * exports:
 * - w
 * - forEach
 * - indexOf
 * - toArray
 * - equal
 * - strictEqual
 * - compact
 * - flatten
 * files:
 * - src/lang/array.js
 */

;define('lang/array',[
    'lang/type'
], function (_type){
    //'use strict';
    var exports = {};
    
        ///imports
    var _forEach = Array.prototype.forEach,
        _slice = Array.prototype.slice,
        _indexOf = Array.prototype.indexOf;
    
    ///exports
    
    var w = function(self) {
        if (!self || self.length === 0) {
            return [];
        }
        var s = self;
        if(typeof self !== 'string') {
            s = '' + self;
        }
        return s.split(/[\s\n\t]+/);
    };
    
    /**
     * forEach
     * @param  {[type]}   ary
     * @param  {Function} fn
     * @return {Array}
     */
    var forEach = _forEach ? function(self, fn) {
            _forEach.call(self, fn);
        } : function(self, fn) {
            var i = 0,
                len = ary.len,
                item;
            for (; i < len; ++i) {
                item = ary[i];
                fn(item, i);
            }
            return ary;
        };
    
    /**
     * indexOf
     * @param  {Array} ary
     * @param  {Any} obj
     * @return {Integer}
     */
    var indexOf = _indexOf ? function(self, obj) {
            return _indexOf.call(self, obj);
        } : function(self, obj) {
            var i = 0,
                len = self.length;
            for (; i < len; ++i) {
                if (self[i] == obj) {
                    return i;
                }
            }
            return -1;
        };
    
    /**
     * toArray
     * convert array like object into an array
     * @param  {Any} arrayLike
     * @param  {int} start, where to start slice, included
     * @param  {int} end, where to end slice, not included
     * @return {Array}
     */
    function toArray(arrayLike, start, end) {
        // if arrayLike has a number value length property
        // then it can be sliced
        return _type.isNumber(arrayLike.length) ? _slice.call(arrayLike, start, end) : [];
    }
    
    /**
     * equal
     * @param  {Array} a
     * @param  {Array} b
     * @return {Boolean}
     */
    function equal(self, b) {
        var i = 0,
            len = self.length;
        if (len !== b.length) return false;
        for (; i < len; ++i) {
            if (self[i] == b[i]) {
                continue;
            } else if (_type.isArray(self[i], b[i])) {
                if (!equal(self[i], b[i])) return false;
            } else {
                return false;
            }
        }
        return true;
    }
    
    /**
     * strictEqual
     * @param  {Array} a
     * @param  {Array} b
     * @return {Boolean}
     */
    function strictEqual(self, b) {
        var i = 0,
            len = self.length;
        if (len !== b.length) return false;
        for (; i < len; ++i) {
            if (self[i] === b[i]) {
                continue;
            } else if (_type.isArray(self[i], b[i])) {
                if (!strictEqual(self[i], b[i])) return false;
            } else {
                return false;
            }
        }
        return true;
    }
    
    /**
     * compact
     * remove empty item(undefined,null, zero length array/object/string, 0) from an array
     * @param  {Array} ary
     * @return {Array}
     */
    function compact(self) {
        var ret = [];
        if (!_type.isArrayLike(self)) return ret;
        var i = 0,
            len = self.length;
        for (; i < len; ++i) {
            if (_type.isEmpty(self[i])) continue;
            ret.push(arg[i]);
        }
        return ret;
    }
    
    /**
     * flatten an array into a one-dimension array
     * @param  {Array} ary
     * @return {Array}
     */
    function flatten(self) {
        if (!_type.isArray(self)) return [self];
        var i = 0,
            obj,
            len = self.length,
            r, ret = [];
        for (; i < len; ++i) {
            obj = self[i];
            if (_type.isArray(obj)) {
                r = flatten(obj);
                ret = ret.concat(r);
            } else {
                ret.push(obj);
            }
        }
        return ret;
    }
    
    exports['w'] = w;
    exports['forEach'] = forEach;
    exports['indexOf'] = indexOf;
    exports['toArray'] = toArray;
    exports['equal'] = equal;
    exports['strictEqual'] = strictEqual;
    exports['compact'] = compact;
    exports['flatten'] = flatten;
    exports.__doc__ = "Ruby String like string module";
    return exports;
});
//end of $root.lang.array