/**
 * ---
 * description: Chain
 * namespace: $root.lang.chain
 * imports:
 *   _enum: $root.lang.enumerable
 *   _object: $root.lang.object
 * exports:
 * - _
 * files:
 * - /lang/chain.js
 */

;define('$root.lang.chain',[
    '$root.lang.enumerable',
    '$root.lang.object'
], function (require, exports){
    //'use strict';
    var _enum = require('$root.lang.enumerable'),
        _object = require('$root.lang.object');
    
    var _slice = Array.prototype.slice,
    proto = {
        value: function() {
            return this.value;
        },
        set: function(v, force) {
            if (typeof v != 'function' || force === true) {
                this.value = v;
            } else {
                this.value = v();
            }
            return this;
        }
    };

function addMethodToProto(names, methods) {
    _enum.each(names, function(value, name) {
        proto[name] = function() {
            var args = _slice.call(arguments);
            args.unshift(this.value);
            this.value = methods[name].apply(this, args);
            return this;
        };
    });
}

addMethodToProto(_enum, _enum);
addMethodToProto(['mix',
    'keys',
    'values',
    'tryget',
    'tryset',
    'pairs'
], _object);

function Chain(objs) {
    this.value = objs;
}
Chain.prototype = proto;

///exports
function _(objs) {
    return new Chain(objs);
}
    
    exports['_'] = _;
    exports.__doc__ = "Chain";
    return exports;
});
//end of $root.lang.chain
