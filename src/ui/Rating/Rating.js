({
    description: 'Rating',
    namespace: $root.ui.rating,
    directory: 'ui/Dialog',
    imports: {
        _type: $root.lang.type,
        _fn: $root.lang.fn,
        _enum: $root.lang.enumerable,
        _tpl: $root.browser.template,
        _arguments: $root.lang.arguments,
        $: jQuery
    },
    exports: [
        SimpleRating
    ]
});

///vars
var varArg = _arguments.varArg,
    tpl = _tpl.id$('$root.ui.Dialog');


var SimpleRating = _type.create('$root.ui.rating.SimpleRating', jQuery, {
    init: function() {

    }
});