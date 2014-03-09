/**
 * ---
 * description: Alert
 * namespace: $root.ui.Alert
 * imports:
 *   _type: $root.lang.type
 *   _str: $root.lang.string
 *   _tpl: $root.browser.template
 *   _ary: $root.lang.array
 *   _fn: $root.lang.fn
 *   _drag: $root.ui.draggable
 *   _arguments: $root.lang.arguments
 *   $: jQuery
 * exports:
 * - Alert
 * - alert
 * priority: 1
 * files:
 * - /ui/dialog/Alert.js
 */

;define('$root.ui.Alert',[
    '$root.lang.type',
    '$root.lang.string',
    '$root.browser.template',
    '$root.lang.array',
    '$root.lang.fn',
    '$root.ui.draggable',
    '$root.lang.arguments',
    'jQuery'
], function (require, exports){
    //'use strict';
    var _type = require('$root.lang.type'),
        _str = require('$root.lang.string'),
        _tpl = require('$root.browser.template'),
        _ary = require('$root.lang.array'),
        _fn = require('$root.lang.fn'),
        _drag = require('$root.ui.draggable'),
        _arguments = require('$root.lang.arguments'),
        $ = require('jQuery');
        
    ///xtemplate
    require('$root.browser.template')
            .set('$root.ui.Alert',"<div class=\"ui-alert\">\n<div class=\"ui-alert-title\">alert dialog</div>\n<div class=\"ui-alert-body\">\n                Hello World\n            </div>\n<div class=\"ui-alert-buttons\">\n<button class=\"ui-alert-button\">&#30830;&#23450;</button><button class=\"ui-alert-button\">&#21462;&#28040;</button>\n</div>\n</div>\n")
            .set('$root.ui.Alert.button',"<button class=\"ui-alert-button\"></button>\n");
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
                $alert = this.base(alertTemplate);
            }
            return Alert_initialize($alert, message, title, buttons, callback);
        },
        setButtons: function(){
    
        }
    }).statics({
        DefaultButtonTemplate: tpl('Alert.button'),
        Events: {
            OnClose:'OnClose.Alert'
        }
    });
    
    ///private methods
    var $alertButtons, $alertTitle, $alertBody;
    
    function Alert_initialize(self, message, title, buttons, callback) {
        if (!$alertButtons) $alertButtons = self.sigil('.button');
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
    
        if (!$alertTitle) $alertTitle = self.sigil('.title');
        $alertTitle.text(title || '');
    
        if (!$alertBody) $alertBody = self.sigil('.body');
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
        
    ///sigils
    Alert.sigils = {
        ".title": ".ui-alert-title",
        ".body": ".ui-alert-body",
        ".buttons": ".ui-alert-buttons",
        ".button": ".ui-alert-button"
    };

    exports['Alert'] = Alert;
    exports['alert'] = alert;
    return exports;
});
//end of $root.ui.Alert
