/**
 * ---
 * description: TagInput
 * namespace: $root.ui
 * imports:
 *   _type: $root.lang.type
 *   _str: $root.lang.string
 *   _tpl: $root.browser.template
 *   _enum: $root.lang.enumerable
 *   _fn: $root.lang.fn
 *   _arguments: $root.lang.arguments
 *   $: jQuery
 *   _ary: $root.lang.array
 *   _drag: $root.ui.draggable
 * exports:
 * - Tag
 * - TagInput
 * - Alert
 * - alert
 * files:
 * - /ui/TagInput.js
 * - /ui/dialog/Alert.js
 */

;define('$root.ui',['$root.lang.type','$root.lang.string','$root.browser.template','$root.lang.enumerable','$root.lang.fn','$root.lang.arguments','jQuery','$root.lang.array','$root.ui.draggable'],function(require, exports){
    //'use strict';
    var _type = require('$root.lang.type'),
        _str = require('$root.lang.string'),
        _tpl = require('$root.browser.template'),
        _enum = require('$root.lang.enumerable'),
        _fn = require('$root.lang.fn'),
        _arguments = require('$root.lang.arguments'),
        $ = require('jQuery'),
        _ary = require('$root.lang.array'),
        _drag = require('$root.ui.draggable');
        
    ///xtemplate
    require('$root.browser.template')
            .set('$root.ui.TagInput.tag',"<div class=\"ui-taginput\"><div class=\"ui-taginput-tag\">\n<span class=\"ui-taginput-tagtext\"></span><a class=\"ui-taginput-button\" href=\"javascript:;\"></a>\n</div></div>\n")
            .set('$root.ui.TagInput.tags-and-input',"<div class=\"ui-taginput\"><div class=\"ui-taginput-tags\" comment=\"\">\n<input type=\"text\" value=\"\"><script>\n            define('$root.demo.ui.TagInput', function(require) {\n                var TagInput = require('$root.ui').TagInput;\n                (new TagInput()).appendTo('body');\n            });\n        </script>\n</div></div>\n");
        ///vars
    var tpl = _tpl.id$('$root.ui.TagInput'),
        tagInputTemplate = tpl('tags-and-input'),
        tagTemplate = tpl('tag'),
        varArg = _arguments.varArg;
    
    ///helper
    
    
    ///impl
    var Tag = _type.create('Tag', jQuery, {
        init: function(text) {
            this.super(tagTemplate);
        },
        text: function(val) {
            var ret = this.find('ui-taginput-tagtext').text(val);
            return _type.isString(ret) ? ret : this;
        }
    });
    
    var TagInput = _type.create('TagInput', jQuery, {
        init: function(container, options) {
            this.super(container);
            this.options = options;
            return TagInput_initialize(this);
        },
        appendTag: function(text, opts) {
            var tag = new Tag(text, opts);
            return this.find('ui-tagInput-tags').append(tag);
        },
        removeTags: function(indexOrText) {
            var tags = _type.isEmpty(indexOrText) ? this.tags() : this.findTag(indexOrText);
            _enum.plunk(tags, "&remove", true);
            return this;
        },
        tags: function(){
            return this.container.find('ui-taginput-tags').children();
        },
        findTag: function(text) {
            return varArg(arguments, this)
                .when('string|regexp', function(pattern) {
                    return _enum.findAll(this.tags(), function(tag) {
                        return tag.getText().match(text);
                    });
                })
                .when('int', function(i) {
                    return this.tags().tags[i] || [];
                }).args();
        }
    }).statics({});
    
    function TagInput_initialize(self) {
    
    }
    // /ui/dialog/Alert.js
    /**
     * Alert
     */
    ///vars
    var tpl = _tpl.id$('$root.ui'),
        alertTemplate = tpl('Alert'),
        varArg = _arguments.varArg,
        creatingAlertDialog = false,
        $alert;
    
    ///impl
    var Alert = _type.create('Alert', jQuery, {
        init: function(message, title, buttons, callback) {
            if (_type.isUndefined($alert)) {
                $alert = this.super(alertTemplate);
            }
            return Alert_initialize($alert, message, title, buttons, callback);
        },
        dispose: function() {
            this.hide();
        }
    }).statics({
        OK: 1,
        CANCEL: 2,
        OKCANCEL: 3,
        DEFAULT_OK_TEXT: 'OK',
        DEFAULT_CANCEL_TEXT: 'Cancel'
    });
    
    ///private methods
    var $alertButtons, $alertTitle, $alertBody;
    
    function Alert_initialize(self, message, title, buttons, callback) {
        if (!$alertButtons) $alertButtons = self.find('.ui-button');
        $alertButtons.unbind('click').click(function(e) {
            var index = _ary.indexOf($alertButtons, this);
            if (_type.isFunction(callback)) {
                creatingAlertDialog = false;
                callback.apply(self, [e, index, this]);
            } else {
                self.hide();
                return;
            }
            //do not hide if alert is called inside another alert
            if (!creatingAlertDialog) self.hide();
        });
    
        if (!$alertTitle) $alertTitle = self.find('.ui-alert-title');
        $alertTitle.text(title || '');
    
        if (!$alertBody) $alertBody = self.find('.ui-alert-body');
        $alertBody.text(message);
    
        self.appendTo('body').show();
        _drag.draggable($alertTitle, self);
        return self;
    }
    
    ///utils function
    
    /**
     * alert
     * @return {Undefined
    } * @remark
     *  alert('message');
     *  alert('message',callback);
     *  alert('message','title');
     *  alert('message','title',callback);
     *  alert('message',Alert.OKCANCEL);
     *  alert('message','title',Alert.OKCANCEL);
     *  alert('message','title',Alert.OKCANCEL,callback)
     */
    function alert() {
        return varArg(arguments)
            .when('*', function(message) {
                return [String(message), '', Alert.OKCANCEL, null];
            }).when('string', 'function', function(message, callback) {
                return [message, null, Alert.OKCANCEL, callback];
            }).when('string', 'string', function(message, title) {
                return [message, title, Alert.OKCANCEL, null];
            }).when('string', 'string', 'function', function(message, title, callback) {
                return [message, title, Alert.OKCANCEL, callback];
            }).bind(function(m, t, b, c) {
                creatingAlertDialog = true;
                return new Alert(m, t, b, c);
            })();
    }
    exports['Tag'] = Tag;
    exports['TagInput'] = TagInput;
    exports['Alert'] = Alert;
    exports['alert'] = alert;
    return exports;
});
//end of $root.ui
