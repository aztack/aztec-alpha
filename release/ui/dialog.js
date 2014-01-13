/**
 * ---
 * description: Dialog
 * namespace: $root.ui.dialog
 * imports:
 *   _type: $root.lang.type
 *   _str: $root.lang.string
 *   UIControl: $root.ui.UIControl
 *   $: jQuery
 * exports:
 * - Dialog
 * - Alert
 * files:
 * - ../src/ui/dialog/Dialog.js
 * - ../src/ui/dialog/Alert.js
 */

;define('$root.ui.dialog',['$root.lang.type','$root.lang.string','$root.ui.UIControl','jQuery'],function(require, exports){
    //'use strict';
    var _type = require('$root.lang.type'),
        _str = require('$root.lang.string'),
        UIControl = require('$root.ui.UIControl'),
        $ = require('jQuery');
        
    ///xtemplate
    require('$root.browser.template')
            .set('$root.ui.dialog.Dialog',"<div style=\"display:none;\">\n        </div>");
        ///vars
    
    
    ///helper
    
    
    ///impl
    var Dialog = _type.create('Dialog', UIControl, {
        initialize: function(options) {
            this.super();
        }
    });
    /**
     * main function is called when DOMReady
     */
    //function main(){}
    //$(main);
    
    
    ///exports
    // ../src/ui/dialog/Alert.js
    /**
     * Alert
     */
    ///vars
    
    ///helper
    
    
    ///impl
    var Alert = _type.create('Alert', Dialog, {
      initialize: function(options) {
        this.super();
      }
    });
    
    /**
     * main function is called when DOMReady
     */
    //function main(){}
    //$(main);
    
    
    ///exports
    exports['Dialog'] = Dialog;
    exports['Alert'] = Alert;
    return exports;
});
//end of $root.ui.dialog
