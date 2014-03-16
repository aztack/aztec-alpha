/**
 * ---
 * description: Event Utils
 * version: 0.0.1
 * namespace: $root.browser.event
 * imports:
 *   _type: $root.lang.type
 *   _fn: $root.lang.fn
 * exports:
 * - stopEvent
 * - EventEmitter
 * files:
 * - /browser/event.js
 * - /browser/event.emitter.js
 */

;define('$root.browser.event',[
    '$root.lang.type',
    '$root.lang.fn'
], function (require, exports){
    //'use strict';
    var _type = require('$root.lang.type'),
        _fn = require('$root.lang.fn');
    
        ///exports
    
    /**
     * pauseEvent
     * @param  {Event} e
     * @return {Boolean}
     */
    function stopEvent(e) {
        if (e.stopPropagation) {
            e.stopPropagation();
            e.preventDefault();
        } else {
            e.cancelBuble = true;
            e.returnValue = false;
        }
        return false;
    }
    // /browser/event.emitter.js
    /**
     * Event Emitter
     */
    ///imports
    var _slice = Array.prototype.slice,
        Callbacks = _fn.Callbacks;
    
    ///exports
    
    /**
     * EventEmitter
     * model after nodejs `events.EventEmitter` with some modification
     * @see http://nodejs.org/api/events.html
     */
    function EventEmitter() {
        this._events = {};
        this._maxListeners = 10;
    }
    
    var eeproto = EventEmitter.prototype;
    
    /**
     * addListener
     * @param {String} event
     * @param {Function} listener
     * @return {EventEmitter}
     */
    eeproto.addListener = function(event, listener) {
        var callbacks = this._events[event];
        if (_type.isUndefined(callbacks)) {
            callbacks = this._events[event] = Callbacks();
        }
        callbacks.add(listener);
        return this;
    };
    
    eeproto.on = eeproto.addListener;
    
    /**
     * once
     * remove listener once it is called
     * @param  {[type]} event    [description]
     * @param  {[type]} listener [description]
     * @return {[type]}          [description]
     */
    eeproto.once = function(event, listener) {
        var self = this;
    
        function f() {
            self.removeListener(event, f);
            f.apply(this, arguments);
        }
        this.on(event, f);
        return this;
    };
    
    /**
     * removeListener
     * @param  {String} event
     * @param  {Function} listener
     * @return {EventEmitter}
     */
    eeproto.removeListener = function(event, listener) {
        var callbacks = this._events[event];
        if (!_type.isUndefined(callbacks) && _type.isFunction(listener)) {
            callbacks.remove(listener);
        }
        return this;
    };
    
    /**
     * removeAllListeners
     * @param  {String} event
     * @return {EventEmitter}
     */
    eeproto.removeAllListeners = function(event) {
        if (_type.isUndefined(event)) {
            this._events = {};
        } else {
            this._events[event] = Callbacks();
        }
        return this;
    };
    
    /**
     * setMaxListeners
     * currently maxListeners is useless
     * @param {int} n
     */
    eeproto.setMaxListeners = function(n) {
        if (_type.isInteger(n)) {
            this._maxListeners = n;
        }
        return this;
    };
    
    /**
     * listeners
     * return listeners of event
     * @param  {[type]} event [description]
     * @return {[type]}       [description]
     */
    eeproto.listeners = function(event) {
        return this._events[event];
    };
    
    /**
     * emit
     * emit an event, fire registered listeners
     * @param  {String} event
     * @return {[type]}       [description]
     */
    eeproto.emit = function(event) {
        var listeners = this.listeners(event),
            args;
        if (_type.isUndefined(listeners)) {
            return this;
        }
        args = _slice.call(arguments, 1);
        listeners.fire(this, args);
        return this;
    };
    
    exports['stopEvent'] = stopEvent;
    exports['EventEmitter'] = EventEmitter;
    exports.__doc__ = "Event Utils";
    return exports;
});
//end of $root.browser.event
