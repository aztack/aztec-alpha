// ({
//   description: "Base class for all UI controls",
//   namespace: $root.ui.UIControl,
//   imports: {
//     _type: $root.lang.type,
//     $: jQuery
// },
//   exports: [UIControl]
// })

;define('$root.ui.UIControl',['$root.lang.type','jQuery'],function(require, exports){
    //'use strict';
    var _type = require('$root.lang.type'),$ = require('jQuery');
        require('$root.browser.template');
  var UIControl = type.create('UIControl', {
    initialize: function(options) {
        var clazz = this.getClass();
        UIControl.all[clazz.typename()] = clazz;
    },
    getOptions: function() {
        return {};
    },
    parentControl: function() {
        return null;
    }
}).statics({
    all: {}
});
  exports['UIControl'] = UIControl;
    return exports;
});
//end of $root.ui.UIControl
