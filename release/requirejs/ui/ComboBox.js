/**
 * ---
 * description: ComboBox
 * namespace: $root.ui.comboBox
 * imports:
 *   _type: $root.lang.type
 *   _fn: $root.lang.fn
 *   _tpl: $root.browser.template
 *   _arguments: $root.lang.arguments
 *   _menu: $root.ui.menu
 *   _textfield: $root.ui.textField
 *   $: jQuery
 * exports:
 * - ComboBox
 * files:
 * - src/ui/comboBox.js
 */

;define('ui/comboBox',[
    'lang/type',
    'lang/fn',
    'browser/template',
    'lang/arguments',
    'ui/menu',
    'ui/textField',
    'jQuery'
], function (_type,_fn,_tpl,_arguments,_menu,_textfield,$){
    //'use strict';
    var exports = {};
        _tpl
            .set('$root.ui.ComboBox.box',"<div>\n        \n    </div>\n");
    ///vars
var Menu = _menu.Menu,
  TextField = _textfield.TextField,
  varArg = _arguments.varArg,
  tpl = _tpl.id$('$root.ui.ComboBox'),
  boxTemplate = tpl('box');

///exports
var ComboBox = _type.create('$root.ui.ComboBox', jQuery, {
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
//end of $root.ui.comboBox