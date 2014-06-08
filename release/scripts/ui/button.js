/**
 * #Button#
 * ======
 * - Dependencies: `lang/type`,`lang/arguments`,`lang/number`,`lang/enumerable`,`lang/string`,`ui/draggable`,`jquery`,`jQueryExt`,`browser/template`
 * - Version: 0.1
 */

(function(global, factory) {
    if (typeof define === 'function' && define.amd) {
        define('ui/button', ['lang/type', 'lang/arguments', 'lang/number', 'lang/enumerable', 'lang/string', 'ui/draggable', 'jquery', 'jQueryExt', 'browser/template'], factory);
    } else {
        var $root = global.$root,
            exports = $root._createNS('$root.ui.button');
        factory($root.lang.type, $root.lang.arguments, $root.lang.number, $root.lang.enumerable, $root.lang.string, $root.ui.draggable, jQuery, jQueryExt, $root.browser.template, exports);
    }
}(this, function(_type, _arguments, _number, _enum, _str, _drag, $, jqe, _tpl, exports) {
    'use strict';
    exports = exports || {};
    _tpl
        .set('$root.ui.button.Normal',"<button class=\"ui-button\"><span class=\"ui-button-text\"></span></button>\n")
        .set('$root.ui.button.Anchor',"<a class=\"ui-button-anchor\"><span class=\"ui-button-text\"></span></a>\n");
    var varArg = _arguments.varArg,
      tpl = _tpl.id$('$root.ui.button');
    
    
    var Button = _type.create('$root.ui.Button', jQuery, {
      init: function() {
    
      }
    }).statics({
      Type: {
        Submit: 0,
        Normal: 1,
        Anchor: 2
      }
    }).options({
      type: 1
    });
    
    function Button_initialize(self, opts) {
    
    }
        
    ///sigils
    if (!Button.Sigils) Button.Sigils = {};
    Button.Sigils[".text"] = ".ui-button-text";

    exports['Button'] = Button;
    exports.__doc__ = "Button";
    exports.VERSION = '0.1';
    return exports;
}));
//end of $root.ui.button
