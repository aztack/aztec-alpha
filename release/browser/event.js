// ({
//   description: "Event",
//   version: '0.0.1',
//   namespace: $root.browser.event,
//   imports: {
//     _type: $root.lang.type,
//     _array: $root.lang.array,
//     _enum: $root.lang.enumerable
// },
//   exports: [pauseEvent, EventEmitter]
// })

;define('$root.browser.event',['$root.lang.type','$root.lang.array','$root.lang.enumerable'],function(require, exports){
    //'use strict';
    var _type = require('$root.lang.type'),_array = require('$root.lang.array'),_enum = require('$root.lang.enumerable');
    
      ///imports
    var Callbacks = _fn.Callbacks;
    
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
      function f(){
        self.removeListener(event, f);
        f.apply(this, arguments);
      }
      this.on(event,f);
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
      if (_type.isNumber(n)) {
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
      args = _array.toArray(arguments, 1);
      listeners.fire(event, args);
      return this;
    };
    
    // other event related functions
    
    /**
     * pauseEvent
     * @param  {Event} e
     * @return {Boolean}
     */
    function pauseEvent(e) {
      if (e.stopPropagation) {
        e.stopPropagation();
        e.preventDefault();
      } else {
        e.cancelBuble = true;
        e.returnValue = false;
      }
      return false;
    }
    
    function addEventListener() {
    
    }
    
    function removeEventListener() {
    
    }
  exports['pauseEvent'] = pauseEvent;
    exports['EventEmitter'] = EventEmitter;
    return exports;
});
//end of $root.browser.event