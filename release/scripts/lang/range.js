/**
 * ---
 * description: Range, immutable
 * namespace: $root.lang.range
 * imports:
 *   _type: $root.lang.type
 *   _str: $root.lang.string
 * exports:
 * - create
 * files:
 * - src/lang/range.js
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('lang/range',['lang/type','lang/string'], factory);
    } else {
        var exports = $root._createNS('$root.lang.range');
        factory($root.lang.type,$root.lang.string,exports);
    }
}(this, function (_type,_str,exports) {
    //'use strict';
    exports = exports || {};
    
        var rangeCache = {};
    
    function checkRangeBounds(from, to) {
        if (!_type.isFiniteNumber(from, to)) {
            throw Error('Arguments `from` and `to` must be finit integer!');
        }
    }
    
    /**
     * Range
     * represents a range, immutable
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
                if (x.ctor && _type.isFunction(x.ctor) && x.ctor() === Range) {
                    b = x.bounds();
                    return b[0] >= from && b[1] <= to;
                } else {
                    return x >= from && x <= to;
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
                return [left || '[', from, ',', to, right || ']'].join('');
            },
            indexOf: function(i) {
                return this.convers(i) ? i - from : -1;
            }
        };
    }
    
    Range.BoundsType = ['[]', '[)', '(]', '()'];
    
    //exports
    /**
     * create
     * create a Range instance from given args
     * @return {Range}
     */
    function create() {
        var len = arguments.length,
            bounds, from, to, boundsCheck;
        if (typeof arguments[0] == 'string') {
            bounds = arguments[0];
            from = arguments[1];
            to = arguments[2];
            boundsCheck = arguments[3];
        } else if (typeof arguments[0] == 'number') {
            bounds = '[]';
            from = arguments[0];
            to = arguments[1];
            boundsCheck = arguments[2];
        }
        if (boundsCheck) checkRangeBounds(from, to);
        if (from > to) {
            from = [to, to = from][0];
        }
    
        var upper = bounds[1] || ']',
            lower = bounds[0] || '[';
    
        if (lower == '(') from += 1;
        if (upper == ')') to -= 1;
    
        var cacheKey = lower + String(from) + ',' + String(to) + upper,
            r = rangeCache[cacheKey];
        if (typeof r == 'undefined') {
            r = new Range(from, to);
            rangeCache[cacheKey] = r;
        }
        return r;
    }
    
    var reRangStr = /[\[(](-?\d+),(-?\d+)[)\]]/;
    
    function parse(s) {
        if (!s) return null;
        var m = s.match(reRangStr);
        if (!m) throw new Error('Range format error!');
        return create(m[0] + m[3], parseInt(m[1], 10), parseInt(m[2], 10));
    }
    
    exports['create'] = create;
    exports.__doc__ = "Range, immutable";
    return exports;
}));
//end of $root.lang.range
