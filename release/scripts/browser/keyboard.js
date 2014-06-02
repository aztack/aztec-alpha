/**
 * ---
 * description: Keyboard
 * namespace: $root.browser.keyboard
 * imports:
 *   _type: $root.lang.type
 *   _str: $root.lang.string
 * exports: []
 * files:
 * - src/browser/keyboard.js
 */

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('browser/keyboard', ['lang/type', 'lang/string'], factory);
    } else if (typeof module === 'object') {
        var $root_lang_type = require('lang/type'),
            $root_lang_string = require('lang/string');
        module.exports = factory($root_lang_type, $root_lang_string, exports, module, require);
    } else {
        var exports = $root._createNS('$root.browser.keyboard');
        factory($root.lang.type, $root.lang.string, exports);
    }
}(this, function(_type, _str, exports) {
    //'use strict';
    exports = exports || {};
    
    ///vars
    
    
    ///helper
    
    
    ///impl
    
    /**
     * main function is called when DOMReady
     */
    //function main(){}
    //$(main);
    
    
    ///exports
    
    
    exports.__doc__ = "Keyboard";
    exports.VERSION = '0.0.1';
    return exports;
}));
//end of $root.browser.keyboard
