({
    description: 'Alert',
    namespace: $root.ui,
    imports: {
        _type: $root.lang.type,
        _str: $root.lang.string,
        _tpl: $root.browser.template,
        _ary: $root.lang.array,
        _fn: $root.lang.fn,
        _arguments: $root.lang.arguments,
        _drag: $root.ui.draggable,
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

    if (!$alertTitle) $alertTitle = self.find('.ui-title');
    $alertTitle.text(title || '');

    if (!$alertBody) $alertBody = self.find('.ui-body');
    $alertBody.text(message);

    self.appendTo('body').show();
    _drag.draggable($alertTitle, self);
    return self;
}

///utils function

/**
 * alert
 * @return {Undefined}
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
    varArg(arguments)
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