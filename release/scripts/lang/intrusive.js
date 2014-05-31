/**
 * ---
 * description: Extend JavaScript builtins intrusively
 * version: 0.0.1
 * namespace: $root.lang.intrusive
 * imports:
 *   _str: $root.lang.string
 *   _array: $root.lang.array
 *   _object: $root.lang.object
 *   _date: $root.lang.date
 *   _num: $root.lang.number
 *   _enum: $root.lang.enumerable
 *   _fn: $root.lang.fn
 * exports:
 * - $
 * files:
 * - src/lang/intrusive.js
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('lang/intrusive',['lang/string','lang/array','lang/object','lang/date','lang/number','lang/enumerable','lang/fn'], factory);
    } else {
        var exports = $root._createNS('$root.lang.intrusive');
        factory($root.lang.string,$root.lang.array,$root.lang.object,$root.lang.date,$root.lang.number,$root.lang.enumerable,$root.lang.fn,exports);
    }
}(this, function (_str,_array,_object,_date,_num,_enum,_fn,exports) {
    //'use strict';
    exports = exports || {};
    
        var _slice = Array.prototype.slice;
    
    function _intrude_proto(proto, methods) {
        if (!proto) return;
        var k, f;
        if (typeof Object.defineProperty == 'function') {
            for (k in methods) {
                if (!methods.hasOwnProperty(k) || proto.hasOwnProperty(k)) continue;
                f = methods[k];
                Object.defineProperty(proto, k, {
                    enumerable: false,
                    value: (function(f) {
                        return function() {
                            var args = _slice.call(arguments, 0);
                            args.unshift(this);
                            return f.apply(null, args);
                        };
                    })(f)
                });
            }
        } else {
            for (k in methods) {
                if (!methods.hasOwnProperty(k) || proto.hasOwnProperty(k)) continue;
                f = methods[k];
                proto[k] = (function(f) {
                    return function() {
                        var args = _slice.call(arguments, 0);
                        args.unshift(this);
                        return f.apply(null, args);
                    };
                })(f);
            }
        }
    }
    
    function _intrude_clazz(clz, statics) {
        var k;
        if(clz === Array) debugger;
        if (typeof Object.defineProperty == 'function') {
            for (k in statics) {
                if (!statics.hasOwnProperty(k)) continue;
                Object.defineProperty(clz, k, {
                    enumerable: false,
                    value: statics[k]
                });
            }
        } else {
            for (k in statics) {
                if (!statics.hasOwnProperty(k)) continue;
                clz[k] = statics[k];
            }
        }
    
    }
    
    // extends Function.prototype is disabled by default
    // call intrusive.$('Function') if needed
    var builtins = 'String,Array,Object,Date',
        protos = {
            String: {
                clazz: String,
                proto: String.prototype,
                methods: {
                    toInt: _str.toInt,
                    toFloat: _str.toFloat,
                    capitalize: _str.capitalize,
                    strip: _str.strip,
                    isBlank: _str.isBlank,
                    lstrip: _str.lstrip,
                    rstrip: _str.rstrip,
                    chomp: _str.chomp,
                    chop: _str.chop,
                    reverse: _str.reverse,
                    repeat: _str.repeat,
                    startWith: _str.startWith,
                    endWith: _str.endWith,
                    quoted: _str.quoted,
                    enclose: _str.enclose,
                    quote: _str.quote,
                    toArray: _str.toArray,
                    format: _str.format,
                    isHtmlFragment: _str.isHtmlFragment,
                    toHash: _str.toHash
                }
            },
            Array: {
                clazz: Array,
                proto: Array.prototype,
                methods: {
                    each: _enum.each,
                    indexOf: _array.indexOf,
                    equal: _array.equal,
                    strictEqual: _array.strictEqual,
                    compact: _array.compact,
                    flatten: _enum.flatten,
                    fill: _array.fill,
                    max: _num.max,
                    min: _num.min,
                    inject: _enum.inject,
                    all: _enum.all,
                    find: _enum.find,
                    findAll: _enum.findAll,
                    map: _enum.map,
                    pluck: _enum.pluck,
                    parallel: _enum.parallel,
                    rand: function(self) {
                        var from = _num.max(self),
                            to = _num.min(self);
                        return _num.rand(from, to);
                    }
                },
                statics: {
                    w: _array.w,
                    fromRange: _array.fromRange
                }
            },
            Object: {
                clazz: Object,
                proto: Object.prototype,
                methods: {
                    mix: _object.mix,
                    keys: _object.keys,
                    values: _object.values,
                    tryget: _object.tryget,
                    tryset: _object.tryset,
                    pairs: _object.pairs,
                    each: _enum.each,
                    inject: _enum.inject,
                    all: _enum.all,
                    find: _enum.find,
                    findAll: _enum.findAll,
                    map: _enum.map,
                    pluck: _enum.pluck,
                    compact: _enum.compact
                },
                statics: {
                    fromPairs: _object.fromPairs,
                    fromKeyValuePairString: _object.fromKeyValuePairString
                }
            },
            Date: {
                clazz: Date,
                proto: Date.prototype,
                methods: {
                    format: _date.format,
                    calendar: function(self) {
                        return _date.calendar(self.getFullYear(), self.getMonth() + 1);
                    }
                }
            },
            Function: {
                clazz: Function,
                proto: Function.prototype,
                methods: {
                    bindTimeout: _fn.bindTimeout,
                    bindCallNew: _fn.bindCallNew,
                    bindApplyNew: _fn.bindApplyNew,
                    callNew: _fn.callNew,
                    applyNew: _fn.applyNew,
                    ntimes: _fn.ntimes,
                    once: _fn.once,
                    delay: _fn.delay,
                    memoize: _fn.memoize,
                    wrap: _fn.wrap,
                    compose: _fn.compose,
                    debounce: _fn.debounce
                },
                statics: {
                    noop: _fn.noop,
                    alwaysTrue: _fn.alwaysTrue,
                    alwaysFalse: _fn.alwaysFalse,
                    alwaysNull: _fn.alwaysNull,
                    alwaysUndefined: _fn.alwaysUndefined,
                    return1st: _fn.return1st,
                    return2nd: _fn.return2nd,
                    return3rd: _fn.return3rd,
                    return4th: _fn.return4th
                }
            }
        };
    
    function $(builtinsToIntrude) {
        builtinsToIntrude = builtinsToIntrude || builtins;
        var i = 0,
            name, config,
            clazzes = builtinsToIntrude.split(','),
            len = clazzes.length;
        for (; i < len; ++i) {
            name = clazzes[i];
            config = protos[name];
            if (!config) continue;
            intrude(config);
        }
    }
    
    function intrude(c) {
        _intrude_proto(c.proto, c.methods);
        if (c.statics) _intrude_clazz(c.clazz, c.statics);
    }
    
    exports['$'] = $;
    exports.__doc__ = "Extend JavaScript builtins intrusively";
    return exports;
}));
//end of $root.lang.intrusive
