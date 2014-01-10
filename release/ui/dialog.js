// ({
//   description: 'Alert',
//   namespace: $root.ui.dialog,
//   imports: {
//     _type: $root.lang.type,
//     _str: $root.lang.string,
//     UIControl: $root.ui.UIControl,
//     $: jQuery
// },
//   exports: [Alert]
// })

;define('$root.ui.dialog',['$root.lang.type','$root.lang.string','$root.ui.UIControl','jQuery'],function(require, exports){
    //'use strict';
    var _type = require('$root.lang.type'),_str = require('$root.lang.string'),UIControl = require('$root.ui.UIControl'),$ = require('jQuery');
    require('$root.browser.template')
    .set('$root.ui.dialog.Alert',"<div style=\"display:none\">\n            <div class=\"ui-alert\">\n                <div class=\"ui-title\"></div>\n                <div class=\"ui-body\"></div>\n            </div>\n        </div>");
      ///vars
    
    ///helper
    
    
    ///impl
    var Alert = _type.create('Alert', UIControl, {
      initialize: function(options) {
        this.super();
      }
    })
    
    /**
     * main function is called when DOMReady
     */
    //function main(){}
    //$(main);
    
    
    ///exports
  exports['Alert'] = Alert;
    return exports;
});
//end of $root.ui.dialog
