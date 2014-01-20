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
        }).bind(function(m, t, b, c) {
            creatingAlertDialog = true;
            return new Alert(m, t, b, c);
        })();
}

var mouseMoveEvent = 'mousemove',
    mouseDownEvent = 'mousedown',
    mouseUpEvent = 'mouseup';

var Dragable = _type.create('Dragable', {
    init: function($who, opts) {
        var self = this;
        this.$ = $who;
        this.options = opts || {};
        this.offsetParent = $who.offsetParent();
        $who.on(mouseDownEvent, function(e) {
            Dragable_onMouseDown(self, e);
        });
    }
}).statics({
    MouseMoveEvent: mouseMoveEvent,
    MouseDownEvent: mouseDownEvent,
    MouseUpEvent: mouseUpEvent,
    createOptions: {
        onMouseDown: null,
        onMouseMove: null,
        onMouseUp: null
    }
});



function Dragable_onMouseDown(self, e) {
    var onMoveFn = self.options.onMouseMove,
        $ele = self.$,
        mouseDownPosition = {},
        elePos = $ele.offset(); //position relative to document

    mouseDownPosition.x = e.clientX - elePos.left;
    mouseDownPosition.y = e.clientY - elePos.top;

    _fn.call(self.options.onMouseDown, $ele, e, mouseDownPosition);

    if (_type.isFunction(self.options.onMouseMove)) {
        $ele.on(mouseMoveEvent, function(e) {
            onMoveFn.call($ele, e, {
                left: e.clientX - mouseDownPosition.x,
                top: e.clientY - mouseDownPosition.y
            }, mouseDownPosition);
        });
    }
    $ele.bind(mouseUpEvent, function(e) {
        Dragable_onMouseUp(self, e);
    });
}

function Dragable_onMouseUp(self, e) {
    self.$.unbind(mouseMoveEvent).unbind(mouseUpEvent);
    _fn.call(self.options.onMosueUp, self.$, e);
}

function dragable($ele) {
    return new Dragable($ele, {
        onMouseMove: function(e, offset) {
            $ele.offset(offset);
        }
    });
}