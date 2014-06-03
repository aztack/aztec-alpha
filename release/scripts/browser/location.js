/**
 * Location
 * --------
 * Dependencies: $root.lang.type,$root.lang.string
 */

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('browser/location', ['lang/type', 'lang/string'], factory);
    } else if (typeof module === 'object') {
        var $root_lang_type = require('lang/type'),
            $root_lang_string = require('lang/string');
        module.exports = factory($root_lang_type, $root_lang_string, exports, module, require);
    } else {
        var exports = $root._createNS('$root.browser.location');
        factory($root.lang.type, $root.lang.string, exports);
    }
}(this, function(_type, _str, exports) {
    //'use strict';
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
