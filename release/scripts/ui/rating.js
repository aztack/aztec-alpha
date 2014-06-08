/**
 * #Rating#
 * ======
 * - Dependencies: `lang/type`,`lang/fn`,`lang/enumerable`,`browser/template`,`lang/arguments`,`ui/List`,`jquery`,`jQueryExt`
 * - Version: 0.0.1
 */

(function(global, factory) {
    if (typeof define === 'function' && define.amd) {
        define('ui/rating', ['lang/type', 'lang/fn', 'lang/enumerable', 'browser/template', 'lang/arguments', 'ui/List', 'jquery', 'jQueryExt'], factory);
    } else {
        var $root = global.$root,
            exports = $root._createNS('$root.ui.rating');
        factory($root.lang.type, $root.lang.fn, $root.lang.enumerable, $root.browser.template, $root.lang.arguments, $root.ui.List, jQuery, jQueryExt, exports);
    }
}(this, function(_type, _fn, _enum, _tpl, _arguments, _list, $, jqe, exports) {
    'use strict';
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
