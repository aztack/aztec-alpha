/**
 * #TextField#
 * =========
 * - Dependencies: `lang/type`,`browser/template`,`lang/arguments`,`jquery`,`jQueryExt`
 * - Version: 0.0.1
 */

(function(global, factory) {
    if (typeof define === 'function' && define.amd) {
        define('ui/textField', ['lang/type', 'browser/template', 'lang/arguments', 'jquery', 'jQueryExt'], factory);
    } else {
        var $root = global.$root,
            exports = $root._createNS('$root.ui.textField');
        factory($root.lang.type, $root.browser.template, $root.lang.arguments, jQuery, jQueryExt, exports);
    }
}(this, function(_type, _tpl, _arguments, $, jqe, exports) {
    'use strict';
    exports = exports || {};
    _tpl
        .set('$root.ui.TextField.textfield',"<input type=\"text\" class=\"ui-textfield\" _placeholder=\"placeholder\">\n");
    ///vars
    var tpl = _tpl.id$('$root.ui.TextField'),
      textfieldTemplate = tpl('textfield'),
      varArg = _arguments.varArg;
    
    ///impl
    var TextField = _type.create('$root.ui.TextField', jQuery, {
      init: function() {
        var va = varArg(arguments, this)
          .when(function() {
            this.base(textfieldTemplate);
          })
          .when('jquery',function(ele){
            this.base(ele);
          })
          .when('*', function(arg) {
            this.base(textfieldTemplate);
            this.val(String(arg));
          });
        va.resolve();
        if (this.attr('placeholder')) {
          placeholderPollyfill(this[0]);
        }
      },
      placeholder: function(text) {
    
      }
    });
    
    //copy from https://github.com/mathiasbynens/jquery-placeholder
    var isInputSupported = 'placeholder' in document.createElement('input'),
      isTextareaSupported = 'placeholder' in document.createElement('textarea'),
      placeholderPollyfill;
    
    function set() {
      var $replacement,
        input = this,
        $input = $(input),
        id = this.id;
      if (input.value === '') {
        if (input.type == 'password') {
          if (!$input.data('placeholder-textinput')) {
            try {
              $replacement = $input.clone().attr({
                'type': 'text'
              });
            } catch (e) {
              $replacement = $('<input>').attr($.extend(args(this), {
                'type': 'text'
              }));
            }
            $replacement
              .removeAttr('name')
              .data({
                'placeholder-password': $input,
                'placeholder-id': id
              })
              .bind('focus.placeholder', clearPlaceholder);
            $input
              .data({
                'placeholder-textinput': $replacement,
                'placeholder-id': id
              })
              .before($replacement);
          }
          $input = $input.removeAttr('id').hide().prev().attr('id', id).show();
          // Note: `$input[0] != input` now!
        }
        $input.addClass('placeholder');
        $input[0].value = $input.attr('placeholder');
      } else {
        $input.removeClass('placeholder');
      }
    }
    
    function clear() {
      var input = this,
        $input = $(input);
      if (input.value == $input.attr('placeholder') && $input.hasClass('placeholder')) {
        if ($input.data('placeholder-password')) {
          $input = $input.hide().next().show().attr('id', $input.removeAttr('id').data('placeholder-id'));
          // If `clearPlaceholder` was called from `$.valHooks.input.set`
          if (event === true) {
            $input[0].value = value;
            return;
          }
          $input.focus();
        } else {
          input.value = '';
          $input.removeClass('placeholder');
          if (input == safeActiveElement()) {
            input.select();
          }
        }
      }
    }
    
    function safeActiveElement() {
      // Avoid IE9 `document.activeElement` of death
      // https://github.com/mathiasbynens/jquery-placeholder/pull/99
      try {
        return document.activeElement;
      } catch (err) {}
    }
    
    function args(elem) {
      // Return an object of element attributes
      var newAttrs = {};
      var rinlinejQuery = /^jQuery\d+$/;
      $.each(elem.attributes, function(i, attr) {
        if (attr.specified && !rinlinejQuery.test(attr.name)) {
          newAttrs[attr.name] = attr.value;
        }
      });
      return newAttrs;
    }
    
    if (isInputSupported && isTextareaSupported) {
      placeholderPollyfill = function(input) {
        return input;
      };
    } else {
      placeholderPollyfill = function(input) {
        input = $(input);
        input.bind({
          'focus.placeholder': clear,
          'blur.placeholder': set
        }).data('placeholder-enabled', true);
    
        set.call(input[0]);
      };
    }
    
    ///exports
        
    ///sigils
    if (!TextField.Sigils) TextField.Sigils = {};
    TextField.Sigils[".tag"] = ".ui-textfield";

    exports['TextField'] = TextField;
    exports['placeholderPollyfill'] = placeholderPollyfill;
    exports.__doc__ = "TextField";
    exports.VERSION = '0.0.1';
    return exports;
}));
//end of $root.ui.textField
