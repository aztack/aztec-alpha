({
    description: 'jQuery Sigil Extension',
    namespace: jQuery,
    notransform: true
});

jQuery.typename = function() {
    return 'jQuery';
};

var selectorsCache = jQuery.__selectorsCache__ = {};

function getSelectorInInheritanceChain(obj,clazz, sigil) {
    clazz = clazz || obj.getClass();
    var sigils = clazz.sigils,
        selector = sigils[sigil];
    while (!selector && typeof clazz.parent == 'function') {
        clazz = clazz.parent();
        if (!clazz) break;
        sigils = clazz.sigils;
        selector = sigils[sigil];
        if(selector) break;
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
                if(selector) selectorsCache[hashkey] = selector;
            }
            if (selector) {
                return returnSelector ? selector : this.find(selector);
            }

        }
        return returnSelector ? sigil: this.find(sigil);
    };
}