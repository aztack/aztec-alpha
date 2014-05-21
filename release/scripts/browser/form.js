/**
 * ---
 * description: Form
 * namespace: $root.browser.form
 * imports:
 *   _type: $root.lang.type
 *   _argument: $root.lang.arguments
 *   _str: $root.lang.string
 *   _ary: $root.lang.array
 *   $: jQuery
 * exports:
 * - Form
 * - toJSON
 * files:
 * - src/browser/form.js
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('browser/form',['lang/type','lang/arguments','lang/string','lang/array','jQuery'], factory);
    } else {
        var exports = $root._createNS('$root.browser.form');
        factory($root.lang.type,$root.lang.arguments,$root.lang.string,$root.lang.array,jQuery,exports);
    }
}(this, function (_type,_argument,_str,_ary,$,exports) {
    //'use strict';
    exports = exports || {};
    
        ///vars
    var varArg = _argument.varArg;
    
    ///helper
    
    
    ///impl
    var Form = _type.create('Form', jQuery, {
      init: function(form, options) {
        this.options = options;
      },
      validate: function() {
        var elements = this[0].elements;
        //TODO:sort elements against data-validate-order
        _ary.forEach(elements, function(item){
          var control = $(item),
            pattern = control.data(options.validate);
        });
      }
    }).statics({
      CreateOption: function() {
        return {
    
        };
      },
      defaultErrorPrompt: function(inputElement, errorMessage){
        alert(errorMessage);
      }
    });
    
    
    ///exports
    
    exports['Form'] = Form;
//     exports['toJSON'] = toJSON;
    exports.__doc__ = "Form";
    return exports;
}));
//end of $root.browser.form
