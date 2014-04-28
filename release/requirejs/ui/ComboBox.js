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
            .set('$root.ui.ComboBox.box',"<div class=\"ui-combobox\">\n        \n    </div>\n");
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
    return exports;
});
//end of $root.ui.comboBox
