({
    description: 'Alert',
    namespace: $root.ui,
    imports: {
        _type: $root.lang.type,
        _str: $root.lang.string,
        _tpl: $root.browser.template,
        _ary: $root.lang.array,
        _arguments: $root.lang.arguments,
        $: jQuery
    },
    exports: [
        Alert,
        alert
    ],
    priority: 1
});

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