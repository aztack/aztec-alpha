/**
 * #Form#
 * ====
 * - Dependencies: `lang/type`,`lang/arguments`,`lang/string`,`lang/array`,`jquery`
 * - Version: 0.0.1
 */

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('browser/form', ['lang/type', 'lang/arguments', 'lang/string', 'lang/array', 'jquery'], factory);
    } else if (typeof module === 'object') {
        var $root_lang_type = require('lang/type'),
            $root_lang_arguments = require('lang/arguments'),
            $root_lang_string = require('lang/string'),
            $root_lang_array = require('lang/array'),
            jquery = require('jquery');
        module.exports = factory($root_lang_type, $root_lang_arguments, $root_lang_string, $root_lang_array, jquery, exports, module, require);
    } else {
        var exports = $root._createNS('$root.browser.form');
        factory($root.lang.type, $root.lang.arguments, $root.lang.string, $root.lang.array, jQuery, exports);
    }
}(this, function(_type, _argument, _str, _ary, $, exports) {
    'use strict';
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
    exports.VERSION = '0.0.1';
    return exports;
}));
//end of $root.browser.form
