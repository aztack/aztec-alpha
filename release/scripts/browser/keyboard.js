/**
 * #Keyboard#
 * ========
 * - Dependencies: `lang/type`,`lang/string`
 * - Version: 0.0.1
 */

(function(global, factory) {
    if (typeof define === 'function' && define.amd) {
        define('browser/keyboard', ['lang/type', 'lang/string'], factory);
    } else {
        var $root = global.$root,
            exports = $root._createNS('$root.browser.keyboard');
        factory($root.lang.type, $root.lang.string, exports);
    }
}(this, function(_type, _str, exports) {
    'use strict';
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
