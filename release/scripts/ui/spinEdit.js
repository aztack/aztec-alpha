/**
 * ---
 * description: SpinEdit
 * namespace: $root.ui.spinEdit
 * directory: ui/SpinEdit
 * imports:
 *   _type: $root.lang.type
 *   _str: $root.lang.string
 *   _number: $root.lang.number
 *   _fn: $root.lang.fn
 *   _arguments: $root.lang.arguments
 *   _tpl: $root.browser.template
 *   _tf: $root.ui.textField
 *   $: jQuery
 * exports:
 * - SpinEdit
 * files:
 * - src/ui/SpinEdit/SpinEdit.js
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('ui/spinEdit',['lang/type','lang/string','lang/number','lang/fn','lang/arguments','browser/template','ui/textField','jQuery'], factory);
    } else {
        var exports = $root._createNS('$root.ui.spinEdit');
        factory($root.lang.type,$root.lang.string,$root.lang.number,$root.lang.fn,$root.lang.arguments,$root.browser.template,$root.ui.textField,jQuery,exports);
    }
}(this, function (_type,_str,_number,_fn,_arguments,_tpl,_tf,$,exports) {
    //'use strict';
    exports = exports || {};
    _tpl
        .set('$root.ui.SpinEdit.SpinEdit',"<div class=\"ui-spinedit\"><ul class=\"buttons\">\n<li class=\"button\">&uarr;</li>\n<li class=\"button\">&darr;</li>\n</ul></div>\n");
        var tpl = _tpl.id$('$root.ui.SpinEdit'),
        TextField = _tf.TextField,
        varArg = _arguments.varArg;
    
    var SpinEdit = _type.create('$root.ui.SpinEdit', jQuery, {
        init: function(options) {
            options = options || {};
            this.base(options.container || SpinEdit.Template.DefaultTemplate);
            var sel = this.sigil('.button', true);
            this.$attr('options', options);
            this.$attr('buttons', this.find(sel));
    
            var tf = new TextField();
            this.prepend(tf);
            this.$attr('textfield', tf);
            SpinEdit_initialize(this, options);
        }
    }).events({
        OnChanged: 'ButtonClicked(event,text,index,delta).SpinEdit'
    }).statics({
        Template: {
            DefaultTemplate: tpl('SpinEdit')
        }
    });
    
    function SpinEdit_initialize(self, opts) {
        var tf = self.$get('textfield'),
            sel = self.sigil('.button', true);
    
        if (typeof opts.onSetVal != 'function') {
            opts.onSetVal = _fn.return1st;
        }
    
        if (typeof opts.value != 'undefined') {
            tf.val(opts.onSetVal(opts.value));
        }
    
        if (typeof opts.maxValue == 'undefined') {
            throw new Error('options.maxValue must provide');
        }
    
        self.delegate(sel, 'click', function(e) {
            var index = self.buttons.index(e.target),
                delta = index === 0 ? 1 : -1,
                ret = SpinEdit_setVal(self, opts, delta, tf);
            self.trigger(SpinEdit.Events.OnChanged, ret.concat([e.target, delta]));
        });
    
        tf.on('mousewheel', function(e) {
            var delta = e.deltaY > 0 ? 1 : -1,
                ret = SpinEdit_setVal(self, opts, delta, tf);
            self.trigger(SpinEdit.Events.OnChanged, ret.concat([e.target, delta]));
        });
    }
    
    function SpinEdit_setVal(self, opts, delta, tf) {
        var val = tf.val(),
            num = tf.data('index'),
            max = opts.maxValue || 100,
            min = opts.minValue || 0,
            newVal;
        if (isNaN(num)) {
            num = min;
        }
        num += delta;
        num = _number.confined(num, max, min, opts.cycle);
        newVal = opts.onSetVal(num);
        tf.val(newVal).data('index', num);
        return [newVal, num];
    }
        
    ///sigils
    if (!SpinEdit.Sigils) SpinEdit.Sigils = {};
    SpinEdit.Sigils[".button"] = ".button";

    exports['SpinEdit'] = SpinEdit;
    exports.__doc__ = "SpinEdit";
    return exports;
}));
//end of $root.ui.spinEdit
