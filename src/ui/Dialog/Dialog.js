({
    description: 'dialogs',
    namespace: $root.ui.dialog,
    directory: 'ui/Dialog',
    imports: {
        _type: $root.lang.type,
        _fn: $root.lang.fn,
        _enum: $root.lang.enumerable,
        _tpl: $root.browser.template,
        _arguments: $root.lang.arguments,
        _drag: $root.ui.draggable,
        _overlay: $root.ui.overlay,
        $: jquery,
        jqe: jQueryExt
    },
    exports: [
        Dialog,
        Alert,
        alert,
        Notice,
        notice
    ]
});
//TODO
//====
//- [x] auto close, timeout
//- [x] drag bug

var varArg = _arguments.varArg,
    tpl = _tpl.id$('$root.ui.Dialog');

/**
 * Dialog
 * ======
 * Generic dialog which contains only empty header,body,footer and can not be dragged.
 * Extends this class to implements your own dialog
 */
var Dialog = _type.create('$root.ui.dialog.Dialog', jQuery, {
    init: function(opts) {
        var options = Dialog.options(opts);
        this.$attr('options', options);
        this.base(this.options.template || Dialog.Template.DefaultTemplate);
        this.$attr('header', this.sigil('.header'));
        this.$attr('body', this.sigil('.body'));
        this.$attr('footer', this.sigil('.footer'));
        this.$attr('buttons', this.sigil('.button'));
        Dialog_initialize(this, options);
    },
    /**
     * ##Dialog\#show()##
     * if dialog is not in DOM append it to body
     * if dialog is hidden, show it
     * @return {Dialog} dialog
     */
    show: function() {
        if (!this.parent().length) {
            this.appendTo('body');
        }
        if (this.options.mask) _overlay.Mask.getInstance().show();
        this.base.apply(this, arguments);
        return this;
    },
    hide: function() {
        //prevent call mask.hide when dialog is already hidden
        if (!this.is(':visible')) return this;
        if (this.options.mask) _overlay.Mask.getInstance().hide();
        this.base.apply(this, arguments);
        return this;
    },
    /**
     * ##Dialog\#showAt()##
     * ###Dialog\#showAt(xpos[, ypos])###
     * ###Dialog\#showAt(parent, xpos, ypox)###
     * Show dialog at given position
     * @param {Integer|Position} xpos
     * @param {Integer|Position} ypos
     * @param {Selector|HTMLElement} parent
     * @return {Dialog} dialog
     *
     * ```javascript
     * dialog.showAt(100,100);
     * dialog.showAt(Dialog.Position.GoldenRatio);
     * dialog.showAt(parent,Dialog.Position.Center);
     * ```
     */
    showAt: function() {
        var parent = this.parent(),
            inDom = parent.length > 0;
        if (!parent.length || parent.height() === 0 || parent.width() === 0) {
            parent = $(window);
        }
        varArg(arguments, this)
            .when(function() {
                return [parent, this.css('left'), this.css('top')];
            })
            .same(['string'], ['number', 'string'], ['string', 'number'], function(xpos, ypos) {
                this.data('showAt', [xpos, ypos]);
                var coord = Dialog_getShowPosition(this, xpos, ypos);
                coord.unshift(parent);
                return coord;
            })
            .when('number', 'number', function(x, y) {
                return [parent, x, y];
            })
            .when('number', function(x) {
                return [parent, x, this.css('top')];
            })
            .when('jquery', 'number', 'number', function(parent, x, y) {
                return [parent, x || 0, y || 0];
            })
            .invoke(function(parent, x, y) {
                parent = parent || this.parent();
                if (parent.length === 0) {
                    parent = document.body;
                }
                this.css({
                    left: x,
                    top: y
                }).appendTo(parent).show();
                if (this.options.mask) _overlay.Mask.getInstance().show();
            });
        return this;
    },
    /**
     * ##Dialog\#remove()##
     * Remove dialog from DOM.
     * Remove mask behide dialog if has
     * @return {Dialog} dialog
     */
    remove: function() {
        if (this.options.mask) _overlay.Mask.getInstance().remove();
        this.base();
        return this;
    },
    /**
     * ##Dialog\#setTitle(title)##
     * @param {String} title, string or html
     * @return {Dialog} dialog
     */
    setTitle: function(title) {
        var titleEle = this.sigil('.dialog-title');
        varArg(arguments, this)
            .when('htmlFragment', function(html) {
                titleEle.html(html);
            })
            .when('*', function(arg) {
                titleEle.text(String(arg));
            })
            .resolve();
        return this;
    },
    /**
     * ##Dialog\#setHeader(string)##
     * ###Dialog\#setHeader(html[,style])###
     */
    setHeader: function() {
        return Dialog_setPart(this, 'header', arguments);
    },
    /**
     * ##Dialog\#setBody(string)##
     * ###Dialog\#setBody(html[,style])###
     */
    setBody: function() {
        return Dialog_setPart(this, 'body', arguments);
    },
    /**
     * ##Dialog\#setFooter(string)##
     * ###Dialog\#setFooter(html[,style])###
     */
    setFooter: function() {
        return Dialog_setPart(this, 'footer', arguments);
    },
    /**
     * ##Dialog\#bringToFront()##
     * make dialog the first child of parent
     * @return {Dialog} dialog
     */
    bringToFront: function() {
        return Dialog_setLayerPosition(this, 'front');
    },
    /**
     * ##Dialog\#sendToBack()##
     * make dialog the last child of parent
     * @return {Dialog} dialog
     */
    sendToBack: function() {
        return Dialog_setLayerPosition(this, 'back');
    },
    /**
     * ##Dialog\#setDraggable(isDraggable)##
     * @param {Boolean} isDraggable
     * @return {Dialog} dialog
     */
    setDraggable: function(isDraggable) {
        var draggable = _drag.isDraggable(this.header),
            opts = this.options;
        if (draggable == null) return this;

        if (typeof isDraggable == 'undefined') {
            isDraggable = true;
        }
        if (isDraggable) {
            draggable.enable();
            opts.draggable = true;
            this.header.css('cursor', 'move');
        } else {
            draggable.disable();
            opts.draggable = false;
            this.header.css('cursor', 'default');
        }
        if (opts.autoReposition && !opts.draggable) {
            Dialog_reposition(this);
        }
        return this;
    },
    /**
     * ##Dialog\#setButtons(array of string)##
     * ###Dialog\#setButtons(array of config)###
     * ###Dialog\#setButtons(text1,...,textN)###
     * ###Dialog\#setButtons(config1,...,configN)###
     * @return {Dialog} dialog
     *
     * ```javascript
     * dialog.setButtons('OK','Cancel');
     * dialog.setButtons(['OK','Cancel']);
     * dialog.setButtons(
     *     {caption:'OK',css:{color:'green'},data:{id:100}},
     *     {caption:'Cancel',css:{color:'red'},data:{id:101}}
     * );
     * ```
     */
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
                _enum.each(captions, function(arg) {
                    var btn = Dialog_createButton(arg);
                    btn.appendTo(footer);
                });
            });
        return this.$attr('buttons', this.sigil('.button'));
    }
}).aliases({
    /**
     * ##Dialog\#setContent()##
     * alias of Dialog#setBody
     */
    setContent: 'setBody',
    /**
     * ##Dialog\#close()##
     * alias of Dialog#setBody
     */
    close: 'hide'
}).options({
    // #Creating Options of Dialog#
    okButtonText: 'OK',
    cancelButtonText: 'Cancel', //default Cancel button text
    buttons: ['OK', 'Cancel'], //default buttons
    draggable: false, //whether dialog is draggble
    closeButton: true, //whether dialog has close button
    autoReposition: true, //whether reposition when window resized
    mask: true, //whether mask screen when dialog show up
    closeWhenLostFocus: false, //whether close dialog when lost focus(click outside dialog)
    content: '', //content of dialog, can be text or html
    title: '', //title of dialog
    position: 'golden' //default position when show
}).statics({
    // #Dialog.Template#
    Template: {
        DefaultTemplate: tpl('dialog'),
        DefaultButton: tpl('button')
    },
    // #Dialog.Position#
    Position: {
        Center: 'center',
        GoldenRatio: 'golden'
    },
    // #Dialog.Parts#
    // Pre-defined Icons
    Parts: {
        IconError: $(tpl('icon')).addClass('error'),
        IconInfo: $(tpl('icon')).addClass('info'),
        IconWarnning: $(tpl('icon')).addClass('warnning'),
        TitleButtonArrowDown: $(tpl('title-button')).addClass('arrow-down')
    }
}).events({
    // Dialog.Events
    // =============
    OnShowAt: 'ShowAt(event,x,y).Dialog',
    OnButtonClicked: 'ButtonClicked(event,buttonIndex,buttonCaption).Dialog',
    OnTitleButtonClicked: 'TitleButtonClicked(event,buttonIndex,button).Dialog'
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

function Dialog_initialize(self) {
    var opts = self.options;
    self.addClass('ui-generic-dialog');

    var draggable;
    opts.draggable = opts.draggable || true;
    if (opts.draggable) {
        draggable = _drag.draggable(self.header, self);
        self.$attr('draggable', draggable);
    } else {
        self.header.css('cursor', 'default');
    }

    if (opts.content) {
        self.setContent(opts.content);
    }

    opts.closeButton = opts.closeButton || true;
    var closeButton = self.sigil('.close-button');
    if (!opts.closeButton) {
        closeButton.remove();
    } else {
        closeButton.on('mouseup', function() {
            _fn.delay(function() {
                self.close();
            }, 0);
        });
    }

    //register OnClose event handler if provided in create options
    if (_type.isFunction(self.options.onClose)) {
        self.on(Dialog.Events.OnClose, self.options.onClose);
    }

    //bring dialog to front when active
    self.header.on('mousedown', function(e) {
        self.bringToFront();
    });

    //delegate button click event
    var buttonSelector = self.sigil('.button', true),
        titleButtonSelector = self.sigil('.title-button', true);
    self.delegate(buttonSelector, 'click', function(e) {
        var button = $(e.target),
            buttons = self.sigil('.button'),
            index = buttons.index(button[0]),
            caption = button.text(),
            action = button.data('action');

        self.trigger(Dialog.Events.OnButtonClicked, [index, caption]);
        if (action == 'ok' || action == 'cancel') {
            self.close();
        }
    }).delegate(titleButtonSelector, 'mouseup', function(e) {
        var button = $(e.target),
            buttons = self.sigil('.title-button'),
            index = buttons.index(button);
        self.trigger(Dialog.Events.OnTitleButtonClicked, [index, button]);
    });

    if (opts.mask) {
        self.addClass(_overlay.Mask.WithMaskClass);
        _overlay.Mask.getInstance().show().before(self);
    }

    $(document).click(function(e) {
        if (!opts.closeWhenLostFocus) return;
        setTimeout(function() {
            if (!self.find(e.target).length) self.remove();
        }, 0);
    });
}


function Dialog_reposition(self) {
    var resizeEvent = 'resize.dialog',
        win = $(window);
    win.off(resizeEvent).on(resizeEvent, function() {
        var coord, pos = self.data('showAt');
        if (!pos) return;
        coord = Dialog_getShowPosition(self, pos[0], pos[1]);
        self.css({
            left: coord[0],
            top: coord[1]
        });
    });
}

function Dialog_getShowPosition(self, xpos, ypos) {
    var w, h, x = xpos,
        y = ypos,
        dim = self.dimension(),
        Center = Dialog.Position.Center,
        GoldenRatio = Dialog.Position.GoldenRatio,
        parent = self.parent()[0];
    if (typeof ypos == 'undefined') {
        ypos = Center;
    }
    if (xpos == Center || xpos == GoldenRatio) {
        w = parent.clientWidth;
        x = w / 2 - dim.width / 2;
        if (x < 0) x = 0;
    }
    if (ypos == Center || ypos == GoldenRatio) {
        h = parent.clientHeight;
        y = h / 2 - dim.height / 2;
        if (y < 0) y = 0;
    }
    if (xpos == GoldenRatio || ypos == GoldenRatio) {
        y = y * 0.618;
    }
    return [x, y];
}


function Dialog_setPart(self, whichPart, args) {
    var part = self[whichPart];
    if (!part || part.length === 0) {
        return self;
    }
    varArg(args, self)
        .when('htmlFragment', function(html) {
            part.html(html);
        })
        .when('string', function(text) {
            part.text(text);
        })
        .when('htmlFragment', 'plainObject', function(html, style) {
            part.html(html).css(style);
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
 * Alert
 * =====
 * Alert is a simple extension of Dialog.
 * With OK,Cancel,Close buttons and simple content
 */
var Alert = Dialog.extend('$root.ui.dialog.Alert', {
    init: function(options) {
        this.base.apply(this, arguments);
        $.extend(this.options, options);
        this.setTitle(this.options.title || '');
        Alert_initialize(this);
    }
});

function Alert_initialize(self) {
    var opts = self.options,
        button;
    //if no buttons specified, create a default 'OK' button
    if (!opts.buttons && self.buttons.length === 0) {
        self.setButtons(opts.okButtonText);
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

/**
 * ##dialog.alert(content)##
 * ##dialog.alert(content, onClose)##
 * ##dialog.alert(title, content, onClose)##
 * ##dialog.alert(content, options)##
 * @return {Alert} alert
 */
function alert() {
    if (alertSingleton) {
        alertSingleton.close().remove();
        alertSingleton = null;
    }
    alertSingleton = Alert.create.apply(null, arguments);
    alertSingleton.showAt(Dialog.Position.GoldenRatio).setDraggable(false);
    return alertSingleton;
}

/**
 * Notice
 * ======
 * Notice is a auto-close Dialog without header, footer, buttons, only content.
 */
var Notice = Dialog.extend('$root.ui.dialog.Notice', {
    init: function(options) {
        this.$attr('options', Notice.options(options));
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
        if (opts.duration > 0) {
            _fn.delay(self.remove, opts.duration, self);
        }
        return this;
    }
}).statics({
    Type: {
        Info: Dialog.Parts.IconInfo,
        Error: Dialog.Parts.IconError,
        Warnning: Dialog.Parts.IconWarnning
    }
}).options({
    // ##Creating Options of Notice##
    duration: 4000, //notice display duration
    type: Dialog.Parts.IconInfo //notice default type, see Notice.Type
});

function Notice_initialize(self, opts) {
    if (opts.type && opts.type.length > 0) self.body.prepend(opts.type);
}

function notice(content, duration, opts) {
    var n;
    opts = Notice.options(opts);
    opts.duration = duration;
    opts.content = content;
    n = new Notice(opts);
    n.showAt(Dialog.Position.GoldenRatio)
        .appendTo('body');
    return n;
}