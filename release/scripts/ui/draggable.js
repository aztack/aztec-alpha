/**
 * #Draggable#
 * =========
 * - Dependencies: `lang/type`,`lang/fn`,`lang/arguments`,`jquery`,`jQueryExt`
 * - Version: 0.0.1
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
        factory($root.lang.type, $root.lang.fn, $root.lang.arguments, jQuery, jQueryExt, exports);
    }
}(this, function(_type, _fn, _arguments, $, jqe, exports) {
    'use strict';
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
     * #Draggable#
     * provide basic drag functionality
     * @param  {jQuery} $handle, dragging handle
     * @param  {jQuery} $dragged, dragged element
     * @param  {Draggable.CreateOptions} opts
     * @return {Draggable}
     * ```
     * A Draggable has a `handle` with which user click and drag the `dragged`.
     * After user release mouse key, the Draggable only responsed to `mousedown`
     * ```
     */
    var Draggable = _type.create('$root.ui.Draggable', {
        init: function(handle, dragged, opts) {
            var self = this;
            this.$ = $(handle);
            this.$dragged = $(dragged);
            this.$attr('options', opts || {});
            this.$offsetParent = this.$dragged.offsetParent();
            this.$.on(mouseDownEvent, function(e) {
                Draggable_onMouseDown(self, e);
            });
            if (this.$.data(draggableDataKey)) {
                Draggable_finalize(this.$);
            }
            this.$.data(draggableDataKey, this);
        },
        /**
         * ##Draggable\#disable()##
         * Disable dragging
         * @return {Draggable}
         */
        disable: function() {
            this.$.off(mouseDownEvent);
            //this.finalize();
            return this;
        },
        /**
         * ##Draggable\#enable()##
         * Enable dragging
         * @return {Draggable}
         */
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
    
        mouseDownPosition.x = e.pageX - elePos.left;
        mouseDownPosition.y = e.pageY - elePos.top;
    
        _fn.call(self.options.onMouseDown, $ele, e, mouseDownPosition);
    
        var dx = $parent.scrollLeft(),
            dy = $parent.scrollTop(),
            p = $parent,
            offset = {};
        if (_type.isFunction(onMoveFn)) {
            $parent.on(mouseMoveEvent, function(e) {
                offset.left = e.pageX - mouseDownPosition.x;
                offset.top = e.pageY - mouseDownPosition.y;
    
                //Call restriction function on `offset`
                _fn.call(restriction, self, offset, e, mouseDownPosition);
    
                //Call on mouse move callback function.
                //In callback we can restrict offset of dragged element
                //or do some intresting stuff
                onMoveFn.call(self, e, offset, mouseDownPosition);
            });
            if ($parent[0] === document.documentElement) p = $('body');
            p.on(scrollEvent, function() {
                offset.left -= p.scrollX;
                offset.top -= p.scrollY;
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
     * #draggable.draggable(...)#
     * helper function to make a element draggable
     * @param  {Selector|jQueryObject} handle, dragging handle
     * @param  {Selector|jQueryObject} dragged, element being dragged
     * @param  {Object} opts
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
    
    /**
     * #draggable.undraggable(handle)#
     * helper function to make a element undraggable
     * @param  {Selector|jQueryObject} handle
     * @return {[type]}        [description]
     */
    function undraggable(handle) {
        var h = $(handle),
            draggable = h.data(draggableDataKey);
        h.off(mouseDownEvent);
        Draggable_finalize(draggable);
        h.data(draggableDataKey, null);
    }
    
    /**
     * #draggable.isDraggable(handle)#
     * return true if handle is draggable
     * @param  {Selector|jQueryObject} handle
     * @return {Draggable}
     */
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
