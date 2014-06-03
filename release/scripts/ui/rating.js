/**
 * Rating
 * ------
 * Dependencies: $root.lang.type,$root.lang.fn,$root.lang.enumerable,$root.browser.template,$root.lang.arguments,$root.ui.List,jquery,jQueryExt
 */

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('ui/rating', ['lang/type', 'lang/fn', 'lang/enumerable', 'browser/template', 'lang/arguments', 'ui/List', 'jquery', 'jQueryExt'], factory);
    } else if (typeof module === 'object') {
        var $root_lang_type = require('lang/type'),
            $root_lang_fn = require('lang/fn'),
            $root_lang_enumerable = require('lang/enumerable'),
            $root_browser_template = require('browser/template'),
            $root_lang_arguments = require('lang/arguments'),
            $root_ui_List = require('ui/List'),
            jquery = require('jquery'),
            jQueryExt = require('jQueryExt');
        module.exports = factory($root_lang_type, $root_lang_fn, $root_lang_enumerable, $root_browser_template, $root_lang_arguments, $root_ui_List, jquery, jQueryExt, exports, module, require);
    } else {
        var exports = $root._createNS('$root.ui.rating');
        factory($root.lang.type, $root.lang.fn, $root.lang.enumerable, $root.browser.template, $root.lang.arguments, $root.ui.List, jquery, jQueryExt, exports);
    }
}(this, function(_type, _fn, _enum, _tpl, _arguments, _list, $, jqe, exports) {
    //'use strict';
    exports = exports || {};
    
    ///vars
    var varArg = _arguments.varArg,
        tpl = _tpl.id$('$root.ui.Dialog'),
        List = _list.List;
    
    
    var SimpleRating = _type.create('$root.ui.rating.SimpleRating', List, {
        init: function() {
    
        }
    });
        
    ///sigils

    exports['SimpleRating'] = SimpleRating;
    exports.__doc__ = "Rating";
    exports.VERSION = '0.0.1';
    return exports;
}));
//end of $root.ui.rating
