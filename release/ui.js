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
            .set('$root.ui.Alert',"<div class=\"ui-alert\">\n<div class=\"ui-title\">alert dialog</div>\n<div class=\"ui-body\">\n                Hello World\n            </div>\n<div class=\"ui-buttons\">\n<button class=\"ui-button\">OK</button><button class=\"ui-button\">Cancel</button>\n</div>\n</div>\n");
        ///vars
    var tpl = _tpl.id$('$root.ui'),
        alertTemplate = tpl('Alert'),
        varArg = _arguments.varArg,
        $alert;
    ///helper
    
    ///impl
    var Alert = _type.create('Alert', jQuery, {
        init: function(message, title, buttons, callback) {
            if (_type.isUndefined($alert)) {
                $alert = this.super(alertTemplate);
            }
            Alert_doInit(this, message, title, buttons, callback);
            return $alert;
        }
    }).statics({
        OK: 1,
        CANCEL: 2,
        OKCANCEL: 3
    });
    
    //private methods
    function Alert_doInit(self, message, title, buttons, callback) {
        self.find('.ui-button').click(function(e) {
            var index = _ary.indexOf(buttons, this);
            if(_type.isFunction(callback)){
                callback.apply(self, [e, index, this]);
            }
            self.hide();
        });
    
        self.find('.ui-title').text(title);
        self.find('.ui-body').text(message);
    
        self.appendTo('body');
    }
    
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
            .when('string', function(message) {
                return [message, '', Alert.OKCANCEL, null];
            }).when('string', 'function', function(message, callback) {
                return [message, '', Alert.OKCANCEL, callback];
            }).when('string', 'string', function(message, title) {
                return [message, title, Alert.OKCANCEL, null];
            }).when('string', 'string', 'function', function(message, title, callback) {
                return [message, title, Alert.OKCANCEL, callback];
            }).asArgumentsOf(function(m, t, b, c) {
                return new Alert(m, t, b, c);
            });
    }
    exports['Alert'] = Alert;
    exports['alert'] = alert;
    return exports;
});
//end of $root.ui
