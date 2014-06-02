/**
 * ---
 * description: Object utils
 * version: 0.0.1
 * namespace: $root.lang.object
 * imports:
 *   _type: $root.lang.type
 *   _str: $root.lang.string
 *   _enum: $root.lang.enumerable
 * exports:
 * - mix
 * - keys
 * - values
 * - tryget
 * - tryset
 * - pairs
 * - fromPairs
 * - fromKeyValuePairString
 * files:
 * - src/lang/object.js
 */

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('lang/object', ['lang/type', 'lang/string', 'lang/enumerable'], factory);
    } else if (typeof module === 'object') {
        var $root_lang_type = require('lang/type'),
            $root_lang_string = require('lang/string'),
            $root_lang_enumerable = require('lang/enumerable');
        module.exports = factory($root_lang_type, $root_lang_string, $root_lang_enumerable, exports, module, require);
    } else {
        var exports = $root._createNS('$root.lang.object');
        factory($root.lang.type, $root.lang.string, $root.lang.enumerable, exports);
    }
}(this, function(_type, _str, _enum, exports) {
    //'use strict';
    exports = exports || {};
    
    ///exports
    
    function mix(target, source) {
        _enum.each(source, function(v, k, i) {
            target[k] = v;
        });
        return target;
    }
    
    /**
     * keys
     * return keys of obj
     * @param  {Object} obj
     * @return {Array}
     */
    var keys = Object.keys || function(obj) {
        var ret = [];
        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                ret.push(i);
            }
        }
        return ret;
    };
    
    /**
     * values
     * return values of obj
     * @param  {Object} obj
     * @return {Array}
     */
    function values(obj) {
        var ret = [];
        if (_type.isEmpty(obj)) return ret;
        for (var i in obj) {
            if (obj.hasOwnProperty(i)) ret.push(obj[i]);
        }
        return ret;
    }
    
    
    /**
     * tryget
     * try to retrieve value of object according to given `path`
     * @param {Object} o
     * @param {String} path
     * @param {Any} v, default value if
     * @returns {Any}
     * @remark
     *     tryget({a:[{b:42}]},'a.0.b', -1) => 42
     */
    function tryget(o, path, v) {
        if (_type.isEmpty(o)) return v;
    
        var parts = path.split('.'),
            part, len = parts.length;
    
        for (var t = o, i = 0; i < len; ++i) {
            part = parts[i];
            if (part in t) {
                t = t[parts[i]];
            } else {
                return v;
            }
        }
        return t;
    }
    
    /**
     * tryset
     * @param  {Any} obj
     * @param  {String} path, dot separated property name
     * @param  {Any} v, value to be set to
     * @return {Any} obj
     * @remark
     *     tryset({a:[{b:42}]},'a.0.b', 43).a[0].b => 43
     */
    function tryset(obj, path, v) {
        if (arguments.length !== 3) {
            throw Error('`tryget` needs 3 parameters');
        }
    
        var parts = path.split('.'),
            part, len = parts.length - 1;
    
        for (var t = obj, i = 0; i < len; ++i) {
            part = parts[i];
            if (part in t) {
                t = t[parts[i]];
            } else return obj;
        }
        t[parts[i]] = v;
        return obj;
    }
    
    function pairs(obj) {
        var ret = [];
        for (var k in obj) {
            if (obj.hasOwnProperty(k)) {
                ret.push([k, obj[k]]);
            }
        }
        return ret;
    }
    
    function fromPairs(pairs) {
        var obj = {},
            i = 0,
            len = pairs.length,
            o;
        for (; i < len; ++i) {
            o = pairs[i];
            obj[o[0]] = o[1];
        }
        return obj;
    }
    /**
     * fromKvString
     * @param  {string} self    string to be parsed
     * @param  {string} pairSep separator that separate key-value pairs
     * @param  {string} kvSep   separator that seperate key and value
     * @return {Object} object parsed from key-value string
     */
    var fromKeyValuePairString = _str.toHash;
    
    exports['mix'] = mix;
    exports['keys'] = keys;
    exports['values'] = values;
    exports['tryget'] = tryget;
    exports['tryset'] = tryset;
    exports['pairs'] = pairs;
    exports['fromPairs'] = fromPairs;
    exports['fromKeyValuePairString'] = fromKeyValuePairString;
    exports.__doc__ = "Object utils";
    exports.VERSION = '0.0.1';
    return exports;
}));
//end of $root.lang.object
