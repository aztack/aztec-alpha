({
    description: 'jQuery Sigil Extension',
    namespace: jQuery,
    imports: {
        _type: $root.lang.type,
        _object: $root.lang.object
    },
    notransform: true,
    priority: 1
});
(function() {

    jQuery.typename = function() {
        return 'jQuery';
    };

    var selectorsCache = jQuery.__selectorsCache__ = {};

    function getSelectorInInheritanceChain(obj, clazz, sigil) {
        clazz = clazz || obj.getClass();
        var sigils = clazz.sigils,
            selector;
        if (sigils) selector = sigils[sigil];
        while (!selector && typeof clazz.parent == 'function') {
            clazz = clazz.parent();
            if (!clazz) break;
            sigils = clazz.sigils;
            if (sigils) selector = sigils[sigil];
            if (selector) break;
        }
        return selector;
    }

    if (typeof jQuery !== 'undefined') {
        jQuery.fn.sigil = function(sigil, returnSelector) {
            var clazz, selector, typename, hashkey;
            if (typeof this.getClass == 'function') {
                clazz = this.getClass();
                typename = clazz.typename();
                hashkey = typename + ':' + sigil;
                selector = selectorsCache[hashkey];
                if (!selector) {
                    selector = getSelectorInInheritanceChain(this, clazz, sigil);
                    if (selector) selectorsCache[hashkey] = selector;
                }
                if (selector) {
                    return returnSelector ? selector : this.find(selector);
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

        jQuery.fn.opts = function(path) {
            return _object.tryget(path, this.options || {});
        };

        function extractCreateOptions(ele, prefix) {
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
        }

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
            require('$root.' + typenamePath, function(clazz) {
                var instance = !_type.isFunction(clazz.create) ?
                    null : clazz.create(extractCreateOptions(ele, opts.prefix || 'az'));
                if (callback) callback(instance);
            });
        };
    } //we have jQuery
})();