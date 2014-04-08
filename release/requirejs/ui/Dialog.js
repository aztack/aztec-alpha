/**
 * ---
 * description: Dialog
 * namespace: $root.ui.dialog
 * imports:
 *   _type: $root.lang.type
 *   _array: $root.lang.array
 *   _enum: $root.lang.enumerable
 *   _tpl: $root.browser.template
 *   _arguments: $root.lang.arguments
 *   _drag: $root.ui.draggable
 *   $: jQuery
 * exports:
 * - GenericDialog
 * - Alert
 * - alert
 * files:
 * - src/ui/dialog.js
 */

;define('ui/dialog',[
    'lang/type',
    'lang/array',
    'lang/enumerable',
    'browser/template',
    'lang/arguments',
    'ui/draggable',
    'jQuery'
], function (_type,_array,_enum,_tpl,_arguments,_drag,$){
    //'use strict';
    var exports = {};
        _tpl
            .set('$root.ui.Dialog.dialog',"<div class=\"ui-dialog\">\n<div class=\"ui-dialog-header\"></div>\n<div class=\"ui-dialog-body\"></div>\n<div class=\"ui-dialog-footer\"></div>\n</div>\n")
            .set('$root.ui.Dialog.alertButton',"<button class=\"ui-dialog-button\"></button>\n");
        ///vars
    var varArg = _arguments.varArg,
        tpl = _tpl.id$('$root.ui.Dialog');
    
    /**
     * Generic Dialog
     *     contains only empty header,body,footer
     *     can not be dragged
     *     extends this class to implements your own dialog
     */
    var GenericDialog = _type.create('$root.ui.GenericDialog', jQuery, {
        init: function(options) {
            //if(!options) return this;
            this.options = options || {};
            this.base(GenericDialog.DefaultTemplate);
            this.header = this.sigil('.header');
            this.body = this.sigil('.body');
            this.footer = this.sigil('.footer');
            this.buttons = this.sigil('.button');
            GenericDialog_initialize(this, this.options);
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
                    var x = xpos,
                        w,
                        y = ypos,
                        h,
                        dim = this.dimension(),
                        CENTER = 'center';
                    if (typeof ypos == 'undefined') {
                        ypos = CENTER;
                    }
                    if (xpos == CENTER) {
                        w = parent.width();
                        x = w / 2 - dim.width / 2;
                    }
                    if (ypos == CENTER) {
                        h = parent.height();
                        y = h / 2 - dim.height / 2;
                    }
                    return [parent, x, y];
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
                    this.trigger(GenericDialog.Events.OnShowAt, [x, y]);
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
        },
        bringToFront: function() {
            return GenericDialog_setLayerPosition(this, 'front');
        },
        sendToBack: function() {
            return GenericDialog_setLayerPosition(this, 'back');
        },
        setDraggable: function(isDraggable) {
            var draggable = _drag.isDraggable(this.header);
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
                    _array.forEach(captions, function(cap) {
                        var button = $(Alert.Template.DefaultButton);
                        button.text(cap).appendTo(footer);
                    });
                });
            this.buttons = this.sigil('.button');
            return this;
        }
    }).statics({
        DefaultTemplate: tpl('dialog'),
        Events: {
            OnShowAt: 'OnShowAt(x,y)',
            OnClose: 'OnClose',
            OnButtonClick: 'OnButtonClick(buttonIndex,buttonCaption)'
        },
        CreateOptions: function() {
            return {
                title: 'untitled'
            };
        }
    });
    
    function GenericDialog_initialize(self, opts) {
        self.addClass('ui-generic-dialog');
        _drag.draggable(self.header, self);
    
        if (opts.content) {
            self.setContent(opts.content);
        }
    
        //register OnClose event handler if provided in create options
        if (_type.isFunction(self.options.onClose)) {
            self.on(Alert.Events.OnClose, self.options.onClose);
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
                caption = button.text();
    
            //trigger event after close so that we can re-open this dialog in event handler
            self.trigger(GenericDialog.Events.OnButtonClick, [index, caption]);
        });
    }
    
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
    
    function GenericDialog_setLayerPosition(self, frontOrBack) {
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
    var Alert = _type.create('$root.ui.Alert', GenericDialog, {
        init: function(options) {
            var opts = this.options = options || {};
            this.base.apply(this, arguments);
            this.header.text(opts.title || '');
            this.buttons = this.sigil('.button');
            this.addClass('ui-alert');
            Alert_initialize(this, opts);
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
        Position: {
            Center: 'center'
        }
    });
    
    function Alert_initialize(self, opts) {
        //if no buttons specified, create a default 'OK' button
        var button;
        if (!opts.buttons && self.buttons.length === 0) {
            button = $(Alert.Template.DefaultButton);
            button.text(Alert.Text.OK);
            self.footer.append(button);
        } else {
            self.setButtons(opts.buttons);
        }
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
        alertSingleton.showAt(Alert.Position.Center).on(GenericDialog.Events.OnButtonClick,function(){
            alertSingleton.close();
        });
        return alertSingleton;
    }
        
    ///sigils
    if (!GenericDialog.sigils) GenericDialog.sigils = {};
    GenericDialog.sigils[".header"] = ".ui-dialog-header";
    GenericDialog.sigils[".body"] = ".ui-dialog-body";
    GenericDialog.sigils[".footer"] = ".ui-dialog-footer";
    GenericDialog.sigils[".dialog"] = ".ui-dialog";
    GenericDialog.sigils[".button"] = ".ui-dialog-button";

    exports['GenericDialog'] = GenericDialog;
    exports['Alert'] = Alert;
    exports['alert'] = alert;
    exports.__doc__ = "Dialog";
    return exports;
});
//end of $root.ui.dialog