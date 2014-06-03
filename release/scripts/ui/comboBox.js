/**
 * ComboBox
 * --------
 * Dependencies: $root.lang.type,$root.lang.fn,$root.browser.template,$root.lang.arguments,$root.ui.menu,$root.ui.textField,jquery,jQueryExt
 */

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('ui/comboBox', ['lang/type', 'lang/fn', 'browser/template', 'lang/arguments', 'ui/menu', 'ui/textField', 'jquery', 'jQueryExt'], factory);
    } else if (typeof module === 'object') {
        var $root_lang_type = require('lang/type'),
            $root_lang_fn = require('lang/fn'),
            $root_browser_template = require('browser/template'),
            $root_lang_arguments = require('lang/arguments'),
            $root_ui_menu = require('ui/menu'),
            $root_ui_textField = require('ui/textField'),
            jquery = require('jquery'),
            jQueryExt = require('jQueryExt');
        module.exports = factory($root_lang_type, $root_lang_fn, $root_browser_template, $root_lang_arguments, $root_ui_menu, $root_ui_textField, jquery, jQueryExt, exports, module, require);
    } else {
        var exports = $root._createNS('$root.ui.comboBox');
        factory($root.lang.type, $root.lang.fn, $root.browser.template, $root.lang.arguments, $root.ui.menu, $root.ui.textField, jquery, jQueryExt, exports);
    }
}(this, function(_type, _fn, _tpl, _arguments, _menu, _textfield, $, jqe, exports) {
    //'use strict';
    exports = exports || {};
    _tpl
        .set('$root.ui.ComboBox.box',"<div class=\"ui-combobox\">\n        \n    </div>\n");
    //Features
    
    
    ///vars
    var Menu = _menu.Menu,
      TextField = _textfield.TextField,
      varArg = _arguments.varArg,
      tpl = _tpl.id$('$root.ui.ComboBox'),
      boxTemplate = tpl('box');
    
    ///exports
    var ComboBox = _type.create('$root.ui.ComboBox', jQuery, {
      init: function(opts) {
        this.base(ComboBox.Template.BoxTemplate);
        this.$attr('textfield', new TextField());
        this.$attr('menu', new Menu());
        ComboBox_initialize(this);
      },
      showMenu: function(x, y) {
        var tf = this.textfield,
          w = this.textfield.width(),
          h = this.textfield.outerHeight(true);
        this.menu.show().css({
          left: x || '2px',
          top: h,
          width: Math.max(w, this.menu.width())
        });
        console.log(this.menu[0].style);
      },
      hideMenu: function() {
        this.menu.hide();
      }
    }).options({
      items: []
    }).statics({
      Template: {
        BoxTemplate: boxTemplate
      }
    }).events(Menu.Events, TextField.Events);
    
    function ComboBox_initialize(self) {
      var menu = self.menu,
        hideMenu = _fn.bindTimeout(self.hideMenu, self, 100),
        showMenu = _fn.bind(function(){
          self.showMenu();
        }, self);
    
      self.css('position','relative')
        .textfield
        .focus(showMenu)
        .blur(hideMenu);
    
      menu.on(Menu.Events.OnItemSelected, function(e, item, index) {
        var text = item.text();
        self.textfield.val(text);
      }).hide();
    
      self.append(self.textfield)
        .append(self.menu);
    }
        
    ///sigils

    exports['ComboBox'] = ComboBox;
    exports.__doc__ = "ComboBox";
    exports.VERSION = '0.0.1';
    return exports;
}));
//end of $root.ui.comboBox
