({
    description: 'jQuery Sigil Extension',
    namespace: jQuery,
    notransform: true
});

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
}