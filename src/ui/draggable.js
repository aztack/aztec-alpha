({
    description: 'Draggable',
    namespace: $root.ui.draggable,
    imports: {
        _type: $root.lang.type,
        _fn: $root.lang.fn,
        $: jQuery
    },
    exports: [
        draggable,
        Draggable
    ]
});

var mouseMoveEvent = 'mousemove',
    mouseDownEvent = 'mousedown',
    mouseUpEvent = 'mouseup',
    keyupEvent = 'keyup';

/**
 * Draggable
 * provide basic drag functionality
 * @param  {jQuery} $handle, dragging handle
 * @param  {jQuery} $dragged, dragged element
 * @param  {Draggable.CreateOptions} opts
 * @return {Draggable}
 * @remark
 *     A Draggable has a `handle` with which user click and drag the `dragged`.
 *     After user release mouse key, the Draggable only responsed to `mousedown`
 */
var Draggable = _type.create('Draggable', {
    init: function(handle, dragged, opts) {
        var self = this;
        this.$ = $(handle);
        this.$dragged = $(dragged);
        this.options = opts || {};
        this.$offsetParent = this.$dragged.offsetParent();
        this.$.on(mouseDownEvent, function(e) {
            Draggable_onMouseDown(self, e);
        });
    },
    dispose: function() {
        Draggable_finalize(this);
    }
}).statics({
    MouseMoveEvent: mouseMoveEvent,
    MouseDownEvent: mouseDownEvent,
    MouseUpEvent: mouseUpEvent,
    CreateOptions: {
        onMouseDown: _fn.noop,
        onMouseMove: _fn.noop,
        onMouseUp: _fn.noop
    },
    DefaultDraggingRestriction: function(offset) {
        var $parent = this.$offsetParent,
            w = $parent.width(),
            rightBound = w - this.$.width();
        if (offset.top < 0) offset.top = 0;
        if (offset.left < 0) offset.left = 0;
        if (offset.left > rightBound) offset.left = rightBound;
    }
});

function Draggable_onMouseDown(self, e) {
    var onMoveFn = self.options.onMouseMove,
        restriction = self.options.draggingRestriction,
        mouseDownPosition = {},
        $ele = self.$,
        $parent = self.$offsetParent,
        elePos = $ele.offset(); //position relative to document

    mouseDownPosition.x = e.clientX - elePos.left;
    mouseDownPosition.y = e.clientY - elePos.top;

    _fn.call(self.options.onMouseDown, $ele, e, mouseDownPosition);

    if (_type.isFunction(self.options.onMouseMove)) {
        $parent.on(mouseMoveEvent, function(e) {
            var offset = {
                left: e.clientX - mouseDownPosition.x,
                top: e.clientY - mouseDownPosition.y
            };

            //call restriction function on `offset`
            _fn.call(restriction, self, offset, e, mouseDownPosition);

            //call on mouse move callback function
            //in callback we can set offset of dragged element
            //or do some intresting stuff
            onMoveFn.call(self, e, offset, mouseDownPosition);
        });
    }

    function cancelDragging(e) {
        _fn.call(self.options.onMosueUp, self.$, e);
        Draggable_finalize(self);
    }

    function escKeyUp(e) {
        if (e.keyCode == 27) {
            Draggable_finalize(self);
        }
    }
    $ele.bind(mouseUpEvent, cancelDragging)
        .bind(keyupEvent, escKeyUp);
    $parent.bind(mouseUpEvent, cancelDragging)
        .bind(keyupEvent, escKeyUp);
}

function Draggable_finalize(self) {
    self.$offsetParent.unbind(mouseMoveEvent)
        .unbind(mouseUpEvent)
        .unbind(keyupEvent);
    self.$.unbind(mouseUpEvent)
        .unbind(keyupEvent);
}

/**
 * draggable
 * helper function to make a positioned element draggable
 * @param  {String|jQueryObject} handle, dragging handle
 * @param  {String|jQueryObject} dragged, element being dragged
 * @param  {Draggable.CreateOptions} opts
 * @return {Draggable}
 */
function draggable(handle, dragged, opts) {
    var options = $.extend(true, {
            onMouseMove: function(e, offset) {
                this.$dragged.offset(offset);
            },
            draggingRestriction: Draggable.DefaultDraggingRestriction
        }, opts);

    return new Draggable(handle, dragged, options);
}