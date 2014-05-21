/**
 * ---
 * description: Cookie Manipulation
 * version: 0.0.1
 * namespace: $root.browser.cookie
 * imports:
 *   _type: $root.lang.type
 *   _enum: $root.lang.enumerable
 *   _str: $root.lang.string
 * exports:
 * - get
 * - set
 * files:
 * - src/browser/cookie.js
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('browser/cookie',['lang/type','lang/enumerable','lang/string'], factory);
    } else {
        var exports = $root._createNS('$root.browser.cookie');
        factory($root.lang.type,$root.lang.enumerable,$root.lang.string,exports);
    }
}(this, function (_type,_enum,_str,exports) {
    //'use strict';
    exports = exports || {};
    
        function get(key){
    
    }
    
    function set(key, value) {
        
    }
    
    exports['get'] = get;
    exports['set'] = set;
    exports.__doc__ = "Cookie Manipulation";
    return exports;
}));
//end of $root.browser.cookie
