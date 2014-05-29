({
    description: 'SpinEdit',
    namespace: $root.ui.spinEdit,
    directory: 'ui/SpinEdit',
    imports: {
        _type: $root.lang.type,
        _str: $root.lang.string,
        _number: $root.lang.number,
        _fn: $root.lang.fn,
        _arguments: $root.lang.arguments,
        _tpl: $root.browser.template,
        _tf: $root.ui.textField,
        $: jQuery
    },
    exports: [
        SpinEdit,
        SpinButton
    ]
});

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