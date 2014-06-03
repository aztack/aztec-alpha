/**
 * Button
 * ------
 * Dependencies: $root.lang.type,$root.lang.arguments,$root.lang.number,$root.lang.enumerable,$root.lang.string,$root.ui.draggable,jquery,jQueryExt,$root.browser.template
 */

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('ui/button', ['lang/type', 'lang/arguments', 'lang/number', 'lang/enumerable', 'lang/string', 'ui/draggable', 'jquery', 'jQueryExt', 'browser/template'], factory);
    } else if (typeof module === 'object') {
        var $root_lang_type = require('lang/type'),
            $root_lang_arguments = require('lang/arguments'),
            $root_lang_number = require('lang/number'),
            $root_lang_enumerable = require('lang/enumerable'),
            $root_lang_string = require('lang/string'),
            $root_ui_draggable = require('ui/draggable'),
            jquery = require('jquery'),
            jQueryExt = require('jQueryExt'),
            $root_browser_template = require('browser/template');
        module.exports = factory($root_lang_type, $root_lang_arguments, $root_lang_number, $root_lang_enumerable, $root_lang_string, $root_ui_draggable, jquery, jQueryExt, $root_browser_template, exports, module, require);
    } else {
        var exports = $root._createNS('$root.ui.button');
        factory($root.lang.type, $root.lang.arguments, $root.lang.number, $root.lang.enumerable, $root.lang.string, $root.ui.draggable, jquery, jQueryExt, $root.browser.template, exports);
    }
}(this, function(_type, _arguments, _number, _enum, _str, _drag, $, jqe, _tpl, exports) {
    //'use strict';
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
