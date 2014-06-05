/**
 * #SpinEdit#
 * ========
 * - Dependencies: `lang/type`,`lang/string`,`lang/number`,`lang/fn`,`lang/arguments`,`browser/template`,`ui/textField`,`jquery`,`jQueryExt`
 * - Version: 0.0.1
 */

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('ui/spinEdit', ['lang/type', 'lang/string', 'lang/number', 'lang/fn', 'lang/arguments', 'browser/template', 'ui/textField', 'jquery', 'jQueryExt'], factory);
    } else if (typeof module === 'object') {
        var $root_lang_type = require('lang/type'),
            $root_lang_string = require('lang/string'),
            $root_lang_number = require('lang/number'),
            $root_lang_fn = require('lang/fn'),
            $root_lang_arguments = require('lang/arguments'),
            $root_browser_template = require('browser/template'),
            $root_ui_textField = require('ui/textField'),
            jquery = require('jquery'),
            jQueryExt = require('jQueryExt');
        module.exports = factory($root_lang_type, $root_lang_string, $root_lang_number, $root_lang_fn, $root_lang_arguments, $root_browser_template, $root_ui_textField, jquery, jQueryExt, exports, module, require);
    } else {
        var exports = $root._createNS('$root.ui.spinEdit');
        factory($root.lang.type, $root.lang.string, $root.lang.number, $root.lang.fn, $root.lang.arguments, $root.browser.template, $root.ui.textField, jQuery, jQueryExt, exports);
    }
}(this, function(_type, _str, _number, _fn, _arguments, _tpl, _tf, $, jqe, exports) {
    'use strict';
    exports = exports || {};
    _tpl
        .set('$root.ui.SpinEdit.SpinEdit',"<div class=\"ui-spinedit\">\n        </div>\n")
        .set('$root.ui.SpinEdit.SpinButton',"<span class=\"ui-spinbutton\"><a href=\"javascript:;\" class=\"spin-button dec-button\"></a><a href=\"javascript:;\" class=\"spin-button inc-button\"></a></span>\n");
    var tpl = _tpl.id$('$root.ui.SpinEdit'),
        TextField = _tf.TextField,
        varArg = _arguments.varArg;
    
    /**
     * Spin Button
     */
    var SpinButton = _type.create('$root.ui.SpinButton', jQuery, {
        init: function(opts) {
            var opts = SpinButton.options(opts || {});
            this.base.call(this, tpl('SpinButton'));
            SpinButton_initialize(this, opts);
        }
    }).options({
        style: 'updown',
        containerClassName: 'ui-spinbutton',
        buttonClassName: 'spin-button'
    }).events({
        OnButtonClicked: 'ButtonClicked(event,delta).SpinButton'
    }).statics({
        Style: {
            UpDown: 'updown',
            MinusPlus: 'minusplus'
        }
    });
    
    function SpinButton_initialize(self, opts) {
        self.delegate('.' + opts.buttonClassName, 'mouseup', function(e) {
            var index = $(this).index(),
                delta = index === 0 ? 1 : -1;
            self.trigger(SpinButton.Events.OnButtonClicked, [delta]);
            return false;
        });
    }
    
    /**
     * Spin Edit
     */
    var SpinEdit = _type.create('$root.ui.SpinEdit', jQuery, {
        init: function(opts) {
            opts = SpinEdit.options(opts || {});
            this.base(opts.container || SpinEdit.Template.DefaultTemplate);
            var sel = this.sigil('.button', true);
            this.$attr('options', opts);
            this.$attr('buttons', this.find(sel));
    
            var tf = new TextField();
            this.prepend(tf);
            this.$attr('textfield', tf);
    
            var sb = new SpinButton({
                style: 'updown'
            });
            this.append(sb);
            this.$attr('buttons', sb);
            SpinEdit_initialize(this, opts);
        }
    }).options({
        onSetVal: null,
        value: 0,
        maxValue: 10,
        container: null,
        cycle: true
    }).events({
        OnChanged: 'ButtonClicked(event,text,index,delta).SpinEdit'
    }).statics({
        Template: {
            DefaultTemplate: tpl('SpinEdit')
        }
    });
    
    function SpinEdit_initialize(self, opts) {
        var tf = self.$get('textfield');
    
        if (typeof opts.onSetVal != 'function') {
            opts.onSetVal = _fn.return1st;
        }
    
        if (typeof opts.value != 'undefined') {
            tf.val(opts.onSetVal(opts.value));
        }
    
        if (typeof opts.maxValue == 'undefined') {
            throw new Error('options.maxValue must provide');
        }
    
        self.buttons.on(SpinButton.Events.OnButtonClicked, function(e, delta) {
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

    if (!SpinButton.Sigils) SpinButton.Sigils = {};
    SpinButton.Sigils[".decrease"] = ".dec-button";
    SpinButton.Sigils[".increase"] = ".inc-button";

    exports['SpinEdit'] = SpinEdit;
    exports['SpinButton'] = SpinButton;
    exports.__doc__ = "SpinEdit";
    exports.VERSION = '0.0.1';
    return exports;
}));
//end of $root.ui.spinEdit
