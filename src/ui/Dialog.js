({
    description: 'Dialog',
    namespace: $root.ui.dialog,
    imports: {
        _type: $root.lang.type,
        _array: $root.lang.array,
        _enum: $root.lang.enumerable,
        _tpl: $root.browser.template,
        _arguments: $root.lang.arguments,
        _drag: $root.ui.draggable,
        _overlay: $root.ui.overlay,
        $: jQuery
    },
    exports: [
        Dialog,
        Alert,
        alert,
        Notice,
        notice
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
var Dialog = _type.create('$root.ui.dialog.Dialog', jQuery, {
    init: function(options) {
        //if(!options) return this;
        this.options = options || {};
        this.base(Dialog.Template.DefaultTemplate || options.template);
        this.$attr('header', this.sigil('.header'));
        this.$attr('body', this.sigil('.body'));
        this.$attr('footer', this.sigil('.footer'));
        this.$attr('buttons', this.sigil('.button'));
        Dialog_initialize(this, this.options);
    },
    showAt: function() {
        var parent = this.parent();
        if (!parent.length || parent.height() === 0 || parent.width() === 0) {
            parent = $(window);
        }
        varArg(arguments, this)
            .when(function() {
                return [parent, this.css('left'), this.css('top')];
            })
            .same(['string'], ['int', 'string'], ['string', 'int'], function(xpos, ypos) {
                this.data('showAt', [xpos, ypos]);
                var coord = Dialog_getShowPosition(this, xpos, ypos);
                coord.unshift(parent);
                return coord;
            })
            .when('int', 'int', function(x, y) {
                return [parent, x, y];
            })
            .when('int', function(x) {
                return [parent, x, this.css('top')];
            })
            .when('jquery', 'int', 'int', function(parent, x, y) {
                return [parent, x || 0, y || 0];
            })
            .invoke(function(parent, x, y) {
                this.trigger(Dialog.Events.OnShowAt, [x, y]);
                parent = this.parent();
                if (parent.length === 0) {
                    parent = document.body;
                }
                this.css({
                    left: x,
                    top: y
                }).appendTo(parent).show();
            });
        return this;
    },
    remove: function() {
        var mask = this.$get('mask');
        if (mask) mask.remove();
        this.base();
        return this;
    },
    setHeader: function(arg) {
        return Dialog_setPart(this, 'header', arg);
    },
    setBody: function(arg) {
        return Dialog_setPart(this, 'body', arg);
    },
    setFooter: function(arg) {
        return Dialog_setPart(this, 'footer', arg);
    },
    bringToFront: function() {
        return Dialog_setLayerPosition(this, 'front');
    },
    sendToBack: function() {
        return Dialog_setLayerPosition(this, 'back');
    },
    setDraggable: function(isDraggable) {
        var draggable = _drag.isDraggable(this.header);
        if (draggable == null) return this;

        if (typeof isDraggable == 'undefined') {
            isDraggable = true;
        }
        if (isDraggable) {
            draggable.enable();
        } else {
            draggable.disable();
        }
        return this;
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
                _array.forEach(captions, function(arg) {
                    var btn = Dialog_createButton(arg);
                    btn.appendTo(footer);
                });
            });
        return this.$attr('buttons', this.sigil('.button'));
    }
}).aliases({
    setTitle: 'setHeader',
    setContent: 'setBody',
    close: 'remove'
}).statics({
    Template: {
        DefaultTemplate: tpl('dialog'),
        DefaultButton: tpl('alertButton')
    },
    Text: {
        OK: 'OK',
        Cancel: 'Cancel'
    },
    Position: {
        Center: 'center',
        GoldenRation: 'golden'
    }
}).events({
    OnShowAt: 'ShowAt(event,x,y).Dialog',
    OnRemove: 'remove',
    OnButtonClick: 'ButtonClick(event,buttonIndex,buttonCaption).Dialog'
});

function Dialog_createButton() {
    var button;
    varArg(arguments)
        .when('plainObject', function(config) {
            button = $(config.template || Dialog.Template.DefaultButton);
            button.text(config.caption);
            if (config.css) button.css(config.css);
            _enum.each(config.data, function(k, v) {
                button.data(k, v);
            });
        })
        .when('*', function(cap) {
            button = $(Dialog.Template.DefaultButton);
            button.text(String(cap));
        })
        .resolve();
    return button;
}

function Dialog_initialize(self, opts) {
    self.addClass('ui-generic-dialog');
    _drag.draggable(self.header, self);

    if (opts.content) {
        self.setContent(opts.content);
    }

    //register OnClose event handler if provided in create options
    if (_type.isFunction(self.options.onClose)) {
        self.on(Dialog.Events.OnClose, self.options.onClose);
    }

    //bring dialog to front when active
    self.on('mousedown', function(e) {
        var target = e.target;
        //ignore mousedown on footer and it's children
        if (self.footer[0] == target || self.footer.find(e.target).length) return;

        //otherwise, bringToFron will make buttons unclickable
        self.bringToFront();
    });

    //delegate button click event
    var selector = self.sigil('.button', true);
    self.delegate(selector, 'click', function(e) {
        var button = $(e.target),
            buttons = self.sigil('.button'),
            index = buttons.index(button[0]),
            caption = button.text(),
            action = button.data('action');

        self.trigger(Dialog.Events.OnButtonClick, [index, caption]);
        if (action == 'ok' || action == 'cancel') {
            self.close();
        }
    });

    if ( !! opts.mask) {
        self.$attr('mask', _overlay.Mask.create());
        self.mask.appendTo('body').click(function() {
            self.close();
        }).before(self);
    }

    if ( !! opts.autoReposition) {
        $(window).on('resize', function() {
            var pos = self.data('showAt'),
                coord = Dialog_getShowPosition(self, pos[0], pos[1]);
            self.css({
                left: coord[0],
                top: coord[1]
            });
        });
    }
    if ( !! opts.closeWhenLostFocus) {
        setTimeout(function() {
            $(document).click(function(e) {
                if (!self.find(e.target).length) self.remove();
            });
        }, 0);
    }
}

function Dialog_getShowPosition(self, xpos, ypos) {
    var x = xpos,
        w,
        y = ypos,
        h,
        dim = self.dimension(),
        Center = Dialog.Position.Center,
        GoldenRation = Dialog.Position.GoldenRation,
        parent = self.parent();
    if (typeof ypos == 'undefined') {
        ypos = Center;
    }
    if (xpos == Center || xpos == GoldenRation) {
        w = parent.width();
        x = w / 2 - dim.width / 2;
    }
    if (ypos == Center || ypos == GoldenRation) {
        h = parent.height();
        y = h / 2 - dim.height / 2;
    }
    if (xpos == GoldenRation || ypos == GoldenRation) {
        y = y * 0.618;
    }
    return [x, y];
}

function Dialog_setPart(self, whichPart) {
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

function Dialog_setLayerPosition(self, frontOrBack) {
    var sel = self.sigil('.dialog', true),
        parent = self.parent(),
        dialogs = parent.find(sel);
    if (!dialogs.length) return self;
    if (frontOrBack == 'front') {
        self.appendTo(parent);
    } else if (frontOrBack == 'back') {
        self.prependTo(parent);
    }
    return self;
}

/**
 * Alert Dialog
 */
var Alert = Dialog.extend('$root.ui.dialog.Alert', {
    init: function(options) {
        var opts = this.options = options || {};
        this.base.apply(this, arguments);
        this.header.text(opts.title || '');
        Alert_initialize(this, opts);
    }
});

function Alert_initialize(self, opts) {
    //if no buttons specified, create a default 'OK' button
    var button;
    if (!opts.buttons && self.buttons.length === 0) {
        self.setButtons(Dialog.Text.OK);
    } else {
        self.setButtons(opts.buttons);
    }
    self.addClass('ui-dialog-alert');
}


Alert.create = function() {
    return varArg(arguments, this)
        .when('*', function(content) {
            return ['', content, null, null];
        })
        .when('*', 'function', function(content, fn) {
            return ['', content, fn, null];
        })
        .when('*', '*', function(title, content) {
            return [title, content, null, null];
        })
        .when('*', '*', 'function', function(title, content, fn) {
            return [title, content, fn, null];
        })
        .when('*', 'plainObject', function(content, opts) {
            return ['', content, null, opts];
        })
        .when(function() {
            return [location.host, undefined, null, null];
        })
        .otherwise(function() {
            return [location.host, undefined, null, null];
        })
        .invoke(function(title, content, onClose, options) {
            options = options || {};
            options.title = String(title);
            options.content = String(content);
            options.onClose = onClose;
            return new Alert(options);
        });
};

var alertSingleton = null;

function alert() {
    if (alertSingleton) {
        alertSingleton.close().remove();
        alertSingleton = null;
    }
    alertSingleton = Alert.create.apply(null, arguments);
    alertSingleton.showAt(Dialog.Position.GoldenRation).on(Dialog.Events.OnButtonClick, function() {
        alertSingleton.close();
    }).setDraggable(false);
    return alertSingleton;
}

/**
 * Notice
 */
var Notice = Dialog.extend('$root.ui.dialog.Notice', {
    init: function(options) {
        this.$attr('options', options || {});
        this.base.apply(this, arguments);
        this.header.remove();
        this.footer.remove();
        this.addClass('ui-dialog-notice');
        Notice_initialize(this, options);
    },
    showAt: function() {
        var self = this,
            opts = this.$get('options');
        this.base.apply(this, arguments);
        setTimeout(function() {
            self.remove();
        }, opts.duration || 2000);
        return this;
    }
}).events({

}).statics({
    Values: {

    },
    DefaultOptions: {
        Type: 'info'
    }
});

function Notice_initialize(self, opts) {
    self.body.click(function() {
        self.remove();
    });
}

function notice(content, duration, opts) {
    var n;
    opts = opts || {};
    opts.duration = duration;
    opts.content = content;
    n = new Notice(opts);
    n.showAt(Dialog.Position.GoldenRation)
        .appendTo('body');
    return notice;
}