/**
 * ---
 * description: Number Utils
 * namespace: $root.lang.number
 * imports:
 *   _type: $root.lang.type
 * exports:
 * - random
 * - max
 * - min
 * files:
 * - /lang/number.js
 */

;define('$root.lang.number',[
    '$root.lang.type'
], function (require, exports){
    //'use strict';
    var _type = require('$root.lang.type');
    
        //vars
    var rand$ = Math.random,
        floor$ = Math.floor,
        max$ = Math.max,
        min$ = Math.min;
    
    //helper
    
    
    //impl
    
    //exports
    function random(min, max) {
        var argLen = arguments.length,
            rn;
        if (argLen === 2) {
            return floor(rand$() * (max - min + 1)) + min;
        } else if (argLen === 1) {
            max = min;
            return floor(rand$() * (max + 1));
        } else {
            return floor(rand$());
        }
    }
    
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
    
    exports['random'] = random;
    exports['max'] = max;
    exports['min'] = min;
    return exports;
});
//end of $root.lang.number
