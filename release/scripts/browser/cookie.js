/**
 * #Cookie Manipulation#
 * ===================
 * - Dependencies: `lang/type`,`lang/enumerable`,`lang/string`
 * - Version: 0.0.1
 */

(function(global, factory) {
    if (typeof define === 'function' && define.amd) {
        define('browser/cookie', ['lang/type', 'lang/enumerable', 'lang/string'], factory);
    } else {
        var $root = global.$root,
            exports = $root._createNS('$root.browser.cookie');
        factory($root.lang.type, $root.lang.enumerable, $root.lang.string, exports);
    }
}(this, function(_type, _enum, _str, exports) {
    'use strict';
    exports = exports || {};
    
    function get(key){
    
    }
    
    function set(key, value) {
        
    }
    
    exports['get'] = get;
    exports['set'] = set;
    exports.__doc__ = "Cookie Manipulation";
    exports.VERSION = '0.0.1';
    return exports;
}));
//end of $root.browser.cookie
