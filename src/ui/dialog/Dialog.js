({
    description: 'Dialog',
    namespace: $root.ui.Dialog,
    imports: {
        _type: $root.lang.type,
        _array: $root.lang.array,
        _str: $root.lang.string,
        _tpl: $root.browser.template,
        _arguments: $root.lang.arguments,
        _drag: $root.ui.draggable,
        $: jQuery
    },
    exports: [
        GenericDialog,
        Alert
    ]
});

///vars
var varArg = _arguments.varArg,
    tpl = _tpl.id$('$root.ui.Dialog');

/**
 * Generic Dialog
 *     contains only empty header,body,footer
 *     can not be dragged
 *     extends this class to implements your own dialog
 */
var GenericDialog = _type.create('GenericDialog', jQuery, {
    init: function(options) {
        //if(!options) return this;
        this.options = options || {};
        this.base(GenericDialog.DefaultTemplate);
        this.header = this.sigil('.header');
        this.body = this.sigil('.body');
        this.footer = this.sigil('.footer');
    },
    showAt: function() {
        var parent = this.parent();
        if (!parent.length) {
            parent = this.offsetParent();
        }
        varArg(arguments, this)
            .when(function() {
                return [parent, this.css('left'), this.css('top')];
            })
            .when('int', function(x) {
                return [parent, x, this.css('top')];
            })
            .when('int', 'int', function(x, y) {
                return [parent, x, y];
            })
            .when('jquery', 'int', 'int', function(parent, x, y) {
                return [parent, x || 0, y || 0];
            })
            .invoke(function(parent, x, y) {
                this.trigger(GenericDialog.Events.OnShowAt, [x, y]);
                this.css({
                    left: x,
                    top: y
                }).appendTo(parent).show();
            });
        return this;
    },
    close: function() {
        this.trigger(GenericDialog.Events.OnClose, [this]);
        return this.hide();
    },
    setHeader: function(arg) {
        return GenericDialog_setPart(this, 'header', arg);
    },
    setBody: function(arg) {
        return GenericDialog_setPart(this, 'body', arg);
    },
    setFooter: function(arg) {
        return GenericDialog_setPart(this, 'footer', arg);
    }
}).statics({
    DefaultTemplate: tpl('dialog'),
    Events: {
        OnShowAt: 'OnShowAt.Dialog',
        OnClose: 'OnClose.Dialog'
    },
    CreateOptions: function() {
        return {
            title: 'untitled'
        };
    }
});

function GenericDialog_setPart(self, whichPart) {
    var part = self[whichPart];
    if (!part || part.length === 0) {
        return self;
    }
    var args = _arguments.toArray(arguments).slice(2);
    varArg(args, this)
        .when('htmlFragment', function(html) {
            part.html(html);
        })
        .when('string', function(text) {
            part.text(text);
        })
        .when('*', function(anything) {
            part.text(String(anything));
        })
        .resolve();
    return self;
}

/**
 * Alert Dialog
 */
var Alert = _type.create('Alert', GenericDialog, {
    init: function(options) {
        //if(!options) return this;
        this.options = options || {};
        this.base.apply(this, arguments);
        this.header.text(this.options.title || '');
        this.buttons = this.sigil('.button');
        Alert_initialize(this);
    },
    setButtons: function() {
        var args = _arguments.toArray(arguments),
            footer = this.footer;
        varArg(args, this)
            .when('array', function(a) {
                return [a];
            })
            .invoke(function(captions) {
                captions = captions || args;
                footer.empty();
                _array.forEach(captions, function(cap) {
                    var button = $(Alert.Template.DefaultButton);
                    button.text(cap).appendTo(footer);
                });
            });
        this.buttons = this.sigil('.button', true);
        return this;
    }
}).aliases({
    setTitle: 'setHeader',
    setContent: 'setBody'
}).statics({
    Template: {
        DefaultButton: tpl('alertButton')
    },
    Text: {
        OK: 'OK',
        Cancel: 'Cancel'
    },
    Events: $.extend({
        OnButtonClick: 'OnButtonClick.Alert'
    }, GenericDialog.Events)
});

function Alert_initialize(self) {
    //if no buttons specified, create a default 'OK' button
    var button, opts = self.options;
    if (!opts.buttons && self.buttons.length === 0) {
        button = $(Alert.Template.DefaultButton);
        button.text(Alert.Text.OK);
        self.footer.append(button);
    } else {
        self.setButtons(opts.buttons);
    }

    //register OnClose event handler if provided in create options
    if (_type.isFunction(self.options.onClose)) {
        self.on(Alert.Events.OnClose, self.options.onClose);
    }

    //delegate button click event
    var selector = self.sigil('.button', true);
    self.footer.delegate(selector, 'click', function(e) {
        var button = $(e.target),
            buttons = self.sigil('.button'),
            index = buttons.index(button[0]),
            caption = button.text();
        //trigger event after close so that we can re-open this dialog in event handler
        self.close().trigger(Alert.Events.OnButtonClick, [index, caption]);
    });

    //make dialog dragged with it's title bar
    _drag.draggable(self.header, self);
    return self;
}