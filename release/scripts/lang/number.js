/**
 * Number Utils
 * ------------
 * Dependencies: $root.lang.type
 */

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('lang/number', ['lang/type'], factory);
    } else if (typeof module === 'object') {
        var $root_lang_type = require('lang/type');
        module.exports = factory($root_lang_type, exports, module, require);
    } else {
        var exports = $root._createNS('$root.lang.number');
        factory($root.lang.type, exports);
    }
}(this, function(_type, exports) {
    //'use strict';
    exports = exports || {};
    
    //vars
    var rand$ = Math.random,
        floor$ = Math.floor,
        max$ = Math.max,
        min$ = Math.min;
    
    /**
     * max
     * return maximum value
     * @return {Any}
     * @remark
     *  max([1,2,3]) == 3
     *  max(1,2,3) == 3
     */
    function max() {
        var arg = arguments[0],
            len = arguments.length,
            a, b;
        if (len === 1 && _type.isArray(arg)) {
            return max$.apply(Math, arg);
        } else if (len === 2) {
            a = arguments[0];
            b = arguments[1];
            return a > b ? a : b;
        } else {
            return max$.apply(Math, arguments);
        }
    }
    
    /**
     * min
     * return minimum value
     * @return {Any}
     * @remark
     *  min([1,2,3]) == 1
     *  min(1,2,3) == 1
     */
    function min() {
        var arg = arguments[0],
            len = arguments.length,
            a, b;
        if (len === 1 && _type.isArray(arg)) {
            return min$.apply(Math, arg);
        } else if (len === 2) {
            a = arguments[0];
            b = arguments[1];
            return a < b ? a : b;
        } else {
            return min$.apply(Math, arguments);
        }
    }
    
    /**
     * confined
     * input number will be confined between [min, max]
     * @param  {int} self, input
     * @param  {int} min
     * @param  {int}} max
     * @param  {bool} cycle, e.g. if input equal max + 2, output will be min+1 rather than max
     * @return {int}
     */
    function confined(self, mi, ma, cycle) {
        var dis, min = Math.min(mi, ma),
            max = Math.max(mi, ma);
        if (isNaN(self) || !isFinite(self) || min == max) return min;
        if (cycle) {
            if (self >= min && self <= max) return self;
            dis = Math.abs(max - min) + 1;
            if (self < min) {
                return max - (Math.abs(min - self - 1) % dis);
            } else /* (self > max) */ {
                return min + (Math.abs(self - max - 1) % dis);
            }
        } else {
            if (self >= max) {
                return max;
            } else if (self <= min) {
                return min;
            } else return self;
        }
    }
    
    /**
     * rand
     * return a random integer between [from, to]
     * @param  {int} from, lower bounds
     * @param  {int} to, upper bounds
     * @return {int} random integer
     */
    function rand(from, to) {
        var len = arguments.length,
            ret, r = rand$(),
            a, b;
        if (len === 0) {
            ret = r;
        } else if (len === 1) {
            a = 0;
            b = floor$(arguments[0]);
            ret = r* (b - a) + a;
        } else if (len >= 2 && from == to) {
            return from;
        } else {
            a = min$(from, to);
            b = max$(from, to);
            ret = r* (b - a) + a;
        }
        return Math.round(ret);
    }
    
    //     exports['random'] = random;
    exports['max'] = max;
    exports['min'] = min;
    exports['confined'] = confined;
    exports['rand'] = rand;
    exports.__doc__ = "Number Utils";
    exports.VERSION = '0.0.1';
    return exports;
}));
//end of $root.lang.number
