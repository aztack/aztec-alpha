/**
 * ---
 * description: Button
 * version: 0.1
 * namespace: $root.ui.button
 * directory: ui/Button
 * imports:
 *   _type: $root.lang.type
 *   _arguments: $root.lang.arguments
 *   _number: $root.lang.number
 *   _enum: $root.lang.enumerable
 *   _str: $root.lang.string
 *   _drag: $root.ui.draggable
 *   $: jQuery
 *   _tpl: $root.browser.template
 * exports:
 * - Button
 * files:
 * - src/ui/Button/Button.js
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('ui/button',['lang/type','lang/arguments','lang/number','lang/enumerable','lang/string','ui/draggable','jQuery','browser/template'], factory);
    } else {
        var exports = $root._createNS('$root.ui.button');
        factory($root.lang.type,$root.lang.arguments,$root.lang.number,$root.lang.enumerable,$root.lang.string,$root.ui.draggable,jQuery,$root.browser.template,exports);
    }
}(this, function (_type,_arguments,_number,_enum,_str,_drag,$,_tpl,exports) {
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
    return exports;
}));
//end of $root.ui.button
