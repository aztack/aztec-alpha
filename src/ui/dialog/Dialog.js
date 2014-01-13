({
    description: 'Dialog',
    namespace: $root.ui.dialog,
    imports: {
        _type: $root.lang.type,
        _str: $root.lang.string,
        _ui: $root.ui,
        $: jQuery
    },
    exports: [
        Dialog
    ]
});

///vars


///helper


///impl
var Dialog = _type.create('Dialog', UIControl, {
    initialize: function(options) {
        this.super();
    }
});
/**
 * main function is called when DOMReady
 */
//function main(){}
//$(main);


///exports