({
    description: "Base class for all UI controls",
    namespace: $root.ui.UIControl,
    imports: {
        _type: $root.lang.type,
        $: jQuery
    },
    exports: [UIControl]
});

var UIControl = type.create('UIControl', {
    initialize: function(options) {
        var clazz = this.getClass();
        UIControl.all[clazz.typename()] = clazz;
    },
    getOptions: function() {
        return {};
    },
    parentControl: function() {
        return null;
    }
}).statics({
    all: {}
});