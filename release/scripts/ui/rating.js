/**
 * ---
 * description: Rating
 * namespace: $root.ui.rating
 * directory: ui/Dialog
 * imports:
 *   _type: $root.lang.type
 *   _fn: $root.lang.fn
 *   _enum: $root.lang.enumerable
 *   _tpl: $root.browser.template
 *   _arguments: $root.lang.arguments
 *   _list: $root.ui.List
 *   $: jQuery
 * exports:
 * - SimpleRating
 * files:
 * - src/ui/Rating/Rating.js
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('ui/rating',['lang/type','lang/fn','lang/enumerable','browser/template','lang/arguments','ui/List','jQuery'], factory);
    } else {
        var exports = $root._createNS('$root.ui.rating');
        factory($root.lang.type,$root.lang.fn,$root.lang.enumerable,$root.browser.template,$root.lang.arguments,$root.ui.List,jQuery,exports);
    }
}(this, function (_type,_fn,_enum,_tpl,_arguments,_list,$,exports) {
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
    
    exports['SimpleRating'] = SimpleRating;
    exports.__doc__ = "Rating";
    return exports;
}));
//end of $root.ui.rating
