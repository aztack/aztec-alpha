/**
 * ---
 * description: Range
 * namespace: $root.lang.range
 * imports:
 *   _type: $root.lang.type
 *   _str: $root.lang.string
 * exports:
 * - Range
 * - create
 * files:
 * - /lang/range.js
 */

;define('$root.lang.range',['$root.lang.type','$root.lang.string'],function(require, exports){
    //'use strict';
    var _type = require('$root.lang.type'),
        _str = require('$root.lang.string');
    
        //vars
    var rangeCache = {};
    
    //helper
    
    function checkRangeBounds(from, to) {
        if (!_type.isFiniteNumber(from, to)) {
            throw Error('Arguments `from` and `to` must be finit integer in create(from, to)!');
        }
    }
    
    //impl
    /**
     * Range
     * represents a integer range, immutable
     * @param {[type]} from [description]
     * @param {[type]} to   [description]
     */
    function Range(from, to) {
        checkRangeBounds(from, to);
        return {
            toArray: function(includeUpperBound) {
                var i = from,
                    ret = [];
                for (; i < to; ++i) {
                    ret.push(i);
                }
                if (includeUpperBound) {
                    ret.push(to);
                }
                return ret;
            },
            each: function(fn) {
                if (!_type.isFunction(fn)) return this;
                var i = from,
                    index = 0;
                for (; i < to; ++i) {
                    fn(i, index);
                    index++;
                }
            },
            covers: function(x) {
                var b;
                if (_type.isFinite(x)) {
                    return x >= from && x <= to;
                } else if (_type.isFunction(x.ctor) && x.ctor() === Range) {
                    b = x.bounds();
                    return b[0] >= from && b[1] <= to;
                } else {
                    return false;
                }
            },
            equal: function(r) {
                var b;
                if (r && _type.isFunction(r.ctor) && r.ctor() === Range) {
                    b = r.bounds();
                    return b[0] === from && b[1] === to;
                }
                return false;
            },
            ctor: function() {
                return Range;
            },
            bounds: function() {
                return [from, to];
            },
            toString: function(left, right) {
                return [left || '[', from, ',', to, right || ']'];
            }
        };
    }
    
    
    //exports
    /**
     * create
     * create a Range instance from given args
     * @param  {Integer} from
     * @param  {Integer} to
     * @return {Range}
     */
    function create(from, to) {
        checkRangeBounds(from, to);
        if (from > to) {
            from = [to, to = from][0];
        }
        var key = String(from) + '~' + String(to),
            r = rangeCache[key];
        if (r == 'undefined') {
            r = new Range(from, to);
        }
        return r;
    }
    exports['Range'] = Range;
    exports['create'] = create;
    return exports;
});
//end of $root.lang.range
