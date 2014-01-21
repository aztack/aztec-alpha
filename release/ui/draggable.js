/**
 * ---
 * description: Draggable
 * namespace: $root.ui.draggable
 * imports:
 *   _type: $root.lang.type
 *   _str: $root.lang.string
 *   _fn: $root.lang.fn
 *   $: jQuery
 * exports:
 * - draggable
 * - Draggable
 * files:
 * - /ui/draggable.js
 */

;define('$root.ui.draggable',['$root.lang.type','$root.lang.string','$root.lang.fn','jQuery'],function(require, exports){
    //'use strict';
    var _type = require('$root.lang.type'),
        _str = require('$root.lang.string'),
        _fn = require('$root.lang.fn'),
        $ = require('jQuery');
    
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
     */
    var Draggable = _type.create('Draggable', {
        init: function($handle, $dragged, opts) {
            var self = this;
            this.$ = $($handle);
            this.$dragged = $dragged;
            this.options = opts || {};
            this.$offsetParent = $dragged.offsetParent();
            Draggable_initialize(this);
        },
        dispose: function() {
            Draggable_finalize(this);
        }
    }).statics({
        MouseMoveEvent: mouseMoveEvent,
        MouseDownEvent: mouseDownEvent,
        MouseUpEvent: mouseUpEvent,
        CreateOptions: {
            onMouseDown: null,
            onMouseMove: null,
            onMouseUp: null
        },
        DefaultDraggingRestriction: function(offset) {
            if (offset.top < 0) offset.top = 0;
            if (offset.left < 0) offset.left = 0;
        }
    });
    
    function Draggable_initialize(self) {
        self.$.on(mouseDownEvent, function(e) {
            Draggable_onMouseDown(self, e);
        });
    }
    
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
                _fn.call(restriction, self, offset, e, mouseDownPosition);
                onMoveFn.call($ele, e, offset, mouseDownPosition);
            });
        }
    
        function cancelDragging(e) {
            Draggable_onMouseUp(self, e);
        }
        $ele.bind(mouseUpEvent, cancelDragging)
            .bind(keyupEvent, cancelDragging);
        $parent.bind(mouseUpEvent, cancelDragging)
            .bind(keyupEvent, cancelDragging);
    }
    
    function Draggable_finalize(self) {
        self.$offsetParent.unbind(mouseMoveEvent)
            .unbind(mouseUpEvent)
            .unbind(keyupEvent);
        self.$.unbind(mouseUpEvent)
            .unbind(keyupEvent);
    }
    
    function Draggable_onMouseUp(self, e) {
        _fn.call(self.options.onMosueUp, self.$, e);
        Draggable_finalize(self);
    }
    
    /**
     * draggable
     * helper function to make a positioned element draggable
     * @param  {[type]} $handle, dragging handle
     * @param  {[type]} $dragged, element being dragged
     * @return {Draggable}
     */
    function draggable($handle, $dragged) {
        return new Draggable($handle, $dragged, {
            onMouseMove: function(e, offset) {
                $dragged.offset(offset);
            },
            draggingRestriction: Draggable.DefaultDraggingRestriction
        });
    }
    exports['draggable'] = draggable;
    exports['Draggable'] = Draggable;
    return exports;
});
//end of $root.ui.draggable
