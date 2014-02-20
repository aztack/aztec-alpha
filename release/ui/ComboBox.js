/**
 * ---
 * description: ComboBox
 * namespace: $root.ui.ComboBox
 * imports:
 *   _type: $root.lang.type
 *   _tpl: $root.browser.template
 *   _arguments: $root.lang.arguments
 *   _menu: $root.ui.Menu
 *   _textfield: $root.ui.TextField
 *   $: jQuery
 * exports:
 * - ComboBox
 * files:
 * - /ui/ComboBox.js
 */

;define('$root.ui.ComboBox',[
    '$root.lang.type',
    '$root.browser.template',
    '$root.lang.arguments',
    '$root.ui.Menu',
    '$root.ui.TextField',
    'jQuery'
], function (require, exports){
    //'use strict';
    var _type = require('$root.lang.type'),
        _tpl = require('$root.browser.template'),
        _arguments = require('$root.lang.arguments'),
        _menu = require('$root.ui.Menu'),
        _textfield = require('$root.ui.TextField'),
        $ = require('jQuery');
        
    ///xtemplate
    require('$root.browser.template')
            .set('$root.ui.ComboBox.box',"<div>\n        \n    </div>\n");
        ///vars
    var Menu = _menu.Menu,
      TextField = _textfield.TextField,
      varArg = _arguments.varArg,
      tpl = _tpl.$('$root.ui.ComboBox'),
      boxTemplate = tpl('box');
    
    ///exports
    var ComboBox = _type.create('ComboBox', jQuery, {
      init: function(){
        this.base(boxTemplate);
        this.textfield = new TextField();
        this.menu = new Menu();
        this.append(this.textField);
        this.append(this.menu);
      },
      showDropdown: function() {
        
      }
    }).statics({
    });
        
    ///sigils

    exports['ComboBox'] = ComboBox;
    return exports;
});
//end of $root.ui.ComboBox
