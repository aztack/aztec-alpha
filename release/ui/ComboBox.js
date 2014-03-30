/**
 * ---
 * description: ComboBox
 * namespace: $root.ui.ComboBox
 * imports:
 *   _type: $root.lang.type
 *   _fn: $root.lang.fn
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
    '$root.lang.fn',
    '$root.browser.template',
    '$root.lang.arguments',
    '$root.ui.Menu',
    '$root.ui.TextField',
    'jQuery'
], function (require, exports){
    //'use strict';
    var _type = require('$root.lang.type'),
        _fn = require('$root.lang.fn'),
        _tpl = require('$root.browser.template'),
        _arguments = require('$root.lang.arguments'),
        _menu = require('$root.ui.Menu'),
        _textfield = require('$root.ui.TextField'),
        $ = require('jQuery');
    
    ///vars
var Menu = _menu.Menu,
  TextField = _textfield.TextField,
  varArg = _arguments.varArg,
  tpl = _tpl.id$('$root.ui.ComboBox'),
  boxTemplate = tpl('box');

///exports
var ComboBox = _type.create('ComboBox', jQuery, {
  init: function(opts) {
    opts = opts || ComboBox.CreateOptions();
    this.base(boxTemplate);
    this.textfield = new TextField();
    this.menu = new Menu();
    this.append(this.textfield);
    this.menu.hide();
    this.append(this.menu);
    this.addClass();
    ComboBox_initialize(this);
  },
  showMenu: function() {
    var tf = this.textfield,
      w = this.textfield.width(),
      l = tf.css('left');
    this.menu.show().css({
      left: l,
      width: w
    });

  },
  hideMenu: function() {
    this.menu.hide();
  }
}).statics({
  CreateOptions: function() {
    return {
      css: {
        'className': 'ui-combobox'
      },
      html: {
        boxTemplate : boxTemplate
      }
    };
  }
});

function ComboBox_initialize(self) {
  var menu = self.menu,
    hideMenu = _fn.bindTimeout(self.hideMenu, self, 100),
    showMenu = _fn.bind(self.showMenu, self);

  menu.css('position', 'relative');

  self.textfield
    .focus(showMenu)
    .blur(hideMenu);

  menu.on(Menu.Events.OnItemSelected, function(e, item, index) {
    var text = item.text();
    self.textfield.val(text);
  });
}
        
    ///sigils

    exports['ComboBox'] = ComboBox;
    exports.__doc__ = "ComboBox";
    return exports;
});
//end of $root.ui.ComboBox
