/**
 * ---
 * description: Chain
 * namespace: $root.lang.chain
 * imports:
 *   _type: $root.lang.type
 *   _enum: $root.lang.enumerable
 * exports: []
 * files:
 * - /lang/chain.js
 */

;define('$root.lang.chain',['$root.lang.type','$root.lang.enumerable'],function(require, exports){
    //'use strict';
    var _type = require('$root.lang.type'),
        _enum = require('$root.lang.enumerable');
    
        ///exports
    var _ = (function() {
        var proto = {
            value: function() {
                return this.value;
            }
        }, fn, Chain;
    
        each(_enum, function(fn, name) {
            proto[name] = function() {
                var args = _slice.call(arguments);
                args.unshift(this.value);
                this.value = fn.apply(this, args);
                return this;
            };
        });
    
        Chain = function(objs) {
            this.value = objs;
        };
        Chain.prototype = proto;
    
        return function(objs) {
            return new Chain(objs);
        };
    })();
    
    return exports;
});
//end of $root.lang.chain
