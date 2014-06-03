/**
 * jQuery Sigil Extension
 * ----------------------
 * Dependencies: lang/type,lang/object
 */

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('jQueryExt', ['lang/type', 'lang/object'], factory);
    } else if (typeof module === 'object') {
        var $root_lang_type = require('lang/type'),
            $root_lang_object = require('lang/object');
        module.exports = factory($root_lang_type, $root_lang_object, exports, module, require);
    } else {
        var exports = $root._createNS('jQueryExt');
        factory($root.lang.type, $root.lang.object, exports);
    }
}(this, function(_type, _object, exports) {
    'use strict';
    exports = exports || {};
    
jQuery.typename = function() {
    return 'jQuery';
};

var selectorsCache = jQuery.__selectorsCache__ = {};

function getSelectorInInheritanceChain(obj, clazz, sigil) {
    clazz = clazz || obj.$getClass();
    var sigils = clazz.Sigils,
        selector;
    if (sigils) selector = sigils[sigil];
    while (!selector && typeof clazz.parent == 'function') {
        clazz = clazz.parent();
        if (!clazz) break;
        sigils = clazz.Sigils;
        if (sigils) selector = sigils[sigil];
        if (selector) break;
    }
    return selector;
}

if (typeof jQuery !== 'undefined') {
    jQuery.fn.sigil = function(sigil, returnSelector) {
        var clazz, selector, typename, hashkey, sels, obj, parent;
        if (typeof this.$getClass == 'function') {
            clazz = this.$getClass();
            typename = clazz.typename();
            hashkey = typename + ':' + sigil;
            selector = selectorsCache[hashkey];
            if (!selector) {
                selector = getSelectorInInheritanceChain(this, clazz, sigil);
                if (selector) selectorsCache[hashkey] = selector;
            }
            if (selector) {
                if (selector.indexOf('|') > 0) {
                    sels = selector.split('|');
                    if (returnSelector) {
                        return sels[0];
                    } else {
                        for (var i = 0; i === sels.length; ++i) {
                            obj = this.find(sels[i]);
                            if (obj.length > 0) return obj;
                        }
                    }
                } else {
                    return returnSelector ? selector : this.find(selector);
                }
            }

        }
        return returnSelector ? sigil : this.find(sigil);
    };

    /**
     * jQuery - Get Width of Element when Not Visible (Display: None)
     * http://stackoverflow.com/questions/1472303/jquery-get-width-of-element-when-not-visible-display-none
     */
    var props = {
        position: "absolute",
        visibility: "hidden",
        display: "block"
    };

    jQuery.fn.dimension = function() {
        var parent = this.parent(),
            self = this,
            dim = {
                width: 0,
                height: 0
            };
        if (!this.length) return dim;
        if (!parent.length) this.appendTo('body');
        $.swap(this[0], props, function() {
            dim.width = self.width();
            dim.height = self.height();
        });
        return dim;
    };

    var extractCreateOptions = function(ele, prefix) {
        var optionsFromAttributes = {},
            attrs = ele.attributes,
            name, path, attrNode;

        //gather creat options from element's attributes
        for (var i in attrs) {
            attrNode = attrs[i];
            name = attrNode.name;
            if (name.indexOf(prefix) < 0) continue;
            path = name.replace(prefix + '-', '').replace('-', '.');
            _object.tryset(optionsFromAttributes, path, attrNode.value);
        }
    };

    /**
     * create $root.ui.* class instance from attributed dom element
     * @param  {HTMLElement} ele
     * @return {jQuery}
     */
    jQuery.fromElement = function(ele, callback, opts) {
        var typenamePath = ele.getAttribute('az-typename');
        if (!_type.isElement(ele)) {
            throw Error('fromElement need first parameter to be a HTMLElement');
        } else if (!typenamePath) {
            return jQuery(ele);
        }
        if (ele.attributes.length === 0) return jQuery(ele);
        opts = opts || {};

        //TODO: aync loading
        require(typenamePath, function(clazz) {
            var instance = !_type.isFunction(clazz.create) ?
                null : clazz.create(extractCreateOptions(ele, opts.prefix || 'az'));
            if (callback) callback(instance);
            instance.removeAttr('az-typename');
        });
    };

    /**
     * add show/hide/remove events for jQuery
     */
    var _hide = jQuery.fn.hide;
    jQuery.fn.hide = function() {
        this.trigger('beforehide');
        _hide.apply(this, arguments);
        this.trigger('afterhide');
        return this;
    };

    var _show = jQuery.fn.show;
    jQuery.fn.show = function() {
        this.trigger('beforeshow');
        _show.apply(this, arguments);
        this.trigger('afterremove');
        return this;
    };

    var _remove = jQuery.fn.remove;
    jQuery.fn.remove = function() {
        this.trigger('beforeremove');
        _remove.apply(this, arguments);
        this.trigger('afterremove');
        return this;
    };
} //we have jQuery
    
    
    exports.__doc__ = "jQuery Sigil Extension";
    exports.VERSION = '0.0.1';
    return exports;
}));
//end of jQueryExt
