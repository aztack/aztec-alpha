({
    description: 'Overlay',
    namespace: $root.ui.overlay,
    directory: 'ui/Overlay',
    imports: {
        _type: $root.lang.type,
        _tpl: $root.browser.template,
        _arguments: $root.lang.arguments,
        _fn: $root.lang.fn,
        $: jquery,
        jqe: jQueryExt
    },
    exports: [
        Mask,
        create
    ]
});

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
}).statics({
    WithMaskClassName: 'withmask'
})

var theMask = null,
    _oldHide, _oldShow, _oldRemove,
    visibleMaskSel = '.' + Mask.WithMaskClassName + ':visible';
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
                if ($(visibleMaskSel).length === 0) {
                    _oldHide.apply(theMask, args);
                }
            }, 0);
            return this;
        };
        theMask.remove = function() {
            var args = arguments;
            setTimeout(function() {
                if ($(visibleMaskSel).length === 0) {
                    _oldRemove.apply(theMask, args);
                }
            }, 0);
            return this;
        };
    }
    if (theMask.parent().length === 0) {
        theMask.appendTo('body');
    }
    return theMask;
};

Mask.disposeInstance = function() {
    if (theMask) {
        theMask.remove();
        theMask.$dispose();
        theMask = null;
    }
};