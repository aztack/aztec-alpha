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

;define('browser/cookie',[
    'lang/type',
    'lang/enumerable',
    'lang/string'
], function (_type,_enum,_str){
    //'use strict';
    var exports = {};
    
        function get(key){
    
    }
    
    function set(key, value) {
        
    }
    
    exports['get'] = get;
    exports['set'] = set;
    exports.__doc__ = "Cookie Manipulation";
    return exports;
});
//end of $root.browser.cookie
