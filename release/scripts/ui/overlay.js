/**
 * #Overlay#
 * =======
 * - Dependencies: `lang/type`,`browser/template`,`lang/arguments`,`lang/fn`,`jquery`,`jQueryExt`
 * - Version: 0.0.1
 */

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('ui/overlay', ['lang/type', 'browser/template', 'lang/arguments', 'lang/fn', 'jquery', 'jQueryExt'], factory);
    } else if (typeof module === 'object') {
        var $root_lang_type = require('lang/type'),
            $root_browser_template = require('browser/template'),
            $root_lang_arguments = require('lang/arguments'),
            $root_lang_fn = require('lang/fn'),
            jquery = require('jquery'),
            jQueryExt = require('jQueryExt');
        module.exports = factory($root_lang_type, $root_browser_template, $root_lang_arguments, $root_lang_fn, jquery, jQueryExt, exports, module, require);
    } else {
        var exports = $root._createNS('$root.ui.overlay');
        factory($root.lang.type, $root.browser.template, $root.lang.arguments, $root.lang.fn, jQuery, jQueryExt, exports);
    }
}(this, function(_type, _tpl, _arguments, _fn, $, jqe, exports) {
    'use strict';
    exports = exports || {};
    _tpl
        .set('$root.ui.overlay.iframeMask',"<iframe src=\"about:blank\" unselectable=\"on\" tabindex=\"-1\" class=\"ui-overlay\"></iframe>\n")
        .set('$root.ui.overlay.mask',"<div class=\"ui-overlay\" unselectable=\"on\" tabindex=\"-1\"></div>\n");
    var varArg = _arguments.varArg,
        tpl = _tpl.id$('$root.ui.overlay'),
        maskTemplate = tpl('mask');
    
    var Mask = _type.create('$root.ui.overlay.Mask', jQuery, {
        init: function() {
            this.base(maskTemplate);
        },
        setOpacity: function() {
            return varArg(arguments, this)
                .when('float', function(f) {
                    return [f];
                })
                .when('string', function(s) {
                    return [parseFloat(s)];
                })
                .when('*', function(s) {
                    return [parseFloat(String(s))];
                })
                .invoke(function(opacity) {
                    return this.css('opacity', opacity);
                });
        },
        getZIndex: function() {
            return this.css('z-index');
        }
    });
    
    var theMask = null,
        _oldHide, _oldShow, _oldRemove;
    /**
     * ##Mask.getInstance()##
     * @return {Mask}
     */
    Mask.getInstance = function() {
        if (theMask === null) {
            theMask = new Mask();
            _oldHide = theMask.hide;
            _oldShow = theMask.show;
            _oldRemove = theMask.remove;
            theMask.hide = null;
            theMask.hide = function() {
                var args = arguments;
                setTimeout(function() {
                    if ($('.' + Mask.WithMaskClassName + ':visible').length == 0) {
                        _oldHide.apply(theMask, args);
                    }
                }, 0);
                return this;
            };
            theMask.remove = function() {
                var args = arguments;
                setTimeout(function() {
                    if ($('.' + Mask.WithMaskClassName + ':visible').length == 0) {
                        _oldRemove.apply(theMask, args);
                    }
                }, 0);
                return this;
            };
            theMask.show = function() {
                _oldShow.apply(this, arguments);
                return this;
            };
        }
        if (theMask.parent().length === 0) {
            theMask.appendTo('body');
        }
        return theMask;
    };
    
    Mask.WithMaskClassName = 'withmask';
    
    Mask.disposeInstance = function() {
        if (theMask) {
            theMask.remove();
            theMask.$dispose();
            theMask = null;
        }
    };
        
    ///sigils

    exports['Mask'] = Mask;
//     exports['create'] = create;
    exports.__doc__ = "Overlay";
    exports.VERSION = '0.0.1';
    return exports;
}));
//end of $root.ui.overlay
