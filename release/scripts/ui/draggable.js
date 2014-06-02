/**
 * ---
 * description: Draggable
 * namespace: $root.ui.draggable
 * imports:
 *   _type: $root.lang.type
 *   _fn: $root.lang.fn
 *   _arguments: $root.lang.arguments
 *   $: jquery
 *   jqe: jQueryExt
 * exports:
 * - draggable
 * - undraggable
 * - isDraggable
 * - Draggable
 * files:
 * - src/ui/draggable.js
 */

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('ui/draggable', ['lang/type', 'lang/fn', 'lang/arguments', 'jquery', 'jQueryExt'], factory);
    } else if (typeof module === 'object') {
        var $root_lang_type = require('lang/type'),
            $root_lang_fn = require('lang/fn'),
            $root_lang_arguments = require('lang/arguments'),
            jquery = require('jquery'),
            jQueryExt = require('jQueryExt');
        module.exports = factory($root_lang_type, $root_lang_fn, $root_lang_arguments, jquery, jQueryExt, exports, module, require);
    } else {
        var exports = $root._createNS('$root.ui.draggable');
        factory($root.lang.type, $root.lang.fn, $root.lang.arguments, jquery, jQueryExt, exports);
    }
}(this, function(_type, _fn, _arguments, $, jqe, exports) {
    //'use strict';
    exports = exports || {};
    
    //Features
    //[x] drag frame
    //[x] drag manager, multiple elements drag
    
    var mouseMoveEvent = 'mousemove.draggable',
        mouseDownEvent = 'mousedown.draggable',
        mouseUpEvent = 'mouseup.draggable',
        keyupEvent = 'keyup.draggable',
        scrollEvent = 'scroll.draggable',
        draggableDataKey = '$root.ui.draggable';
    
    var varArg = _arguments.varArg;
    
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
    var Draggable = _type.create('$root.ui.Draggable', {
        init: function(handle, dragged, opts) {
            var self = this;
            this.$ = $(handle);
            this.$dragged = $(dragged);
            this.$attr('options',opts || {});
            this.$offsetParent = this.$dragged.offsetParent();
            this.$.on(mouseDownEvent, function(e) {
                Draggable_onMouseDown(self, e);
            });
            if (this.$.data(draggableDataKey)) {
                Draggable_finalize(this.$);
            }
            this.$.data(draggableDataKey, this);
        },
        disable: function() {
            this.$.off(mouseDownEvent);
            //this.finalize();
            return this;
        },
        enable: function() {
            var self = this;
            this.$.on(mouseDownEvent, function(e) {
                Draggable_onMouseDown(self, e);
            });
            return this;
        },
        finalize: function() {
            Draggable_finalize(this);
        }
    }).events({
        MouseMoveEvent: mouseMoveEvent,
        MouseDownEvent: mouseDownEvent,
        MouseUpEvent: mouseUpEvent
    }).statics({
        CreateOptions: {
            onMouseDown: _fn.noop,
            onMouseMove: _fn.noop,
            onMouseUp: _fn.noop
        },
        DefaultDraggingRestriction: function(offset) {
            var $parent = this.$offsetParent,
                w = $parent.width(),
                borderRightWidth = parseInt(this.$dragged.css('border-right-width')),
                borderLeftWidth = parseInt(this.$dragged.css('border-left-width')),
                rightBound = w - this.$.width() - borderRightWidth - borderLeftWidth;
            if (offset.top < 0) offset.top = 0;
            if (offset.left < 0) offset.left = 0;
            if (offset.left >= rightBound) offset.left = rightBound;
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
    
        var dx = $parent.scrollLeft(),
            dy = $parent.scrollTop(),
            p = $parent;
        if (_type.isFunction(onMoveFn)) {
            $parent.on(mouseMoveEvent, function(e) {
                offset = {
                    left: e.clientX - mouseDownPosition.x + dx,
                    top: e.clientY - mouseDownPosition.y + dy
                };
    
                //call restriction function on `offset`
                _fn.call(restriction, self, offset, e, mouseDownPosition);
    
                //call on mouse move callback function
                //in callback we can set offset of dragged element
                //or do some intresting stuff
                onMoveFn.call(self, e, offset, mouseDownPosition);
            });
            if ($parent[0] === document.documentElement) p = $(window);
            p.on(scrollEvent, function() {
                dx = p.scrollLeft();
                dy = p.scrollTop();
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
        if (self.$offsetParent[0] === document.documentElement) {
            $(window).unbind(scrollEvent);
        } else {
            self.$offsetParent.unbind(scrollEvent);
        }
    }
    
    var defaultOptions = {
        onMouseMove: function(e, offset) {
            this.$dragged.offset(offset);
        },
        draggingRestriction: Draggable.DefaultDraggingRestriction
    };
    
    /**
     * draggable
     * helper function to make a positioned element draggable
     * @param  {String|jQueryObject} handle, dragging handle
     * @param  {String|jQueryObject} dragged, element being dragged
     * @param  {Draggable.CreateOptions} opts
     * @return {Draggable}
     */
    function draggable(handle, dragged, opts) {
        opts = opts || {};
        return varArg(arguments)
            .when('*', '*', '{*}', function(arg1, arg2, opts) {
                var h = $(arg1),
                    d = $(arg2),
                    o = $.extend(true, defaultOptions, opts);
                return [h, d, o];
            })
            .when('*', '{*}', function(arg1, opts) {
                var h = $(arg1),
                    d = $(arg1);
                opts = $.extend(true, defaultOptions, opts);
                return [h, d, opts];
            })
            .when('*', '*', function(arg1, arg2) {
                var h = $(arg1),
                    d = $(arg2);
                return [h, d, defaultOptions];
            })
            .when('*', function() {
                var h = $(handle);
                return [h, h, defaultOptions];
            })
            .when(function() {
                throw Error('function `draggable` need at least one parameter');
            })
            .invokeNew(Draggable);
    }
    
    function undraggable(handle) {
        var h = $(handle),
            draggable = h.data(draggableDataKey);
        h.off(mouseDownEvent);
        Draggable_finalize(draggable);
        h.data(draggableDataKey, null);
    }
    
    function isDraggable(handle) {
        var h = $(handle),
            draggable = h.data(draggableDataKey);
        return draggable;
    }
    
    exports['draggable'] = draggable;
    exports['undraggable'] = undraggable;
    exports['isDraggable'] = isDraggable;
    exports['Draggable'] = Draggable;
    exports.__doc__ = "Draggable";
    exports.VERSION = '0.0.1';
    return exports;
}));
//end of $root.ui.draggable
