/**
 * #Location#
 * ========
 * - Dependencies: `lang/type`,`lang/string`
 * - Version: 0.0.1
 */

(function(global, factory) {
    if (typeof define === 'function' && define.amd) {
        define('browser/location', ['lang/type', 'lang/string'], factory);
    } else {
        var $root = global.$root,
            exports = $root._createNS('$root.browser.location');
        factory($root.lang.type, $root.lang.string, exports);
    }
}(this, function(_type, _str, exports) {
    'use strict';
    exports = exports || {};
    
    ///vars
    
    
    ///helper
    
    
    ///impl
    
    
    ///exports
    ///
    function has(name) {
      
    }
    
    function get(name, defaultValue) {
    
    }
    
    function set(name) {
    
    }
    
    function remove(name) {
    
    }
    
    function add(name, value) {
    
    }
    
    exports['get'] = get;
    exports['set'] = set;
    exports.__doc__ = "Location";
    exports.VERSION = '0.0.1';
    return exports;
}));
//end of $root.browser.location
