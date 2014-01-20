/**
 * ---
 * description: Alert
 * namespace: $root.ui
 * imports:
 *   _type: $root.lang.type
 *   _str: $root.lang.string
 *   _tpl: $root.browser.template
 *   _ary: $root.lang.array
 *   _arguments: $root.lang.arguments
 *   $: jQuery
 * exports:
 * - Alert
 * - alert
 * priority: 1
 * files:
 * - /ui/dialog/Alert.js
 */

;define('$root.ui',['$root.lang.type','$root.lang.string','$root.browser.template','$root.lang.array','$root.lang.arguments','jQuery'],function(require, exports){
    //'use strict';
    var _type = require('$root.lang.type'),
        _str = require('$root.lang.string'),
        _tpl = require('$root.browser.template'),
        _ary = require('$root.lang.array'),
        _arguments = require('$root.lang.arguments'),
        $ = require('jQuery');
        
    ///xtemplate
    require('$root.browser.template')
            .set('$root.ui.Alert',"<div class=\"ui-alert\">\n<div class=\"ui-title\">alert dialog</div>\n<div class=\"ui-body\">\n                Hello World\n            </div>\n<div class=\"ui-buttons\">\n<button class=\"ui-button\">&#30830;&#23450;</button><button class=\"ui-button\">&#21462;&#28040;</button>\n</div>\n</div>\n");
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
                dragable($alert);
            }
            return Alert_doInit($alert, message, title, buttons, callback);
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
    
    function Alert_doInit(self, message, title, buttons, callback) {
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
    
        if (!$alertTitle) $alertTitle = self.find('.ui-title');
        $alertTitle.text(title || '');
    
        if (!$alertBody) $alertBody = self.find('.ui-body');
        $alertBody.text(message);
    
        self.appendTo('body').show();
        return self;
    }
    
    ///utils function
    
    /**
     * alert
     * @return {[type]} [description]
     * @remark
     *  alert('message');
     *  alert('message',callback);
     *  alert('message','title');
     *  alert('message','title',callback);
     *  alert('message',Alert.OKCANCEL);
     *  alert('message','title',Alert.OKCANCEL);
     *  alert('message','title',Alert.OKCANCEL,callback)
     */
    function alert() {
        var _alert = varArg(arguments)
            .when('*', function(message) {
                return [String(message), '', Alert.OKCANCEL, null];
            }).when('string', 'function', function(message, callback) {
                return [message, null, Alert.OKCANCEL, callback];
            }).when('string', 'string', function(message, title) {
                return [message, title, Alert.OKCANCEL, null];
            }).when('string', 'string', 'function', function(message, title, callback) {
                return [message, title, Alert.OKCANCEL, callback];
            }).asArgumentsOf(function(m, t, b, c) {
                creatingAlertDialog = true;
                return new Alert(m, t, b, c);
            });
    }
    
    var Dragable = _type.create('Dragable', function() {
    
    });
    
    function dragable($ele) {
        var offsetParent = $ele.offsetParent(),
            dragging = false,
            mousedownpos = {
                x: 0,
                y: 0
            };
        $ele.on('mousedown', function(e) {
            dragging = true;
            //position relative to document
            var pos = $ele.offset();
            mousedownpos.x = e.clientX - pos.left;
            mousedownpos.y = e.clientY - pos.top;
        }).on('mousemove', function(e) {
            if (!dragging) return;
            $ele.offset({
                left: e.clientX - mousedownpos.x,
                top: e.clientY - mousedownpos.y
            });
        }).on('mouseup', function() {
            dragging = false;
        }).on('keyup', function() {
            dragging = false;
        });
    }
    exports['Alert'] = Alert;
    exports['alert'] = alert;
    return exports;
});
//end of $root.ui
