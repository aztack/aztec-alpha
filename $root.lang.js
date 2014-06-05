// $root
// $root.lang.json
// $root.lang.type
// $root.lang.fn
// $root.lang.number
// $root.lang.arguments
// $root.lang.string
// $root.lang.range
// $root.lang.date
// $root.lang.array
// $root.lang.enumerable
// $root.lang.object
// $root.lang.intrusive
// $root.lang
/**
 * #The Aztec JavaScript framework#
 * ==============================
 * - Dependencies: 
 * - Version: 0.0.1
 */


(function(global) {

    if (typeof define === 'function' && define.amd) {
        return;
    }

    var G = global.$root = {};

    function createNS(namespace) {
        var i = 0,
            ns = G,
            parts = namespace.split('.'),
            len = parts.length,
            part = parts[0];

        for (; i < len; ++i) {
            part = parts[i];
            if (part == '$root') {
                part = G;
                continue;
            }
            if (typeof ns[part] == 'undefined') {
                ns[part] = {};
            }
            ns = ns[part];
        }
        return ns;
    }

    function help() {
        var name, v;
        if (G.lang) {
            for (name in G.lang) {
                if (!G.lang.hasOwnProperty(name)) continue;
                console.log('%c$root.lang.' + name + ': ' + G.lang[name].__doc__,'color:green');
                console.dir(G.lang[name]);
            }
        }
        if (G.ui) {
            for (name in G.ui) {
                if (!G.ui.hasOwnProperty(name)) continue;
                console.log('%c$root.ui.' + name + ': ' + G.ui[name].__doc__,'color:green');
                console.dir(G.ui[name]);
            }
        }
    }

    if (Object.defineProperty) {
        Object.defineProperty(G, '_createNS', {
            enumerable: false,
            value: createNS
        });
        Object.defineProperty(G, '_help', {
            enumerable: false,
            value: help
        });
    } else {
        G._createNS = createNS;
        G._help = help;
    }

}(this));
/**
 * #JSON#
 * ====
 * - Dependencies: 
 * - Version: 0.0.1
 */

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('lang/json', [], factory);
    } else if (typeof module === 'object') {
        module.exports = factory(exports, module, require);
    } else {
        var exports = $root._createNS('$root.lang.json');
        factory(exports);
    }
}(this, function(exports) {
    'use strict';
    exports = exports || {};
    
    if (typeof JSON != 'undefined' && typeof JSON.parse == 'function' && typeof JSON.stringify == 'function') {
        exports.parse = JSON.parse;
        exports.stringify = JSON.stringify;
    } else {
    
        var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            gap,
            indent,
            meta = { // table of character substitutions
                '\b': '\\b',
                '\t': '\\t',
                '\n': '\\n',
                '\f': '\\f',
                '\r': '\\r',
                '"': '\\"',
                '\\': '\\\\'
            },
            rep;
    
        //helper
        function f(n) {
            // Format integers to have at least two digits.
            return n < 10 ? '0' + n : n;
        }
    
        if (typeof Date.prototype.toJSON !== 'function') {
    
            Date.prototype.toJSON = function() {
    
                return isFinite(this.valueOf()) ? this.getUTCFullYear() + '-' +
                    f(this.getUTCMonth() + 1) + '-' +
                    f(this.getUTCDate()) + 'T' +
                    f(this.getUTCHours()) + ':' +
                    f(this.getUTCMinutes()) + ':' +
                    f(this.getUTCSeconds()) + 'Z' : null;
            };
    
            String.prototype.toJSON =
                Number.prototype.toJSON =
                Boolean.prototype.toJSON = function() {
                    return this.valueOf();
            };
        }
    
        function quote(string) {
    
            //If the string contains no control characters, no quote characters, and no
            //backslash characters, then we can safely slap some quotes around it.
            //Otherwise we must also replace the offending characters with safe escape
            //sequences.
    
            escapable.lastIndex = 0;
            return escapable.test(string) ? '"' + string.replace(escapable, function(a) {
                var c = meta[a];
                return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' : '"' + string + '"';
        }
    
    
        function str(key, holder) {
    
            //Produce a string from holder[key].
    
            var i, // The loop counter.
                k, // The member key.
                v, // The member value.
                length,
                mind = gap,
                partial,
                value = holder[key];
    
            //If the value has a toJSON method, call it to obtain a replacement value.
    
            if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
                value = value.toJSON(key);
            }
    
            //If we were called with a replacer function, then call the replacer to
            //obtain a replacement value.
    
            if (typeof rep === 'function') {
                value = rep.call(holder, key, value);
            }
    
            //What happens next depends on the value's type.
    
            switch (typeof value) {
                case 'string':
                    return quote(value);
    
                case 'number':
    
                    //JSON numbers must be finite. Encode non-finite numbers as null.
    
                    return isFinite(value) ? String(value) : 'null';
    
                case 'boolean':
                case 'null':
    
                    //If the value is a boolean or null, convert it to a string. Note:
                    //typeof null does not produce 'null'. The case is included here in
                    //the remote chance that this gets fixed someday.
    
                    return String(value);
    
                    //If the type is 'object', we might be dealing with an object or an array or
                    //null.
    
                case 'object':
    
                    //Due to a specification blunder in ECMAScript, typeof null is 'object',
                    //so watch out for that case.
    
                    if (!value) {
                        return 'null';
                    }
    
                    //Make an array to hold the partial results of stringifying this object value.
    
                    gap += indent;
                    partial = [];
    
                    //Is the value an array?
    
                    if (Object.prototype.toString.apply(value) === '[object Array]') {
    
                        //The value is an array. Stringify every element. Use null as a placeholder
                        //for non-JSON values.
    
                        length = value.length;
                        for (i = 0; i < length; i += 1) {
                            partial[i] = str(i, value) || 'null';
                        }
    
                        //Join all of the elements together, separated with commas, and wrap them in
                        //brackets.
    
                        v = partial.length === 0 ? '[]' : gap ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' : '[' + partial.join(',') + ']';
                        gap = mind;
                        return v;
                    }
    
                    //If the replacer is an array, use it to select the members to be stringified.
    
                    if (rep && typeof rep === 'object') {
                        length = rep.length;
                        for (i = 0; i < length; i += 1) {
                            if (typeof rep[i] === 'string') {
                                k = rep[i];
                                v = str(k, value);
                                if (v) {
                                    partial.push(quote(k) + (gap ? ': ' : ':') + v);
                                }
                            }
                        }
                    } else {
    
                        //Otherwise, iterate through all of the keys in the object.
    
                        for (k in value) {
                            if (Object.prototype.hasOwnProperty.call(value, k)) {
                                v = str(k, value);
                                if (v) {
                                    partial.push(quote(k) + (gap ? ': ' : ':') + v);
                                }
                            }
                        }
                    }
    
                    //Join all of the member texts together, separated with commas,
                    //and wrap them in braces.
    
                    v = partial.length === 0 ? '{}' : gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' : '{' + partial.join(',') + '}';
                    gap = mind;
                    return v;
            }
        }
    
        //exports
        /**
         * stringify
         * @param  {[type]} value    [description]
         * @param  {[type]} replacer [description]
         * @param  {[type]} space    [description]
         * @return {[type]}          [description]
         */
        function stringify(value, replacer, space) {
    
            //The stringify method takes a value and an optional replacer, and an optional
            //space parameter, and returns a JSON text. The replacer can be a function
            //that can replace values, or an array of strings that will select the keys.
            //A default replacer method can be provided. Use of the space parameter can
            //produce text that is more easily readable.
    
            var i;
            gap = '';
            indent = '';
    
            //If the space parameter is a number, make an indent string containing that
            //many spaces.
    
            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }
    
                //If the space parameter is a string, it will be used as the indent string.
    
            } else if (typeof space === 'string') {
                indent = space;
            }
    
            //If there is a replacer, it must be a function or an array.
            //Otherwise, throw an error.
    
            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }
    
            //Make a fake root object containing our value under the key of ''.
            //Return the result of stringifying the value.
    
            return str('', {
                '': value
            });
        }
    
        /**
         * parse
         * @param  {[type]} text    [description]
         * @param  {[type]} reviver [description]
         * @return {[type]}         [description]
         */
        function parse(text, reviver) {
    
            //The parse method takes a text and an optional reviver function, and returns
            //a JavaScript value if the text is a valid JSON text.
    
            var j;
    
            function walk(holder, key) {
    
                //The walk method is used to recursively walk the resulting structure so
                //that modifications can be made.
    
                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }
    
    
            //Parsing happens in four stages. In the first stage, we replace certain
            //Unicode characters with escape sequences. JavaScript handles many characters
            //incorrectly, either silently deleting them, or treating them as line endings.
    
            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function(a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }
    
            //In the second stage, we run the text against regular expressions that look
            //for non-JSON patterns. We are especially concerned with '()' and 'new'
            //because they can cause invocation, and '=' because it can cause mutation.
            //But just to be safe, we want to reject all unexpected forms.
    
            //We split the second stage into 4 regexp operations in order to work around
            //crippling inefficiencies in IE's and Safari's regexp engines. First we
            //replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
            //replace all simple value tokens with ']' characters. Third, we delete all
            //open brackets that follow a colon or comma or that begin the text. Finally,
            //we look to see that the remaining characters are only whitespace or ']' or
            //',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.
    
            if (/^[\],:{}\s]*$/
                .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                    .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                    .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
    
                //In the third stage we use the eval function to compile the text into a
                //JavaScript structure. The '{' operator is subject to a syntactic ambiguity
                //in JavaScript: it can begin a block or an object literal. We wrap the text
                //in parens to eliminate the ambiguity.
    
                j = eval('(' + text + ')');
    
                //In the optional fourth stage, we recursively walk the new structure, passing
                //each name/value pair to a reviver function for possible transformation.
    
                return typeof reviver === 'function' ? walk({
                    '': j
                }, '') : j;
            }
    
            //If the text is not JSON parseable, then a SyntaxError is thrown.
    
            throw new SyntaxError('JSON.parse');
        }
    }
    
    exports['parse'] = parse;
    exports['stringify'] = stringify;
    exports.__doc__ = "JSON";
    exports.VERSION = '0.0.1';
    return exports;
}));
//end of $root.lang.json
/**
 * #JavaScript Type System Supplement#
 * =================================
 * - Dependencies: 
 * - Version: 0.0.1
 */

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('lang/type', [], factory);
    } else if (typeof module === 'object') {
        module.exports = factory(exports, module, require);
    } else {
        var exports = $root._createNS('$root.lang.type');
        factory(exports);
    }
}(this, function(exports) {
    'use strict';
    exports = exports || {};
    
    var _toString = Object.prototype.toString,
        _hasOwn = Object.prototype.hasOwnProperty,
        _getPrototypeOf = Object.getPrototypeOf,
        _primitives = {
            'boolean': 'Boolean',
            'number': 'Number',
            'string': 'String',
            'undefined': 'Undefined'
        };
    
    // exports
    exports.Boolean = 'Boolean';
    exports.Number = 'Number';
    exports.String = 'String';
    exports.Undefined = 'Undefined';
    exports.Integer = 'Integer';
    exports.Array = 'Array';
    exports.PlainObject = 'PlainObject';
    exports.Function = 'Function';
    /**
     * isPrimitive
     * @param  {Any}  arg
     * @return {Boolean}
     */
    function isPrimitive(arg) {
        return arg === null || typeof arg in _primitives;
    }
    
    /**
     * isUndefined
     * return true if all arguments are undefined
     * @param  {Any}  arg
     * @return {Boolean}
     */
    function isUndefined(arg) {
        var i = 0,
            len = arguments.length;
        if (len == 1) {
            return typeof arg == 'undefined';
        } else {
            for (; i < len; ++i) {
                if (typeof arguments[i] != 'undefined') return false;
            }
            return true;
        }
    }
    
    /**
     * isNull
     * return true if all arguments are null
     * @param  {Any}  arg
     * @return {Boolean}
     */
    function isNull(arg) {
        var i = 0,
            len = arguments.length;
        if (len == 1) {
            return typeof arg === null;
        } else {
            for (; i < len; ++i) {
                if (arguments[i] !== null) return false;
            }
            return true;
        }
    }
    
    /**
     * isNullOrUndefined
     * @param  {any}  arg
     * @return {Boolean}
     */
    function isNullOrUndefined(arg) {
        return arg === null || typeof arg == 'undefined';
    }
    
    var isUndefinedOrNull = isNullOrUndefined;
    
    /**
     * containNullOrUndefined
     * return true if arguments contains null or undefined
     * @return {Boolean}
     */
    function containsNullOrUndefined() {
        var i = 0,
            len = arguments.length;
        for (; i < len; ++i) {
            if (arguments[i] === null || typeof arguments[i] == 'undefined') return true;
        }
        return false;
    }
    
    /**
     * isEmptyObjct
     * return true if arg has no property
     * @param  {Any}  arg
     * @return {Boolean}
     */
    function isEmptyObject(arg) {
        var i;
        if (typeof arg != 'object') return false;
        for (i in arg) {
            return false;
        }
        return true;
    }
    
    function isElement(arg) {
        return arg && arg.nodeType === 1;
    }
    /**
     * isEmpty
     * return true if arg is undefined or null or zero length or plain object with no property
     * @param  {Any}  arg
     * @return {Boolean}
     */
    function isEmpty(arg) {
        var b = typeof arg === 'undefined' || arg === null || arg.length === 0;
        return b ? true : isEmptyObject(arg);
    }
    
    function isRegExp(arg) {
        return _toString.call(arg) == '[object RegExp]';
    }
    
    function isString(arg) {
        return _toString.call(arg) == '[object String]';
    }
    
    function isDate(arg) {
        return _toString.call(arg) == '[object Date]' && arg.toString() != 'Invalid Date' && !isNaN(arg);
    }
    
    /**
     * isArray
     * return true if given arg is truly an array
     * @see http://perfectionkills.com/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/
     * @param  {Any} arg
     * @return {Boolean}
     */
    var isArray = Array.isArray || function isArray(arg) {
        return _toString.call(arg) == '[object Array]';
    };
    
    /**
     * isArrayLike
     * return true if arg has a length property and it's a integer
     * @param  {Any}  arg
     * @return {Boolean}
     */
    function isArrayLike(arg) {
        var len = arg.length,
            t = typename(arg);
    
        if (len === 0 || arg.nodeType === 1 && len || t == exports.Array || t == exports.String) return true
    
        if (t == exports.Function || isWindow(arg)) {
            return false;
        }
    
        //any object which has a length property and do has 0->length-1 items
        //we consider it is a array-like object
        return typeof len == 'number' && len >= 0 && arg[0] && (len - 1) in arg;
    }
    
    function isFunction(arg) {
        return _toString.call(arg) == '[object Function]';
    }
    
    function isNumber(arg) {
        return _toString.call(arg) == '[object Number]' && isFinite(arg);
    }
    
    function isFiniteNumber(arg) {
        if (arg === null) return false;
        return isFinite(arg);
    }
    /**
     * isInteger
     * @param  {Any}  arg
     * @return {Boolean} return true if arg is an integer
     */
    function isInteger(arg) {
        //http://stackoverflow.com/questions/3885817/how-to-check-if-a-number-is-float-or-integer
        return typeof arg == 'number' && parseFloat(arg) == parseInt(arg, 10) && !isNaN(arg);
    }
    
    /**
     * isFloat
     * @param  {Any}  arg
     * @return {Boolean} return true if arg is a float number
     */
    function isFloat(arg) {
        return isNumber(arg) && !isInteger(arg) && !isNaN(arg) && isFinite(arg);
    }
    
    
    function isBoolean(arg) {
        return _toString.call(arg) == '[object Boolean]';
    }
    
    /**
     * isPlainObject
     * return true if arg is a plain object: create with object literal or new Object
     * @param  {Any}  arg
     * @return {Boolean}
     */
    function isPlainObject(arg) {
        if (_getPrototypeOf) {
            return arg && typeof arg == 'object' && _getPrototypeOf(arg) === Object.prototype;
        }
        if (typename(arg) != 'Object' || arg.nodeType || isWindow(arg)) {
            return false;
        }
        try {
            if (arg.constructor && !_hasOwn.call(arg.constructor.prototype, 'isPrototypeOf')) {
                return false;
            }
        } catch (e) {
            return false;
        }
        return true;
    }
    
    /**
     * ctorName
     * return constructor of arg in string
     * @see http://stackoverflow.com/questions/332422/how-do-i-get-the-name-of-an-objects-type-in-javascript
     * @param  {Any} arg can be anything
     * @return {String} string representation of constructor of arg
     * @remark
     *     `arg.constructor` and `instanceof` are both not work cross-frame and cross-window
     */
    function ctorName(arg) {
        var ctor = arg.constructor;
        if (isFunction(ctor) && !isEmpty(ctor.name)) {
            //function in JScript does not has name property
            return ctor.name;
        } else {
            return _toString.call(arg).slice(8, -1);
        }
    }
    
    /**
     * typename
     * return type of arg in string
     * @param  {Any} arg
     * @return {String}
     */
    function typename(arg) {
        var t = typeof arg;
        if (arg === null) {
            return 'Null';
        } else if (t in _primitives) {
            return _primitives[t];
        } else if (isFunction(arg.$getClass)) {
            return arg.$getClass().typename();
        } else {
            return ctorName(arg);
        }
    }
    
    /**
     * create a object with 'proto' as it's __proto__
     * @param  {Object} proto
     * @param  {Object}} attributes
     * @return {Object}
     */
    function object(proto, attributes) {
        var f = function() {}, result, k;
        f.prototype = proto;
        result = new f();
        if (attributes) {
            for (k in attributes) {
                if (attributes.hasOwnProperty(k)) {
                    result[k] = attributes[k];
                }
            }
        }
        return result;
    }
    
    /**
     * hasSameTypeName
     * return true if a, b has the same type name
     * @param  {Any}  a
     * @param  {Any}  b
     * @return {Boolean}
     */
    function hasSameTypeName(a, b) {
        return typename(a) == typename(b);
    }
    
    function isWindow(w) {
        return w != null && w.window == w;
    }
    // src/lang/type.oop.js
    /**
     * Object-Orientated Programming Support
     */
    var Classes = {},
        $ObjectSpace = {},
        ObjectSpace = function(typename) {
            return $ObjectSpace[typename];
        };
    
    
    function arrayEach(ary, fn, thisValue) {
        var i = 0,
            len = ary.length,
            ret;
    
        for (; i < len; ++i) {
            ret = fn.call(thisValue, ary[i], i, i, ary);
        }
        return ary;
    }
    
    function objectEach(obj, fn, thisValue) {
        var key, ret, i = 0;
    
        for (key in obj) {
            ret = fn.call(thisValue, obj[key], key, i++, obj);
        }
        return obj;
    }
    
    /* simplified tryget/tryset */
    function tryget(o, path, v) {
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
    
    function tryset(obj, path, v) {
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
    
    //copy from jQuery
    function $extend() {
        var src, copyIsArray, copy, name, options, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;
    
        // Handle a deep copy situation
        if (typeof target === "boolean") {
            deep = target;
            target = arguments[1] || {};
            // skip the boolean and the target
            i = 2;
        }
    
        // Handle case when target is a string or something (possible in deep copy)
        if (typeof target !== "object" && typeof target != 'function') {
            target = {};
        }
    
        // extend jQuery itself if only one argument is passed
        if (length === i) {
            target = this;
            --i;
        }
    
        for (; i < length; i++) {
            // Only deal with non-null/undefined values
            if ((options = arguments[i]) != null) {
                // Extend the base object
                for (name in options) {
                    src = target[name];
                    copy = options[name];
    
                    // Prevent never-ending loop
                    if (target === copy) {
                        continue;
                    }
    
                    // Recurse if we're merging plain objects or arrays
                    if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && isArray(src) ? src : [];
    
                        } else {
                            clone = src && isPlainObject(src) ? src : {};
                        }
    
                        // Never move original objects, clone them
                        target[name] = $extend(deep, clone, copy);
    
                        // Don't bring in undefined values
                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }
    
        // Return the modified object
        return target;
    }
    ObjectSpace.each = function(clazz, fn) {
        var instances = $ObjectSpace[clazz],
            i, len, obj;
        if (!instances) return;
        for (; i < len; ++i) {
            obj = instances[i];
            fn.call(obj, obj.__id__);
        }
    };
    
    ObjectSpace.__objectSpace__ = $ObjectSpace;
    
    function instance$is(t) {
        var clazz = this.$getClass();
        if (t == Object) {
            return true;
        }
        while (clazz !== Object) {
            if (clazz === t) {
                return true;
            }
            if (!isFunction(clazz.parent)) {
                return false;
            }
            clazz = clazz.parent();
        }
        return false;
    }
    
    /**
     * print object in format #<typename a=1 b="s">
     */
    function instance$toString() {
        var type = this.$getClass().typename(),
            s = [],
            k, v;
        for (k in this) {
            if (this.hasOwnProperty(k)) {
                v = this[k];
    
                if (isString(v)) {
                    s.push('\n  ' + k + '="' + v + '"');
                } else if (isFunction(v)) {
                    continue;
                } else {
                    s.push('\n  ' + k + '=' + typename(v));
                }
            }
        }
        return '#<' + type + s.join('') + '>';
    }
    
    function getMethodsOn(obj) {
        var ret = [];
        for (var m in obj) {
            if (typeof obj[m] == 'function' && obj.hasOwnProperty(m) && m !== 'init' && m != 'initialize') {
                ret.push(m);
            }
        }
        return ret;
    }
    
    function array_grep(pattern) {
        var result = [];
        arrayEach(this, function(name) {
            if (name.match(pattern)) {
                result.push(name);
            }
        });
        return result;
    }
    
    function instance$methods(depth, thisIsAClass) {
        var ret = [],
            proto = true,
            clazz = true;
        if (thisIsAClass) {
            clazz = this;
            proto = this.prototype;
        } else {
            clazz = this.$getClass();
            proto = clazz.prototype;
        }
    
        if (typeof depth == 'undefined') {
            depth = 0;
        }
        while (depth >= 0 && clazz && proto) {
            ret = ret.concat(getMethodsOn(proto));
            clazz = clazz.parent ? clazz.parent() : null;
            proto = clazz ? clazz.prototype : null;
            depth--;
        }
        ret.grep = array_grep;
        return ret;
    }
    
    var metaDataCache = {};
    
    function initMetaData(typename, cacheKey, id) {
        var objSpace = $ObjectSpace[typename],
            metaData = objSpace[id] = {
                attrs: {},
                observers: {}
            };
        metaDataCache[cacheKey] = metaData;
        return metaData;
    }
    
    function instance$set(keyPath, value, notifyObservers) {
        var typename = this.$getClass().typename(),
            attrs, cacheKey = typename + '@' + this.__id__,
            metaData = metaDataCache[cacheKey];
    
        if (typeof notifyObservers == 'undefined') {
            notifyObservers = true;
        }
    
        if (!metaData) {
            metaData = initMetaData(typename, cacheKey, this.__id__);
        }
        var observers = metaData.observers;
        attrs = metaData.attrs;
        if (typeof value == 'function') {
            value = value(tryget(attrs, keyPath));
        }
        tryset(attrs, keyPath, value);
        if ( !! notifyObservers && observers) {
            for (var name in observers) {
                observers[name].call(this, value);
            }
        }
        return this;
    }
    
    function instance$attr(name, value) {
        var i, v;
        if (arguments.length === 0) {
            return instance$ivars.call(this);
        } else if (arguments.length == 1) {
            if (typeof name == 'string') {
                return this.$get(name);
            } else if (typeof name == 'object') {
                for (i in arguments[0]) {
                    if (arguments[0].hasOwnProperty(i)) {
                        v = arguments[0][i];
                        this[i] = v;
                        this.$set(i, v, false);
                    }
                }
                return this;
            }
        }
        //var vtype = typeof value;
        //if (vtype == 'string' || vtype == 'number' || vtype == 'boolean') {
        //    throw new Error('$attr only support reference type value!');
        //}
        this[name] = value;
        this.$set(name, value, false);
        return this;
    }
    
    function instance$get(keyPath, alternative) {
        var typename = this.$getClass().typename(),
            attrs, cacheKey = typename + '@' + this.__id__,
            metaData = metaDataCache[cacheKey];
    
        if (!metaData) {
            metaData = initMetaData(typename, cacheKey, this.__id__);
        }
        attrs = metaData.attrs;
        return keyPath ? tryget(attrs, keyPath, alternative) : attrs;
    }
    
    function instance$ivars() {
        var typename = this.$getClass().typename(),
            attrs, cacheKey = typename + '@' + this.__id__,
            metaData = metaDataCache[cacheKey];
    
        if (!metaData) {
            metaData = initMetaData(typename, cacheKey, this.__id__);
        }
    
        attrs = metaData.attrs;
        var ivars = [];
        for (var name in this) {
            if (!this.hasOwnProperty(name)) break;
            if (attrs.hasOwnProperty(name)) ivars.push(name);
        }
        return ivars;
    }
    
    function instance$observe_internal(keyPath, name, fn) {
        var typename = this.$getClass().typename(),
            cacheKey = typename + '@' + this.__id__,
            metaData = metaDataCache[cacheKey];
    
        if (!metaData) {
            metaData = initMetaData(typename, cacheKey, this.__id__);
        }
    
        var observers = metaData.observers;
        if (arguments.length === 0) return observers;
    
        if (typeof fn == 'function') {
            observers[name] = fn;
        } else if (fn === null) {
            observers[name] = null;
            delete observers[name];
        }
        return this;
    }
    
    function instance$observe(keyPath, name, fn) {
        if (typeof fn == 'undefined' && typeof name == 'function') {
            fn = name;
            name = keyPath;
        }
        if (arguments.length === 0) {
            return instance$observe_internal.call(this);
        } else {
            return instance$observe_internal.call(this, keyPath, name, fn);
        }
    }
    
    function instance$unobserve(keyPath, name) {
        return instance$observe_internal.call(this, keyPath, name, null);
    }
    
    function instance$dispose(returnCount) {
        var typename = this.$getClass().typename(),
            objSpace, id;
    
        //delete meta data
        id = this.__id__;
        objSpace = $ObjectSpace[typename];
        objSpace[id] = null;
        delete objSpace[id];
        objSpace.count -= 1;
    
        return returnCount === true ? objSpace.count : this;
    }
    
    /**
     * Every instance created with `Class` which created with type.Class or type.create
     * havs a $getClass function with which you to get it's class object
     * `class` is a reserved word so we use `getClass` instead
     */
    function clazz$getClass() {
        return Class;
    }
    
    function instance$noop() {}
    
    function instance$help() {
        var methods = this.$methods();
        if (!methods.length) {
            methods = this.$methods(1);
        }
        return {
            type: this.$class.typename(),
            parentType: this.$class.parent().typename(),
            attributes: this.$attr(),
            methods: this.$methods(),
            events: this.$class.Events
        };
    }
    
    var clazz$parent = clazz$getClass;
    
    /**
     * define methods of a class
     * inspired by http://ejohn.org/blog/simple-javascript-inheritance/
     */
    function clazz$methods(methods) {
        if (!methods) {
            return instance$methods.call(this, false, true);
        }
        var name, parentProto = this.parent().prototype,
            m;
        this.base = instance$noop;
        for (name in methods) {
            if (!methods.hasOwnProperty(name)) continue;
    
            if (!parentProto[name]) {
                /*
                m = methods[name];
                if (name == 'init') {
                    //init method MUST do nothing and just return this
                    //if no argument provide
                    this.prototype.init = (function(method) {
                        return function() {
                            //if (arguments.length === 0) {
                            //    return this;
                            //}
                            return method.apply(this, arguments);
                        };
                    })(m);
                } else {
                    //if parent class does not define method with this name
                    //just added it to prototype(instance method)
                    this.prototype[name] = m;
                }
                */
                this.prototype[name] = methods[name];
                continue;
            }
    
            //if parent already defined a method with the same name
            //we need to wrap provided function to make call to
            //this.base() possible by replace this.base to
            //parent method on the fly
            if (name != 'init') {
                this.prototype[name] = (function(name, method) {
                    return function() {
                        //bakcup existing property named base
                        var t = this.base,
                            r;
    
                        //make this.base to parent's method
                        //so you can call this.base() in your method
                        this.base = parentProto[name];
    
                        //call the method
                        /*! you probably wanto step into this method call when you debugging */
                        r = method.apply(this, arguments);
    
                        //restore base property
                        if (typeof t != 'undefined') {
                            this.base = t;
                        } else {
                            this.base = null;
                            delete this.base;
                        }
                        return r;
                    };
                }(name, methods[name]));
            } else {
                this.prototype.init = (function(method) {
                    return function() {
                        //if (arguments.length === 0) {
                        //    return this;
                        //}
                        var t = this.base,
                            r;
                        this.base = parentProto.init;
                        r = method.apply(this, arguments); //step into...
                        this.base = t;
                        return r;
                    };
                })(methods.init);
            }
        }
        return this;
    }
    
    function clazz$aliases(aliases) {
        var from, to;
        for (from in aliases) {
            if (!aliases.hasOwnProperty(from)) continue;
            to = aliases[from];
            this.prototype[from] = this.prototype[to];
        }
        return this;
    }
    
    var reStaticNames = /^[A-Z]|^[$_]+[A-Z]+/,
        staticNameErrorMsg = 'Statics name must begin with upper case letter or one or more "$" or "_" followed by upper case letter';
    
    function clazz$statics(arg) {
        var name, props = arg;
        if (typeof arg == 'undefined') {
            props = {};
            for (name in this) {
                if (this.hasOwnProperty(name) && name.match(reStaticNames)) {
                    props[name] = this[name];
                }
            }
            return props;
        } else {
            if (isFunction(arg)) {
                props = arg();
            }
    
            for (name in props) {
                if (!props.hasOwnProperty(name)) continue;
                if (!reStaticNames.test(name)) {
                    throw new Error(staticNameErrorMsg);
                }
                this[name] = props[name];
            }
        }
        return this;
    }
    
    function clazz$events(events) {
        if (arguments.length === 0) return this.Events;
        var Events = this.Events;
    
        objectEach(events, function(evt, name) {
            Events[name] = evt;
        });
        return this;
    }
    
    function clazz$copyParentsEvents() {
        var events = true,
            clazz = this,
            Events = this.Events;
        if (!Events) return;
    
        clazz = clazz.parent ? clazz.parent() : null;
        events = clazz ? clazz.Events : null;
    
        while (events) {
            objectEach(events, function(evt, name) {
                Events[name] = evt;
            });
            clazz = clazz.parent ? clazz.parent() : null;
            events = clazz ? clazz.Events : null;
        }
    }
    
    function clazz$extend() {
        var len = arguments.length,
            name, methods;
        if (len < 2) {
            name = this.typename ? this.typename() + '$' : '';
        } else {
            name = arguments[0];
            methods = arguments[1];
        }
        if (len === 0) {
            return new Class(name, this);
        } else if (len === 1) {
            name = this.typename ? this.typename() + '$' : '';
            return new Class('', this).methods(arguments[1]);
        }
        return new Class(name, this).methods(methods);
    }
    
    function clazz$readonly(name, initValue, force) {
        if ( !! force || !isFunction(this[name])) {
            this['get' + name] = function() {
                return initValue;
            };
        } else throw Error('Readonly property `' + name + '` already defined!');
    }
    
    function clazz$options(opts) {
        var typename = this.typename(),
            cacheKey = typename + '@static',
            metaData = metaDataCache[cacheKey];
    
        if (!metaData) {
            metaData = initMetaData(typename, cacheKey, 'static');
        }
        if (arguments.length == 1) {
            if (metaData.createOptions) {
                //If this is not the first time YourClass.options was called
                //return a updated copy of createOptions.
                //Typically in init method of YourClass creating instance.options:
                // this.$attr('options', YourClass.options(customOpts));
                return $extend(true, {}, metaData.createOptions, opts || {});
            } else {
                //This is the first time YourClass.options is called
                //Typically when defining YourClass.
                var parent = this.parent(),
                    popt, args;
                if (typeof parent.options == 'function') {
                    args = [true, {}];
                    popt = parent.options();
                    if (popt) args.push(popt);
                    args.push(opts);
                    metaData.createOptions = $extend.apply(null, args);
                } else {
                    metaData.createOptions = opts;
                }
            }
        } else {
            return metaData.createOptions;
        }
        return this;
    }
    
    
    /**
     * The Ultimate `Class`
     */
    function Class(name, parent) {
        var objSpace;
        if (!$ObjectSpace[name]) {
            objSpace = $ObjectSpace[name] = {
                count: 0
            };
        } else {
            throw new Error(name + ' already defined!');
        }
        // use underscore as name for less debugging noise
        function instance$getClass() {
            return _;
        }
        var _ = function() {
            var ret, init, id;
            //all meta-programming related methods and propertys are started with $
            this.$getClass = instance$getClass;
            this.$toString = instance$toString;
            this.$methods = instance$methods;
            this.$is = instance$is;
            this.$class = _;
    
            /**
             * key-value observing support
             * method name starts with $ to avoid conflicts
             */
            this.$set = instance$set;
            this.$get = instance$get;
            this.$attr = instance$attr;
            this.$observe = instance$observe;
            this.$unobserve = instance$unobserve;
            this.$dispose = instance$dispose;
            this.$help = instance$help;
    
            id = this.__id__ = objSpace.count;
            objSpace[id] = {};
            objSpace.count += 1;
    
            if (isFunction(_.prototype.init)) {
                init = this.init;
                if (!isFunction(init)) {
                    init = _.prototype.init;
                }
                ret = init.apply(this, arguments); //step into ..
            } else if (isFunction(_.prototype.initialize)) {
                init = this.initialize;
                if (!isFunction(init)) {
                    init = _.prototype.initialize || _.prototype.init;
                }
                ret = init.apply(this, arguments);
            }
            return ret;
        };
        _.$getClass = clazz$getClass;
        _.methods = clazz$methods;
        _.aliases = clazz$aliases;
        _.statics = clazz$statics;
        _.options = clazz$options;
        _.typename = function() {
            return name;
        };
        _.parent = function() {
            return parent || _.prototype.constructor;
        };
        _.extend = clazz$extend;
        _.readonly = clazz$readonly;
        _.constructorOf = function(obj) {
            return obj instanceof _;
        };
        _.events = clazz$events;
        _.Events = {};
        clazz$copyParentsEvents.call(_);
        if (parent) {
            //create a instance of parent without invoke constructor
            //object function is in type.js
            _.prototype = object(parent.prototype); //, parent.prototype || parent);
            //_.prototype = new parent();
    
            //this will make extends jQuery failed
            //cause jQuery will call constructor to create new instance
            //_.prototype.constructor = Class;
    
            /**
             * maintain inheritance hierarchy
             */
            var parentName = (parent.typename && parent.typename()) || typename(parent);
            if (!Classes[parentName]) {
                Classes[parentName] = {};
            }
            Classes[parentName][name] = _;
        }
        return _;
    }
    
    Class.$getClass = clazz$getClass;
    Class.methods = clazz$methods;
    Class.extend = clazz$extend;
    Class.readonly = clazz$readonly;
    Class.typename = function() {
        return 'Class';
    };
    Class.parent = clazz$parent;
    Class.toString = instance$toString;
    
    /**
     * create
     * create class
     * @param  {String} typename, class name
     * @param  {Function} parent, parent class(function)
     * @param  {Object} methods
     * @return {Class}
     * @remark
     * type.create('ClassName');
     * type.create(Parent);
     * type.create({method:function(){}});
     * type.create('ClassName',Parent);
     * type.create('ClassName',{method:function(){}});
     * type.create(Parent,{method:function(){}});
     * type.create('ClassName',Parent,{method:function(){});
     */
    function create(typename, parent, methodsOrFn) {
        var methods, len = arguments.length,
            arg0 = arguments[0],
            arg1 = arguments[1],
            noop = instance$noop,
            ret;
    
        if (len === 0) {
            //type.create();
            ret = new Class('', Object, noop);
        } else if (len === 1) {
            if (isString(arg0)) {
                //type.create('ClassName');
                ret = new Class(typename, Object, noop);
            } else if (isFunction(arg0)) {
                //type.create(Parent);
                ret = new Class('', arg0, noop);
            } else if (isPlainObject(arg0)) {
                //type.create({method:function(){}});
                ret = new Class('', Object, noop).methods(arg0);
            }
        } else if (len === 2) {
            if (isString(arg0) && isFunction(arg1)) {
                //type.create('ClassName',Parent);
                ret = new Class(arg0, arg1, noop);
            } else if (isString(arg0) && isPlainObject(arg1)) {
                //type.create('ClassName',{method:function(){}})
                ret = new Class(arg0, Object, noop).methods(arg1);
            } else if (isFunction(arg0) && isPlainObject(arg1)) {
                //type.create(Parent,{method:function(){}})
                ret = new Class('', arg0).methods(arg1);
            }
        } else {
            //type.create('ClassName',Parent,{method:function(){});
            typename = isString(typename) ? typename : '';
            parent = isFunction(parent) ? parent : Object;
            methods = (isFunction(methodsOrFn) ? methodsOrFn() : methodsOrFn) || {};
            ret = new Class(typename, parent).methods(methods);
        }
        if (callbacks.length > 0) {
            dispatchEvent('create', typename, ret);
        }
        return ret;
    }
    
    var callbacks = [];
    
    function onCreate(callback) {
        callbacks.push(callback);
    }
    
    function dispatchEvent(eventName, arg) {
        arrayEach(callbacks, function(cbk) {
            cbk(eventName, arg);
        });
    }
    
    exports['isPrimitive'] = isPrimitive;
    exports['isUndefined'] = isUndefined;
    exports['isNull'] = isNull;
    exports['isNullOrUndefined'] = isNullOrUndefined;
    exports['isUndefinedOrNull'] = isUndefinedOrNull;
    exports['containsNullOrUndefined'] = containsNullOrUndefined;
    exports['isEmpty'] = isEmpty;
    exports['isRegExp'] = isRegExp;
    exports['isString'] = isString;
    exports['isArray'] = isArray;
    exports['isArrayLike'] = isArrayLike;
    exports['isFunction'] = isFunction;
    exports['isNumber'] = isNumber;
    exports['isInteger'] = isInteger;
    exports['isFloat'] = isFloat;
    exports['isFiniteNumber'] = isFiniteNumber;
    exports['isBoolean'] = isBoolean;
    exports['isPlainObject'] = isPlainObject;
    exports['isEmptyObject'] = isEmptyObject;
    exports['isElement'] = isElement;
    exports['isDate'] = isDate;
    exports['typename'] = typename;
    exports['object'] = object;
    exports['hasSameTypeName'] = hasSameTypeName;
    exports['isWindow'] = isWindow;
//     exports['Boolean'] = Boolean;
//     exports['Number'] = Number;
//     exports['String'] = String;
//     exports['Undefined'] = Undefined;
//     exports['Integer'] = Integer;
    exports['Class'] = Class;
    exports['Classes'] = Classes;
    exports['ObjectSpace'] = ObjectSpace;
    exports['create'] = create;
    exports['onCreate'] = onCreate;
    exports.__doc__ = "JavaScript Type System Supplement";
    exports.VERSION = '0.0.1';
    return exports;
}));
//end of $root.lang.type
/**
 * #Function#
 * ========
 * - Dependencies: 
 * - Version: 0.0.1
 */

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('lang/fn', [], factory);
    } else if (typeof module === 'object') {
        module.exports = factory(exports, module, require);
    } else {
        var exports = $root._createNS('$root.lang.fn');
        factory(exports);
    }
}(this, function(exports) {
    'use strict';
    exports = exports || {};
    
    ///exports
    
    var _toString = Object.prototype.toString,
        _slice = Array.prototype.slice,
        isFunction = function(f) {
            return typeof f == 'function';
        },
        isArray = Array.isArray || function isArray(arg) {
            return _toString.call(arg) == '[object Array]';
        },
        firstArgMustBeFn = 'first argument must be a function';
    
    /**
     * A do-nothing-function
     * @return {Undefined}
     */
    function noop() {}
    
    function alwaysTrue() {
        return true;
    }
    
    function alwaysFalse() {
        return false;
    }
    
    function alwaysNull() {
        return null;
    }
    
    function alwaysUndefined() {
        return;
    }
    
    function return1st(a) {
        return a;
    }
    
    function return2nd(a, b) {
        return b;
    }
    
    function return3rd(a, b, c) {
        return c;
    }
    
    function return4th(a, b, c, d) {
        return d;
    }
    
    /**
     * bind
     * bind fn to context just like calling this fn on context
     * @param  {Function} fn function to be bind to the context
     * @param  {Any}   context this value
     * @return {Function}
     */
    function bind(self, context) {
        if (!isFunction(self)) {
            throw TypeError(firstArgMustBeFn);
        }
    
        var args = _slice.call(arguments, 2);
    
        return function() {
            var args2 = args;
            if (arguments.length > 0) {
                args2 = args.concat(_slice.call(arguments));
            }
            return self.apply(context, args2);
        };
    }
    
    /**
     * bindTimeout
     * @param  {Function} fn
     * @param  {Any}   context
     * @param  {Integer}   ms
     * @return {Function}
     */
    function bindTimeout(self, context, ms) {
        if (!isFunction(self)) {
            throw TypeError(firstArgMustBeFn);
        }
    
        var args = _slice.call(arguments, 3);
    
        return function() {
            var args2 = args;
            if (arguments.length > 0) {
                args2 = args.concat(_slice.call(arguments));
            }
    
            var handle = setTimeout(function() {
                clearTimeout(handle);
                self.apply(context, args2);
            }, ms || 0);
        };
    }
    
    /**
     * if first parameter is a function, call it with second parameter as `this`
     * remaining parameters as arguments
     * @param  {Any} maybeFunc
     * @param  {Any} context
     * @return {Any}
     */
    function call(self, context) {
        if (!isFunction(self)) return;
        var args = _slice.call(arguments, 2);
        return self.apply(context, args);
    }
    
    function apply(self, context, args) {
        if (!isFunction(self)) return;
        //ie7 and 8 require 2nd argument for Function.prototype.apply must be a array or arguments
        args = _slice.call(args);
        return self.apply(context, args);
    }
    
    
    /**
     * bindCallNew
     * bind parameters to a constructor
     * @param  {Function} ctor, constructor
     * @return {Function} a function expecting 0 paramter, returning an instance create with ctor
     */
    function bindCallNew() {
        var ctor, args;
        ctor = arguments[0];
        if (!isFunction(ctor)) {
            throw Error(firstArgMustBeFn);
        }
        args = arguments;
        if (args.length > 8) {
            throw Error("second argument.length must less than 8, you provide " + args.len);
        }
        return function() {
            return callNew.apply(null, args);
        };
    }
    
    /**
     * bindApplyNew
     * @param  {Function} ctor
     * @param  {Array} args
     * @return {Function}}
     */
    function bindApplyNew(ctor, args) {
        var len;
        if (!isArray(args)) {
            throw Error('Arguments list has wrong type: second argument must be an array');
        }
        if (args.length > 7) {
            throw Error("second argument.length must less than 8, you provide " + args.len);
        }
        return function() {
            return applyNew(ctor, args, 'bindApplyNew');
        };
    }
    
    /**
     * callNew
     * call `new constructor` with given parameters
     * @param  {Function} ctor, constructor
     * @return {Function} an instance create with ctor and given parameters
     */
    function callNew(ctor) {
        var argLen = arguments.length,
            args;
        if (argLen === 1) {
            args = [];
        } else if (argLen > 1) {
            args = _slice.call(arguments, 1);
        } else if (arglen === 0) {
            throw Error('`callNew` needs at least 1 parameter');
        } else if (argLen > 7) {
            throw Error("`callNew` supports up to 7 args, you provide " + args.len);
        }
        return applyNew(ctor, args);
    }
    
    /**
     * applyNew
     * @param  {Function} ctor
     * @param  {Array} args
     * @return {object}
     */
    function applyNew(ctor, args) {
        var len = args.length;
        switch (len) {
            case 0:
                return new ctor();
            case 1:
                return new ctor(args[0]);
            case 2:
                return new ctor(args[0], args[1]);
            case 3:
                return new ctor(args[0], args[1], args[2]);
            case 4:
                return new ctor(args[0], args[1], args[2], args[3]);
            case 5:
                return new ctor(args[0], args[1], args[2], args[3], args[4]);
            case 6:
                return new ctor(args[0], args[1], args[2], args[3], args[4], args[5]);
            case 7:
                return new ctor(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
        }
    }
    
    function log(fn) {
        if (typeof console !== 'undefined' && typeof console.log == 'function') {
            console.log(arguments);
        }
        fn.apply(this, arguments);
    }
    
    /**
     * ntimes
     * return a function which can be called n times
     * @param  {Integer}   n
     * @param  {Function} fn
     * @return {Function}
     */
    function ntimes(self, n) {
        var ret;
        return function() {
            if (n > 0) {
                ret = self.apply(null, arguments);
                n--;
                return ret;
            } else return ret;
        };
    }
    
    /**
     * once
     * return a function which can be called only once
     * @param  {Function} fn
     * @return {Function}
     */
    function once(self) {
        return ntimes(1, self);
    }
    
    /**
     * delay
     * @param  {Function} fn
     * @param  {Integer}   ms
     * @param  {[type]} context [description]
     * @return {Function}
     */
    function delay(self, ms, context) {
        if (!isFunction(self)) {
            throw TypeError(firstArgMustBeFn);
        }
        var args = _slice.call(arguments, context ? 3 : 2),
            h = setTimeout(function() {
                clearTimeout(h);
                self.apply(context, args);
            }, ms);
    }
    
    /**
     * memoize
     * @param  {Function} self
     * @param  {Function} hashFn
     * @return {Function}
     */
    function memoize(self, hashFn) {
        var cache = {};
        return function() {
            var key = arguments[0],
                ret;
            if (isFunction(hashFn)) {
                key = hashFn.apply(null, arguments);
            }
            if (key in cache) {
                return cache[key];
            }
    
            ret = self.apply(null, arguments);
            cache[key] = ret;
            return ret;
        };
    }
    
    function wrap(self, wrapper) {
        if (isFunction(self)) {
            throw TypeError(firstArgMustBeFn);
        }
        return function() {
            return wrapper(self);
        };
    }
    
    function compose() {
        var args = _slice.call(arguments);
        return function() {
            var i = 0,
                len = args.length,
                fn,
                ret = arguments;
            for (; i < len; ++i) {
                fn = args[i];
                if (typeof fn != 'function') continue;
                ret = fn.apply(null, ret);
            }
            return ret;
        };
    }
    
    function debounce(self, delay, context) {
        var timer = null;
        return function() {
            var args = Array.prototype.slice.call(arguments);
            clearTimeout(timer);
            timer = setTimeout(function() {
                clearTimeout(timer);
                timer = null;
                self.apply(context, args);
            }, delay);
        };
    }
    
    exports['noop'] = noop;
    exports['alwaysTrue'] = alwaysTrue;
    exports['alwaysFalse'] = alwaysFalse;
    exports['alwaysNull'] = alwaysNull;
    exports['alwaysUndefined'] = alwaysUndefined;
    exports['return1st'] = return1st;
    exports['return2nd'] = return2nd;
    exports['return3rd'] = return3rd;
    exports['return4th'] = return4th;
    exports['bind'] = bind;
    exports['bindTimeout'] = bindTimeout;
    exports['call'] = call;
    exports['apply'] = apply;
    exports['bindCallNew'] = bindCallNew;
    exports['bindApplyNew'] = bindApplyNew;
    exports['callNew'] = callNew;
    exports['applyNew'] = applyNew;
    exports['log'] = log;
    exports['ntimes'] = ntimes;
    exports['once'] = once;
    exports['delay'] = delay;
    exports['memoize'] = memoize;
    exports['wrap'] = wrap;
    exports['compose'] = compose;
    exports.__doc__ = "Function";
    exports.VERSION = '0.0.1';
    return exports;
}));
//end of $root.lang.fn
/**
 * #Number Utils#
 * ============
 * - Dependencies: `lang/type`
 * - Version: 0.0.1
 */

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('lang/number', ['lang/type'], factory);
    } else if (typeof module === 'object') {
        var $root_lang_type = require('lang/type');
        module.exports = factory($root_lang_type, exports, module, require);
    } else {
        var exports = $root._createNS('$root.lang.number');
        factory($root.lang.type, exports);
    }
}(this, function(_type, exports) {
    'use strict';
    exports = exports || {};
    
    //vars
    var rand$ = Math.random,
        floor$ = Math.floor,
        max$ = Math.max,
        min$ = Math.min;
    
    /**
     * max
     * return maximum value
     * @return {Any}
     * @remark
     *  max([1,2,3]) == 3
     *  max(1,2,3) == 3
     */
    function max() {
        var arg = arguments[0],
            len = arguments.length,
            a, b;
        if (len === 1 && _type.isArray(arg)) {
            return max$.apply(Math, arg);
        } else if (len === 2) {
            a = arguments[0];
            b = arguments[1];
            return a > b ? a : b;
        } else {
            return max$.apply(Math, arguments);
        }
    }
    
    /**
     * min
     * return minimum value
     * @return {Any}
     * @remark
     *  min([1,2,3]) == 1
     *  min(1,2,3) == 1
     */
    function min() {
        var arg = arguments[0],
            len = arguments.length,
            a, b;
        if (len === 1 && _type.isArray(arg)) {
            return min$.apply(Math, arg);
        } else if (len === 2) {
            a = arguments[0];
            b = arguments[1];
            return a < b ? a : b;
        } else {
            return min$.apply(Math, arguments);
        }
    }
    
    /**
     * confined
     * input number will be confined between [min, max]
     * @param  {int} self, input
     * @param  {int} min
     * @param  {int}} max
     * @param  {bool} cycle, e.g. if input equal max + 2, output will be min+1 rather than max
     * @return {int}
     */
    function confined(self, mi, ma, cycle) {
        var dis, min = Math.min(mi, ma),
            max = Math.max(mi, ma);
        if (isNaN(self) || !isFinite(self) || min == max) return min;
        if (cycle) {
            if (self >= min && self <= max) return self;
            dis = Math.abs(max - min) + 1;
            if (self < min) {
                return max - (Math.abs(min - self - 1) % dis);
            } else /* (self > max) */ {
                return min + (Math.abs(self - max - 1) % dis);
            }
        } else {
            if (self >= max) {
                return max;
            } else if (self <= min) {
                return min;
            } else return self;
        }
    }
    
    /**
     * rand
     * return a random integer between [from, to]
     * @param  {int} from, lower bounds
     * @param  {int} to, upper bounds
     * @return {int} random integer
     */
    function rand(from, to) {
        var len = arguments.length,
            ret, r = rand$(),
            a, b;
        if (len === 0) {
            ret = r;
        } else if (len === 1) {
            a = 0;
            b = floor$(arguments[0]);
            ret = r* (b - a) + a;
        } else if (len >= 2 && from == to) {
            return from;
        } else {
            a = min$(from, to);
            b = max$(from, to);
            ret = r* (b - a) + a;
        }
        return Math.round(ret);
    }
    
    //     exports['random'] = random;
    exports['max'] = max;
    exports['min'] = min;
    exports['confined'] = confined;
    exports['rand'] = rand;
    exports.__doc__ = "Number Utils";
    exports.VERSION = '0.0.1';
    return exports;
}));
//end of $root.lang.number
/**
 * #Arguments Utils#
 * ===============
 * - Dependencies: `lang/fn`,`lang/type`
 * - Version: 0.0.1
 */

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('lang/arguments', ['lang/fn', 'lang/type'], factory);
    } else if (typeof module === 'object') {
        var $root_lang_fn = require('lang/fn'),
            $root_lang_type = require('lang/type');
        module.exports = factory($root_lang_fn, $root_lang_type, exports, module, require);
    } else {
        var exports = $root._createNS('$root.lang.arguments');
        factory($root.lang.fn, $root.lang.type, exports);
    }
}(this, function(_fn, _type, exports) {
    'use strict';
    exports = exports || {};
    
    ///vars
    var _slice = Array.prototype.slice,
        varArgTypeMapping = {
            "string": "string",
            "date": _type.isDate,
            "undefined": "undefined",
            "null": _type.isNull,
            "array": _type.isArray,
            "arrayLike": _type.isArrayLike,
            "nullOrUndefined": _type.isNullOrUndefined,
            "empty": _type.isEmpty,
            "number": "number",
            "int": _type.isInteger,
            "integer": _type.isInteger,
            "float": _type.isFloat,
            "function": "function",
            "->": "function",
            "boolean": "boolean",
            "bool": "boolean",
            "object": "object",
            "plainObject": _type.isPlainObject,
            "{*}": _type.isPlainObject,
            "{}": _type.isEmptyObject,
            "primitive": _type.isPrimitive,
            "emptyObject": _type.isEmptyObject,
            "regex": _type.isRegExp,
            "regexp": _type.isRegExp,
            "*": _fn.alwaysTrue
        };
    ///exports
    
    /**
     * toArray
     * convert `arguments` into an array
     * @param  {Arguments} args
     * @param  {Integer} n
     * @return {Array}
     */
    function toArray(args, n) {
        return _slice.call(args, n || 0);
    }
    
    /**
     * asArray
     * return arguments as an array
     * @return {Array}
     */
    function asArray() {
        return _slice.call(arguments);
    }
    
    function registerPlugin(name, pred) {
        if (arguments.length < 2) {
            throw Error('registerPlugin needs 2 parameters');
        } else if (typeof pred != 'function') {
            throw Error('registerPlugin needs 2nd parameter to be a function');
        }
        name = name.toString();
        varArgTypeMapping[name] = function() {
            return !!pred.apply(null, arguments);
        };
    }
    
    function check(pred, arg) {
        var t = varArgTypeMapping[pred],
            i,
            regexMatch, pattern;
        if (typeof t == 'string') {
            if (typeof arg != t) {
                return false;
            }
        } else if (typeof pred == 'function') {
            if (!pred(arg)) {
                return false;
            }
        } else if (typeof t == 'function') {
            if (!t(arg)) {
                return false;
            }
        } else {
            regexMatch = pred.match(/array<(.*?)>/);
            if (regexMatch) {
                if (arg.length > 0 && _type.isArray(arg)) {
                    pattern = regexMatch[1];
                    if (pattern == '*') return true;
                    for (i = 0; i < arg.length; ++i) {
                        if (!check(varArgTypeMapping[pattern], arg[i])) {
                            return false;
                        }
                    }
                } else return false;
            } else {
                throw Error('unsupported type:' + pred + ' in function varArg');
            }
        }
        return true;
    }
    /**
     * varArg
     * handle variadic arguments
     * @param  {Arguments} args
     * @return {varArg}
     * @remark
     *     function fn_with_variadic_args() {
     *         return varArg(arguments)
     *             .when(function(){
     *                 //no params
     *                 return ['',0];
     *             })
     *             .when('string',_type.isNumber,function(s,i){
     *                 //first param is a string and second param is a number
     *                 return [s,i];
     *             })
     *             .when('*','*',function(a,b){
     *                 //two params which is not string and number at the same time
     *                 return [String(a), Number(b)]
     *             })
     *             .invokeNew(Person);
     *     }
     */
    function varArg(args, context) {
        var signatures = [],
            otherwise;
    
        function postprocess(ret) {
            if (ret) {
                if (typeof ret.length == 'undefined') {
                    return [ret];
                } else if (_type.isArray(ret)) {
                    return ret;
                } else {
                    return toArray(ret);
                }
            }
        }
    
        function getArgs() {
            var i = 0,
                j = 0,
                t, f,
                sigCount = signatures.length,
                paramCount,
                sig,
                pred,
                match,
                regexMatch,
                ret;
    
            //iterate over different signatures
            for (; i < sigCount; ++i) {
                sig = signatures[i];
                paramCount = sig.types.length;
                match = true;
                //iterate over every type of current signature
                for (;
                    (j === 0 && paramCount === 0) || j < paramCount; ++j) {
                    if (paramCount !== args.length) {
                        match = false;
                        break;
                    }
                    pred = sig.types[j];
                    if (pred == '*') {
                        //skip type checking if meet '*''
                        continue;
                    }
                    match = check(pred, args[j]);
                    if (!match) break;
                }
                if (match) {
                    ret = sig.fn.apply(context, args);
                    return postprocess(ret);
                }
            }
            if (typeof otherwise == 'function') {
                ret = otherwise.call(context, toArray(args));
                return postprocess(ret);
            }
            return [];
        }
        return {
            when: function() {
                var types = toArray(arguments),
                    fn = types.pop();
                signatures.push({
                    fn: fn,
                    types: types
                });
                return this;
            },
            same: function() {
                var types = toArray(arguments),
                    fn = types.pop(),
                    i = 0,
                    len = types.length;
                for (; i < len; ++i) {
                    signatures.push({
                        fn: fn,
                        types: types[i]
                    });
                }
                return this;
            },
            otherwise: function(fn) {
                otherwise = fn;
                return this;
            },
            bind: function(func) {
                var args = getArgs();
                return typeof func == 'undefined' ? _fn.noop : function() {
                    return _fn.apply(func, context, args);
                };
            },
            bindNew: function(ctor) {
                return _fn.bindApplyNew(ctor, getArgs());
            },
            invoke: function(func) {
                return func.apply(context, getArgs());
            },
            invokeNew: function(ctor) {
                return _fn.applyNew(ctor, getArgs());
            },
            args: function(i) {
                return getArgs()[i];
            },
            resolve: function() {
                getArgs();
            },
            signatures: function() {
                var ret = [],
                    i, len = signatures.length;
                for (; i < len; ++i) {
                    ret.push(signatures.types);
                }
                return ret;
            }
        };
    }
    // src/lang/arguments.ext.js
    /**
     * Arguments Module Extension
     */
    /* varArgTypeMapping must be exist */
    if (varArgTypeMapping) {
    
        var vat = varArgTypeMapping,
            rehtmltag = /^\s*<.*>\s*$/,
            rhex1 = /^[0-9a-f]{3}$/ig,
            rhex2 = /^[0-9a-f]{6}$/ig;
    
        vat.gt0 = function(n) {
            return _type.isNumber(n) && n > 0;
        };
    
        vat.lt0 = function(n) {
            return _type.isNumber(n) && n < 0;
        };
    
        vat.egt0 = function(n) {
            return _type.isNumber(n) && n >= 0;
        };
    
        vat.elt0 = function(n) {
            return _type.isNumber(n) && n <= 0;
        };
    
        vat.pattern = vat['string|regexp'] = vat['regexp|string'] = function(s) {
            return _type.isString(s) || _type.isRegExp(s);
        };
    
        vat.jquery = function(jq) {
            return jq instanceof jQuery;
        };
    
        vat.element = function(ele) {
            return ele && ele.nodeType === 1;
        };
    
        vat.jqueryOrElement = function(arg) {
            return (arg && arg.nodeType === 1) || arg.jquery;
        };
    
        vat.jqueryOrElementOrHtml = function(arg) {
            return (arg && arg.nodeType === 1) || arg.jquery || (typeof s == 'string' && s.match(rehtmltag) && s.length >= 3);
        };
    
        vat.htmlFragment = function(s) {
            return typeof s == 'string' && s.match(rehtmltag) && s.length >= 3;
        };
    
        vat.idOrClass = function(s) {
            return s && s.length > 0 && (s.charAt(0) === '#' || s.charAt(0) === '.');
        };
    
        vat.hexColorString = function(s) {
            return rhex2.test(s) || rhex1.test(s);
        };
    }
    
    exports['toArray'] = toArray;
    exports['asArray'] = asArray;
    exports['varArg'] = varArg;
    exports['registerPlugin'] = registerPlugin;
    exports.__doc__ = "Arguments Utils";
    exports.VERSION = '0.0.1';
    return exports;
}));
//end of $root.lang.arguments
/**
 * #String Utils#
 * ============
 * - Dependencies: `lang/type`
 * - Version: 0.0.1
 */

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('lang/string', ['lang/type'], factory);
    } else if (typeof module === 'object') {
        var $root_lang_type = require('lang/type');
        module.exports = factory($root_lang_type, exports, module, require);
    } else {
        var exports = $root._createNS('$root.lang.string');
        factory($root.lang.type, exports);
    }
}(this, function(_type, exports) {
    'use strict';
    exports = exports || {};
    
var _trim = String.prototype.trim;
/**
 * ##str.toInt(s)##
 * convert string s into integer.
 * @param {Any} s
 * @param {Integer} radix
 * @return {Integer} integer
 *
 * ```javascript
 * str.toInt('42') //=> 42
 * str.toInt('42xx') //=> 42
 * str.toInt('xx42') //=> NaN
 * ```
 */
function toInt(self, radix) {
    return parseInt(self, radix || 10);
}

/**
 * ##str.toFloat(s)##
 * convert string s into float.
 * @param {Any} s
 * @param {int} radix
 * @return {float}
 */
function toFloat(self, radix) {
    return parseFloat(self, radix || 10);
}

/**
 * ##str.capitalize(s)##
 * @param  {String} self
 * @return {String} capitalized string
 *
 * ```javascript
 * str.capitalize('javaScript') //=> JavaScript
 * ```
 */
function capitalize(self) {
    return self.replace(/^([a-zA-Z])/, function(a, m, i) {
        return m.toUpperCase();
    });
}

/**
 * ##str.isBlank(s)##
 * return true if given string is blank
 * @param  {String}  self
 * @return {Boolean} true|false
 *
 * ```javascript
 * str.isBlank(" ") //=> true
 * str.isBlank(" \t  ") //=> true
 * ```
 */
function isBlank(self) {
    return !!self.match(/^\s*$/);
}

/**
 * ##str.lstrip(s)##
 * remove leading whitespace in s
 * @param  {String} self
 * @return {String} string
 *
 * ```javascript
 * str.lstrip("  a ") //=> "a "
 * ```
 */
function lstrip(self) {
    return self.replace(/^\s+/, '');
}

/**
 * ##str.rstrip(s)##
 * remove trailing whitespace in s
 * @param  {String} self
 * @return {String} string
 *
 * ```javascript
 * str.rstrip("  a ") //=> "  a"
 * ```
 */
function rstrip(self) {
    return self.replace(/\s+$/, '');
}

/**
 * ##str.strip(s)##
 * remove leading and trailing whitespace in s
 * @param  {String} self
 * @return {String} string
 *
 * ```javascript
 * str.rstrip("  a ") //=> "a"
 * ```
 */
var strip = _trim ? function(self) {
    return _trim.call(self);
} : function(self) {
    return self.replace(/^\s+|s+$/g, '');
};

/**
 * ##str.chomp(s[,substr])##
 * remove trailing newline and carriage in s.
 * trailing substr will also be removed if given
 * @param  {String} self
 * @param  {String} substr
 * @return {String} string
 */
function chomp(self, substr) {
    if (typeof substr !== 'undefined') {
        return self.replace((new RegExp(substr + '$')), '');
    }
    return self.replace(/[\r\n]$/, '');
}

/**
 * ##str.chop(s)##
 * @param  {String} self
 * @return {String} string
 */
function chop(self) {
    if (typeof s == 'undefined' || isEmpty(s)) {
        return '';
    }
    var a = s.substr(s.length - 1),
        b = s.substr(s.length - 2);
    if (a === '\n' && b === '\r') {
        return a.substring(0, a.length - 2);
    }
    return a.substring(0, a.length - 1);
}

/**
 * ##str.reverse(s)##
 * reverse a string
 * @param  {String} self
 * @return {String} string
 */
function reverse(self) {
    return self.split('').reverse.join('');
}

/**
 * ##str.repeat(s,n)##
 * repeate s n times. if n is negative return empty string
 * @param  {String} self
 * @param  {Integer} n
 * @return {[type]} string
 *
 * ```javascript
 * str.repeat('-', 5) //=> '-----'
 * ```
 */
function repeat(self, n) {
    if (n <= 0) return '';
    else if (n === 1) return self;
    else if (n === 2) return self + self;
    else if (n > 2) return Array(n + 1).join(self);
}

/**
 * ##str.startWith(s, prefix)##
 * return true if s begin with prefix
 * @param  {String} self
 * @param  {String} prefix
 * @return {Boolean} true|false
 */
function startWith(self, prefix) {
    return self.substr(0, prefix.length) == prefix;
}


/**
 * ##str.endWith(s, suffix)##
 * return true if s end with suffix
 * @param  {String} self
 * @param  {String} suffix
 * @return {Boolean} true|false
 */
function endWith(self, suffix) {
    return self.substr(-suffix.length) == suffix;
}

/**
 * ##str.quoted(s)##
 * return true if s is quoted with " or '
 * @param  {String} self
 * @return {String} string
 *
 * ```javascript
 * str.quoted('"hello"') //=> true
 * ```
 */
function quoted(self) {
    if (!self) return false;
    var head = self.substr(0, 1),
        tail = self.substr(-1);
    return (head == '"' && tail == '"') || (head == "'" && tail == "'");
}

/**
 * ##str.enclose(s, chr)##
 * enclose s with chr
 * @param  {String} self
 * @param  {String} chr
 * @return {String} string   
 */
function enclose(self, chr) {
    return chr + self + chr;
}

/**
 * ##str.quote(s,isUseSingleQuote)##
 * quote s with 
 * @param  {String} self
 * @param  {Boolean} q, if true quote with ' otherwise with "
 * @return {String} string
 */
function quote(self, isUseSingleQuote) {
    return enclose(self, isUseSingleQuote ? "'" : '"');
}

/**
 * ##str.toArray(s)##
 * convert s into a array with every char in it as elements
 * @param  {String} self
 * @return {Array} array
 */
function toArray(self) {
    return self.split('');
}

/**
 * ##str.format(formatString, ...)##
 * @param {String} formatString
 * @return {String}
 *
 * ```javascript
 * //Simple
 * str.format('{0}',2014) //Error
 * str.format('{0}',[2014])
 * => 2014
 * 
 * str.format('{2}/{1}/{0}',[2014,6,3])
 * => "3/6/2014"
 * 
 * str.format('{2}/{1}/{0}',2014,6,3)
 * => "3/6/2014"
 * 
 * str.format("{year}-{month}-{date}",{year:2014,month:6,date:3})
 * => "2014-6-3"
 * 
 * //Advanced
 * str.format('{2,2,0}/{1,2,0}/{0}',[2014,6,3]);
 * => "03/06/2014"
 * 
 * str.format('{2,2,!}/{1,2,*}/{0}',[2014,6,3]);
 * => "!3/*6/2014"
 * 
 * str.format("{year}-{month,2,0}-{date,2,0}",{year:2014,month:6,date:3})
 * => "2014-06-03"
 *
 * str.format('{0,-5}',222014)
 * => "22014"
 *
 * format('{0,6,-}{1,3,-}','bar','')
 * => "---bar---"
 * ```
 */
var format = (function() {
    function postprocess(ret, a) {
        var align = parseInt(a.align),
            absAlign = Math.abs(a.align),
            result;

        if (absAlign === 0) {
            return ret;
        } else if (absAlign < ret.length) {
            return align > 0 ? ret.slice(0, absAlign) : ret.slice(-absAlign);
        } else {
            result = Array(absAlign - ret.length + 1).join(a.pad || format.DefaultPaddingChar);
            return align > 0 ? result + ret : ret + result;
        }
    }

    function tryget(o, path, v) {
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

    function p(all) {
        var ret = {},
            p1, p2, sep = format.DefaultFieldSeperator;
        p1 = all.indexOf(sep);
        if (p1 < 0) {
            ret.index = all;
        } else {
            ret.index = all.substr(0, p1);
            p2 = all.indexOf(sep, p1 + 1);
            if (p2 < 0) {
                ret.align = all.substring(p1 + 1, all.length);
            } else {
                ret.align = all.substring(p1 + 1, p2);
                ret.pad = all.substring(p2 + 1, all.length);
            }
        }
        return ret;
    }

    return function(self, args) {
        var len = arguments.length;
        if (len > 2) {
            args = Array.prototype.slice.call(arguments, 1);
        } else if(len === 2 && !_type.isArray(args)) {
            args = [args];
        } else if (len === 1) {
            return self;
        }
        return self.replace(format.InterpolationPattern, function(all, m) {
            var a = p(m);
            ret = '' + tryget(args, a.index);
            if (ret == null) ret = a.index;
            return a.align == null && a.pad == null ? ret : postprocess(ret, a) || ret;
        });
    };
})();

format.DefaultPaddingChar = ' ';
format.DefaultFieldSeperator = ',';
format.InterpolationPattern = /\{(.*?)\}/g;

/**
 * ##str.isHtmlFragment(s)##
 * return true if s is a html fragment
 * @param  {String}  self
 * @return {Boolean} true|false
 *
 * ```javascript
 * str.isHtmlFragment('<>')
 * => false
 *
 * str.isHtmlFragment('<a>')
 * => true
 * ```
 */
function isHtmlFragment(self) {
    var s = String(self);
    return s.charAt(0) === '<' && s.charAt(self.length - 1) === '>' && s.length >= 3;
}

var toHashRegexpCache = {
    '&=': /([^=&]+?)=([^&]*)/g,
    ',:': /([^:,]+?):([^,]*)/g
};

/**
 * ##str.toHash(s [,pairSeparator, keyValueSeparator, start, end])##
 * convert a key-value string into an hash(Object)
 * @param  {String} self
 * @param  {String} pairSeparator
 * @param  {Object} keyValueSeparator
 * @param  {[type]} start
 * @param  {[type]} end
 * @return {Object} object
 *
 * ```javascript
 * str.toHash('uid=42&name=mike')
 * => {uid: "42", name: "mike"}
 *
 * str.toHash('?uid=42&name=mike', null, null, 1)
 * => {uid: "42", name: "mike"}
 *
 * str.toHash('{name:mike,age:28}',',',':',1,-1)
 * => {name: "mike", age: "28"}
 * ```
 */

function toHash(self, pairSeparator, keyValueSeparator, start, end) {
    var result = {}, s = self;
    if (!self) return result;

    pairSeparator = pairSeparator || '&';
    keyValueSeparator = keyValueSeparator || '=';

    var cacheKey = pairSeparator + keyValueSeparator,
        re = toHashRegexpCache[cacheKey],
        rId;
    if (!re) {
        rId = '[^' + cacheKey + ']';
        re = new RegExp('(' + rId + '+?)' + keyValueSeparator + '(' + rId + '*)', 'g');
        toHashRegexpCache[cacheKey] = re;
    }
    s = self.slice(start || 0, end || self.length);
    s.replace(re, function(_, key, value) {
        result[key] = value;
    });
    return result;
}
    
    exports['toInt'] = toInt;
    exports['toFloat'] = toFloat;
    exports['capitalize'] = capitalize;
    exports['strip'] = strip;
    exports['isBlank'] = isBlank;
    exports['lstrip'] = lstrip;
    exports['rstrip'] = rstrip;
    exports['chomp'] = chomp;
    exports['chop'] = chop;
    exports['reverse'] = reverse;
    exports['repeat'] = repeat;
    exports['startWith'] = startWith;
    exports['endWith'] = endWith;
    exports['quoted'] = quoted;
    exports['enclose'] = enclose;
    exports['quote'] = quote;
    exports['toArray'] = toArray;
    exports['format'] = format;
    exports['isHtmlFragment'] = isHtmlFragment;
    exports['toHash'] = toHash;
    exports.__doc__ = "String Utils";
    exports.VERSION = '0.0.1';
    return exports;
}));
//end of $root.lang.string
/**
 * #Range, immutable#
 * ================
 * - Dependencies: `lang/type`,`lang/string`
 * - Version: 0.0.1
 */

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('lang/range', ['lang/type', 'lang/string'], factory);
    } else if (typeof module === 'object') {
        var $root_lang_type = require('lang/type'),
            $root_lang_string = require('lang/string');
        module.exports = factory($root_lang_type, $root_lang_string, exports, module, require);
    } else {
        var exports = $root._createNS('$root.lang.range');
        factory($root.lang.type, $root.lang.string, exports);
    }
}(this, function(_type, _str, exports) {
    'use strict';
    exports = exports || {};
    
    var rangeCache = {};
    
    function checkRangeBounds(from, to) {
        if (!_type.isFiniteNumber(from, to)) {
            throw Error('Arguments `from` and `to` must be finit integer!');
        }
    }
    
    /**
     * Range
     * represents a range, immutable
     * @param {[type]} from [description]
     * @param {[type]} to   [description]
     */
    function Range(from, to) {
        checkRangeBounds(from, to);
        return {
            toArray: function(includeUpperBound) {
                var i = from,
                    ret = [];
                for (; i < to; ++i) {
                    ret.push(i);
                }
                if (includeUpperBound) {
                    ret.push(to);
                }
                return ret;
            },
            each: function(fn) {
                if (!_type.isFunction(fn)) return this;
                var i = from,
                    index = 0;
                for (; i < to; ++i) {
                    fn(i, index);
                    index++;
                }
            },
            covers: function(x) {
                var b;
                if (x.ctor && _type.isFunction(x.ctor) && x.ctor() === Range) {
                    b = x.bounds();
                    return b[0] >= from && b[1] <= to;
                } else {
                    return x >= from && x <= to;
                }
            },
            equal: function(r) {
                var b;
                if (r && _type.isFunction(r.ctor) && r.ctor() === Range) {
                    b = r.bounds();
                    return b[0] === from && b[1] === to;
                }
                return false;
            },
            ctor: function() {
                return Range;
            },
            bounds: function() {
                return [from, to];
            },
            toString: function(left, right) {
                return [left || '[', from, ',', to, right || ']'].join('');
            },
            indexOf: function(i) {
                return this.convers(i) ? i - from : -1;
            }
        };
    }
    
    Range.BoundsType = ['[]', '[)', '(]', '()'];
    
    //exports
    /**
     * create
     * create a Range instance from given args
     * @return {Range}
     */
    function create() {
        var len = arguments.length,
            bounds, from, to, boundsCheck;
        if (typeof arguments[0] == 'string') {
            bounds = arguments[0];
            from = arguments[1];
            to = arguments[2];
            boundsCheck = arguments[3];
        } else if (typeof arguments[0] == 'number') {
            bounds = '[]';
            from = arguments[0];
            to = arguments[1];
            boundsCheck = arguments[2];
        }
        if (boundsCheck) checkRangeBounds(from, to);
        if (from > to) {
            from = [to, to = from][0];
        }
    
        var upper = bounds[1] || ']',
            lower = bounds[0] || '[';
    
        if (lower == '(') from += 1;
        if (upper == ')') to -= 1;
    
        var cacheKey = lower + String(from) + ',' + String(to) + upper,
            r = rangeCache[cacheKey];
        if (typeof r == 'undefined') {
            r = new Range(from, to);
            rangeCache[cacheKey] = r;
        }
        return r;
    }
    
    var reRangStr = /[\[(](-?\d+),(-?\d+)[)\]]/;
    
    function parse(s) {
        if (!s) return null;
        var m = s.match(reRangStr);
        if (!m) throw new Error('Range format error!');
        return create(m[0] + m[3], parseInt(m[1], 10), parseInt(m[2], 10));
    }
    
    exports['create'] = create;
    exports.__doc__ = "Range, immutable";
    exports.VERSION = '0.0.1';
    return exports;
}));
//end of $root.lang.range
/**
 * #Date Utils#
 * ==========
 * - Dependencies: `lang/type`,`lang/fn`,`lang/arguments`,`lang/string`
 * - Version: 0.0.1
 */

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('lang/date', ['lang/type', 'lang/fn', 'lang/arguments', 'lang/string'], factory);
    } else if (typeof module === 'object') {
        var $root_lang_type = require('lang/type'),
            $root_lang_fn = require('lang/fn'),
            $root_lang_arguments = require('lang/arguments'),
            $root_lang_string = require('lang/string');
        module.exports = factory($root_lang_type, $root_lang_fn, $root_lang_arguments, $root_lang_string, exports, module, require);
    } else {
        var exports = $root._createNS('$root.lang.date');
        factory($root.lang.type, $root.lang.fn, $root.lang.arguments, $root.lang.string, exports);
    }
}(this, function(_type, _fn, _arguments, _str, exports) {
    'use strict';
    exports = exports || {};
    
    var varArg = _arguments.varArg;
    
    var secondsOfMinute = 60,
        secondsOfHour = 3600,
        secondsOfDay = 86400,
        namesOfMonths = {
            en: [null, 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'Augest', 'September', 'October', 'November', 'December'],
            chs: [null, '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
        },
        namesOfWeekday = {
            en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            chs: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六', ]
        },
        _daysOfMonth = {
            'false': [-1, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
            'true': [-1, 31, 20, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
        };
    
    function now() {
        return new Date();
    }
    
    function thisDay() {
        return new Date().getDay();
    }
    
    function thisMonth() {
        return new Date().getMonth() + 1;
    }
    
    function thisYear() {
        return new Date().getYear() + 1900;
    }
    
    // return true if given year is leap year
    function isLeapYear(year) {
        //http://stackoverflow.com/questions/8175521/javascript-to-find-leap-year
        return new Date(year, 1, 29).getMonth() == 1;
    }
    
    
    // return days in given month of year
    function daysOfMonth(year, month) {
        return _daysOfMonth[isLeapYear(year)][month];
    }
    
    function format(self, sep) {
        sep = sep || '-';
        return _str.format("{year}{sep}{month,2,0}{sep}{date,2,0}", {
            sep: sep,
            year: self.getFullYear(),
            month: self.getMonth() + 1,
            date: self.getDate()
        });
    }
    
    function _returnDay() {
        return this.date;
    }
    
    
    function calendar(year, month) {
        if (month < 1 || month > 12) {
            throw new Error('2nd paramter is month which must between 1 and 12');
        }
        var cacheKey = '' + year + '-' + month;
        if (calendar.cache[cacheKey]) return calendar.cache[cacheKey];
    
        table = [
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null]
        ];
        var d = now(),
            today = new Date(d),
            i, j, day, days, lastDays, x, y, thisYear, thisMonth, lastYear, lastMonth, nextYear, nextMonth, flag = true;
        if (year) d.setYear(year);
        if (month) d.setMonth(month - 1);
        d.setDate(1);
        day = d.getDay();
        thisYear = d.getFullYear();
        thisMonth = d.getMonth() + 1;
        days = daysOfMonth(d.getFullYear(), d.getMonth() + 1);
        if (thisMonth > 1 && thisMonth < 12) {
            nextYear = lastYear = thisYear;
            lastMonth = thisMonth - 1;
            nextMonth = thisMonth + 1;
        } else if (thisMonth === 1) {
            lastYear = thisYear - 1;
            nextYear = thisYear;
            lastMonth = 12;
            nextMonth = 2;
        } else if (thisMonth === 12) {
            nextYear = thisYear + 1;
            lastYear = thisYear;
            lastMonth = 11;
            nextMonth = 1;
        }
        lastDays = daysOfMonth(lastYear, lastMonth);
        x = 1;
        y = 1;
    
        for (i = 0; i < 6; ++i) {
            for (j = 0; j < 7; ++j) {
                var dayInfo = {
                    toString: _returnDay,
                    valueOf: _returnDay
                };
                if (x <= days && (i > 0 || (i === 0 && j >= day))) {
                    if (flag && x === today.getDate() && thisMonth === today.getMonth() + 1 && thisYear === today.getFullYear()) {
                        dayInfo.today = true;
                        flag = false;
                    }
                    dayInfo.date = x++;
                    dayInfo.year = thisYear;
                    dayInfo.month = thisMonth;
                } else if (i === 0 && j < day) {
                    dayInfo.date = lastDays - day + j + 1;
                    dayInfo.year = lastYear;
                    dayInfo.month = lastMonth;
                } else {
                    dayInfo.date = y++;
                    dayInfo.year = nextYear;
                    dayInfo.month = nextMonth;
                }
                table[i][j] = dayInfo;
            }
        }
        calendar.cache[cacheKey] = table;
        return table;
    }
    calendar.cache = {};
    
    function gsetter(g, s) {
        return function(v) {
            var value = this.$get('value');
            if (v == null) {
                return value[g]();
            } else {
                value[s](v);
            }
            return this;
        };
    }
    
    var DateTime = _type.create('$root.lang.DateTime', Object, {
        init: function() {
            var value;
            varArg(arguments, this)
                .when('string', function(s) {
                    return [new Date(Date.parse(s))];
                })
                .when('date', function(d) {
                    return [new Date(d.getTime())];
                })
                .when(DateTime.constructorOf, function(dt) {
                    return [new Date(dt.$get('value').getTime())];
                })
                .otherwise(function(args) {
                    return [_fn.applyNew(Date, args)];
                }).invoke(function(value) {
                    this.$attr('value', value);
                });
        },
        year: gsetter('getFullYear', 'setFullYear'),
        month: function(v) {
            var value = this.$get('value');
            if (_type.isEmpty(v)) {
                return value.getMonth() + 1;
            } else {
                value.setMonth(v - 1);
            }
            return this;
        },
        week: function() {
            var value = this.$get('value');
            return value.getDay();
        },
        date: gsetter('getDate', 'setDate'),
        hours: gsetter('getHours', 'setHours'),
        minutes: gsetter('getMinutes', 'setMinutes'),
        seconds: gsetter('getSeconds', 'setSeconds'),
        milliseconds: gsetter('getMilliseconds', 'setMilliseconds'),
        toString: function(noTime) {
            var t = this.$get('value'),
                fmt = noTime ? DateTime.DefaultDateFormat : DateTime.DefaultDateTimeFormat;
            return _str.format(fmt, {
                year: t.getFullYear(),
                month: t.getMonth() + 1,
                date: t.getDate(),
                hour: t.getHours(),
                minute: t.getMinutes(),
                second: t.getSeconds()
            });
        },
        format: function(fmt) {
            if (!fmt) return this.toString();
        },
        valueOf: function() {
            return this.$get('value').getTime();
        },
        set: function() {
            var value = this.$get('value');
            varArg(arguments, this)
                .when('int', function(v) {
                    value.setTime(v);
                })
                .when('{*}', function(v) {
                    isNaN(v.year) || value.setFullYear(v.year);
                    isNaN(v.month) || value.setMonth(v.month - 1);
                    isNaN(v.date) || value.setDate(v.date);
                    isNaN(v.hours) || value.setHours(v.hours);
                    isNaN(v.minutes) || value.setMinutes(v.minutes);
                    isNaN(v.seconds) || value.setSeconds(v.seconds);
                    isNaN(v.milliseconds) || value.setMilliseconds(v.milliseconds);
                }).resolve();
            return this;
        },
        toObject: function(detailed) {
            var value = this.$get('value');
            return detailed ? {
                year: value.getFullYear(),
                month: value.getMonth() + 1,
                date: value.getDate(),
                hours: value.getHours(),
                minutes: value.getMinutes(),
                seconds: value.getSeconds(),
                milliseconds: value.getMilliseconds(),
                day: value.getDay()
            } : {
                year: value.getFullYear(),
                month: value.getMonth() + 1,
                date: value.getDate()
            };
        },
        dup: function() {
            return new DateTime(this.value);
        },
        equal: function(other) {
            return this.value.getTime() == other.value.getTime();
        }
    }).methods({
        firstDayOfMonth: function() {
            return this.set({
                date: 1
            });
        },
        lastDayOfMonth: function() {
            return this.set({
                month: this.month() + 1,
                date: 0
            });
        },
        yesterday: function() {
            return this.set({
                date: this.date() - 1
            });
        },
        tomorrow: function() {
            return this.set({
                date: this.date() + 1
            });
        },
        nextYear: function() {
            return this.set({
                year: this.year() - 1
            });
        },
        prevYear: function() {
            return this.set({
                year: this.year() + 1
            });
        },
        nextMonth: function() {
            return this.set({
                month: this.month() + 1
            });
        },
        prevMonth: function() {
            return this.set({
                month: this.month() - 1
            });
        },
        noon: function() {
            return this.set({
                hours: 12,
                minutes: 0,
                seconds: 0
            });
        },
        midnight: function() {
            return this.set({
                hours: 24,
                minutes: 0,
                seconds: 0
            });
        },
        beginning: function() {
            return this.set({
                hours: 0,
                minutes: 0,
                seconds: 0
            });
        },
        ending: function() {
            return this.set({
                hours: 23,
                minutes: 59,
                seconds: 59
            });
        }
    }).aliases({
        next: 'tomorrow',
        prev: 'yesterday',
        sec: 'seconds',
        min: 'minutes'
    }).statics({
        Today: function() {
            return new DateTime().noon();
        },
        Parse: function(when) {
            return new DateTime(Date.parse(when));
        },
        StandardDateTimeFormat: "{year}/{month,2,0}/{date,2,0} {hour,2,0}:{minute,2,0}:{second,2,0}",
        DefaultDateTimeFormat: "{year}-{month,2,0}-{date,2,0} {hour,2,0}:{minute,2,0}:{second,2,0}",
        StandardDateFormat: "{year}/{month,2,0}/{date,2,0}",
        DefaultDateFormat: "{year}-{month,2,0}-{date,2,0}",
        DefaultTimeFormat: "{hour,2,0}:{minute,2,0}:{second,2,0}"
    });
    
    var TimeSpan = _type.create('$root.lang.TimeSpan', Number, {
        init: function(millis) {
            this.value = Math.abs(millis);
            var obj = this.toObject();
            this.$attr('object', obj);
        },
        val: function(v) {
            if (v == null) {
                return this.value;
            } else {
                this.value = v;
                this.$attr('object', this.toObject());
            }
            return this;
        },
        year: function() {
            return this.object.year;
        },
        day: function() {
            return this.object.year;
        },
        hour: function() {
            return this.object.hour;
        },
        minute: function() {
            return this.object.minute;
        },
        second: function() {
            return this.object.second;
        },
        toString: function(fmt) {
            var obj = this.$attr('object');
            return _str.format(fmt || '{year}Y {day}D {hour,2,0}:{minute,2,0}:{second,2,0}', obj);
        },
        toObject: function() {
            var obj = TimeSpan.ToObject(this.value);
            this.$attr('object', obj);
            return obj;
        }
    }).statics({
        MINUTE: 60,
        HOUR: 3600,
        DAY: 86400,
        YEAR: 315360000,
        ToObject: function(v) {
            var ret = {};
            if (v >= TimeSpan.YEAR) {
                ret.year = ~~ (v / TimeSpan.YEAR);
                v -= TimeSpan.YEAR * ret.year;
            } else {
                ret.year = 0;
            }
            if (v >= TimeSpan.DAY) {
                ret.day = ~~ (v / TimeSpan.DAY);
                v -= TimeSpan.DAY * ret.day;
            } else {
                ret.day = 0;
            }
            if (v >= TimeSpan.HOUR) {
                ret.hour = ~~ (v / TimeSpan.HOUR);
                v -= TimeSpan.HOUR * ret.hour;
            } else {
                ret.hour = 0;
            }
            if (v >= TimeSpan.MINUTE) {
                ret.minute = ~~ (v / TimeSpan.MINUTE);
                v -= TimeSpan.MINUTE * ret.minute;
            } else {
                ret.minute = 0;
            }
            ret.second = v;
            return ret;
        }
    });
    
    exports['secondsOfMinute'] = secondsOfMinute;
    exports['secondsOfHour'] = secondsOfHour;
    exports['secondsOfDay'] = secondsOfDay;
    exports['namesOfMonths'] = namesOfMonths;
    exports['namesOfWeekday'] = namesOfWeekday;
    exports['now'] = now;
    exports['thisDay'] = thisDay;
    exports['thisMonth'] = thisMonth;
    exports['thisYear'] = thisYear;
    exports['isLeapYear'] = isLeapYear;
    exports['daysOfMonth'] = daysOfMonth;
    exports['format'] = format;
    exports['calendar'] = calendar;
    exports['DateTime'] = DateTime;
    exports['TimeSpan'] = TimeSpan;
    exports.__doc__ = "Date Utils";
    exports.VERSION = '0.0.1';
    return exports;
}));
//end of $root.lang.date
/**
 * #Array Utils#
 * ===========
 * - Dependencies: `lang/type`,`lang/fn`
 * - Version: 0.0.1
 */

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('lang/array', ['lang/type', 'lang/fn'], factory);
    } else if (typeof module === 'object') {
        var $root_lang_type = require('lang/type'),
            $root_lang_fn = require('lang/fn');
        module.exports = factory($root_lang_type, $root_lang_fn, exports, module, require);
    } else {
        var exports = $root._createNS('$root.lang.array');
        factory($root.lang.type, $root.lang.fn, exports);
    }
}(this, function(_type, _fn, exports) {
    'use strict';
    exports = exports || {};
    
    var _forEach = Array.prototype.forEach,
        _slice = Array.prototype.slice,
        _indexOf = Array.prototype.indexOf;
    
    /**
     * ##array.w(str)##
     * split given string with space
     * @param  {String} str [string]
     * @param  {String} sep  [separator]
     * @return {Array} array
     *
     * ```javascript
     * array.w('a b c d') //=> ['a','b','c','d']
     * array.w('a,b,c,d',',') //=> ['a','b','c','d']
     * ```
     */
    var w = function(self, sep) {
        if (!self || self.length === 0) {
            return [];
        }
        var s = self;
        if (typeof self !== 'string') {
            s = '' + self;
        }
        return s.split(sep || /[\s\n\t]+/);
    };
    
    /**
     * ##array.forEach(ary)##
     * iterate over given array
     * @param  {Array}   self
     * @param  {Function} fn
     * @return {Undefined} undefined
     *
     * ```javascript
     * array.forEach([1,2,3],function(value, index, ary){
     *     //...
     * });
     * ```
     */
    var forEach = _forEach ? function(self, fn) {
            _forEach.call(self, fn);
        } : function(self, fn) {
            var i = 0,
                len = self.len,
                item;
            for (; i < len; ++i) {
                item = self[i];
                fn.call(item, i, self);
            }
            return self;
        };
    
    /**
     * ##array.indexOf(ary)##
     * find index of given parameter
     * @param  {Array} [ary array to be search]
     * @param  {Any} obj
     * @return {Integer} index
     *
     * ```javascript
     * var a = {}, b = 3, c = [1,a,b];
     * array.indexOf(c, a) => 1
     * array.indexOf(c, b) => 2
     * array.indexOf(c, {}) => -1
     * array.indexOf(c, 3) => 2
     * ```
     */
    var indexOf = _indexOf ? function(self, obj) {
            return _indexOf.call(self, obj);
        } : function(self, obj) {
            var i = 0,
                len = self.length;
            for (; i < len; ++i) {
                if (self[i] === obj) {
                    return i;
                }
            }
            return -1;
        };
    
    /**
     * ##array.toArray(arraylike)##
     * convert array like object into an array
     * @param  {Any} arrayLike
     * @param  {int} start, where to start slice, included
     * @param  {int} end, where to end slice, not included
     * @return {Array} array
     *
     * ```javascript
     *  function f(){
     *      return array.toArray(arguments, 1, -1)
     *  }
     *  f(1,2,3) //=> [2]
     * ```
     */
    function toArray(arrayLike, start, end) {
        // if arrayLike has a number value length property
        // then it can be sliced
        return _type.isNumber(arrayLike.length) ? _slice.call(arrayLike, start, end) : [];
    }
    
    /**
     * ##array.equal(a1,a2)##
     * return true if elements in two array loosely equal(==)
     * @param  {Array} a
     * @param  {Array} b
     * @return {Boolean} whether a equals b
     *
     * ```javascript
     * var x = 'a', a = [1,2, [3, x]], b = [1,2,[3,'a']], c = [1,2,[3,x]];
     * array.strictEqual(a,b) //=> true
     * array.strictEqual(a,c) //=> true
     * ```
     */
    function equal(self, b) {
        var i = 0,
            len = self.length;
        if (len !== b.length) return false;
        for (; i < len; ++i) {
            if (self[i] == b[i]) {
                continue;
            } else if (_type.isArray(self[i]) && _type.isArray(b[i])) {
                if (!equal(self[i], b[i])) return false;
            } else {
                return false;
            }
        }
        return true;
    }
    
    /**
     * ##array.strictEqual(a1,a2)##
     * return true if elements in two array strictly equal(===)
     * @param  {Array} a
     * @param  {Array} b
     * @return {Boolean} whether a strictly equals b
     *
     * ```javascript
     * var x = 'a', a = [1,2, [3, x]], b = [1,2,[3,'a']], c = [1,2,[3,x]];
     * array.strictEqual(a,b) //=> false
     * array.strictEqual(a,c) //=> true
     * ```
     */
    function strictEqual(self, b) {
        var i = 0,
            len = self.length;
        if (len !== b.length) return false;
        for (; i < len; ++i) {
            if (self[i] === b[i]) {
                continue;
            } else if (_type.isArray(self[i]) && _type.isArray(b[i])) {
                if (!strictEqual(self[i], b[i])) return false;
            } else {
                return false;
            }
        }
        return true;
    }
    
    /**
     * ##array.compact(ary)##
     * remove empty item(undefined,null, zero length array/object/string) from an array
     * @param  {Array} ary
     * @return {Array} array
     *
     * ```javascript
     * array.compact([0,undefined, null, 1]) //=> [0,1]
     * ```
     */
    function compact(self) {
        var ret = [];
        if (!_type.isArrayLike(self)) return ret;
        var i = 0,
            len = self.length;
        for (; i < len; ++i) {
            if (_type.isEmpty(self[i])) continue;
            ret.push(self[i]);
        }
        return ret;
    }
    
    /**
     * ##array.flattern(ary)##
     * flatten given array into a one-dimension array
     * @param  {Array} ary
     * @return {Array} flattened array
     *
     * ```javascript
     * array.flatten([1,[2,[3]],4]) //=> [1,2,3,4]
     * ```
     */
    function flatten(self) {
        if (!_type.isArray(self)) return [self];
        var i = 0,
            obj,
            len = self.length,
            r, ret = [];
        for (; i < len; ++i) {
            obj = self[i];
            if (_type.isArray(obj)) {
                r = flatten(obj);
                ret = ret.concat(r);
            } else {
                ret.push(obj);
            }
        }
        return ret;
    }
    
    /**
     * ##array.fill(ary, value, start, end)##
     * fill given array from start to end with given v
     * @param  {String} self
     * @param  {Any} v
     * @param  {Integer} start
     * @param  {Integer} end
     * @return {Array} array
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/fill
     */
    function fill(self, v, start, end) {
        var len = self.length,
            start_i = start == null ? 0 : +start,
            end_i = len;
        if (typeof end != 'undefined') end_i = +end;
        if (start_i < 0) {
            start_i += len;
            if (start_i < 0) start_i = 0;
        } else {
            if (start_i > len) start_i = len;
        }
    
        if (end_i < 0) {
            end_i += len;
            if (end_i < 0) end_i = 0;
        } else {
            if (end_i > len) end_i = len;
        }
        for (var i = start_i; i < end_i; ++i) {
            self[i] = v;
        }
        return self;
    }
    
    /**
     * ##array.fromRange(from,to)##
     * create an array from given range
     * @param  {Integer} from, lower bounds
     * @param  {Integer} to, upper bounds
     * @return {Array} array [from, to]
     *
     * ```javascript
     * array.fromRange(1,5) //=> [1,2,3,4,5]
     * ```
     */
    function fromRange(from, to) {
        var ret = [],
            i, a, b,
            len = arguments.length;
        if (len === 0) {
            return ret;
        } else if (len === 1) {
            return [from];
        } else if (len >= 2) {
            a = Math.min(from, to),
            b = Math.max(from, to);
            for (i = a; i <= b; ++i) {
                ret.push(i);
            }
        }
        return ret;
    }
    
    exports['w'] = w;
    exports['forEach'] = forEach;
    exports['indexOf'] = indexOf;
    exports['toArray'] = toArray;
    exports['equal'] = equal;
    exports['strictEqual'] = strictEqual;
    exports['compact'] = compact;
    exports['flatten'] = flatten;
    exports['fill'] = fill;
    exports['fromRange'] = fromRange;
    exports.__doc__ = "Array Utils";
    exports.VERSION = '0.0.1';
    return exports;
}));
//end of $root.lang.array
/**
 * #Enumerable Interface#
 * ====================
 * - Dependencies: `lang/type`,`lang/array`
 * - Version: 0.0.1
 */

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('lang/enumerable', ['lang/type', 'lang/array'], factory);
    } else if (typeof module === 'object') {
        var $root_lang_type = require('lang/type'),
            $root_lang_array = require('lang/array');
        module.exports = factory($root_lang_type, $root_lang_array, exports, module, require);
    } else {
        var exports = $root._createNS('$root.lang.enumerable');
        factory($root.lang.type, $root.lang.array, exports);
    }
}(this, function(_type, _ary, exports) {
    'use strict';
    exports = exports || {};
    
    var _slice = Array.prototype.slice;
    
    function _array_each(ary, fn, thisValue, stopWhenFnReturnFalse) {
        var i = 0,
            len = ary.length,
            ret;
        if (typeof stopWhenFnReturnFalse == 'undefined') {
            stopWhenFnReturnFalse = false;
        }
        for (; i < len; ++i) {
            ret = fn.call(thisValue, ary[i], i, i, ary);
            if (ret === false && stopWhenFnReturnFalse) break;
        }
        return ary;
    }
    
    function _object_each(obj, fn, thisValue, stopWhenFnReturnFalse) {
        var key, ret, i = 0;
    
        if (!_type.isFunction(fn)) return obj;
    
        if (typeof stopWhenFnReturnFalse == 'undefined') {
            stopWhenFnReturnFalse = false;
        }
    
        for (key in obj) {
            ret = fn.call(thisValue, obj[key], key, i++, obj);
            if (ret === false && stopWhenFnReturnFalse) break;
        }
        return obj;
    }
    
    /**
     * ##enum.each(obj)##
     * iterate over an array or object
     * @param  {Array|Object}   obj
     * @param  {Function} fn
     * @param  {Any}   thisValue
     * @param  {Boolean}   stop when fn return false
     * @return {object} return array or object being iterated
     *
     * ```javascript
     * var week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
     * enum.each(week,function(xxxday, key, index, ary){
     *     // key === index
     *     //...
     * })
     * enum.each({name:'mike',age:28},function(value, key, index, mike){
     *     // key is 'name','age' while index is 0, 1
     *     // mike is the object being iterated
     *     //...
     * },null, true);
     * ```
     */
    function each(obj) {
        return _type.isArrayLike(obj) ? _array_each.apply(null, arguments) : _object_each.apply(null, arguments);
    }
    
    
    /**
     * ##enum.inject(obj, init, fn)##
     * @param  {Any} obj
     * @param  {Any} init, initial value
     * @param  {Function} fn
     * @return {Any}
     *
     * ```javascript
     * enum.inject([1,2,3,4,5,6,7,8,9,10],0,function(sum, item){
     *     sum += item;
     *     return sum;
     * });
     * => 55
     * ```
     */
    function inject(obj, init, fn) {
        if (_type.isEmpty(obj)) return init;
        each(obj, function(v, k, i) {
            init = fn(init, v, k, i);
        });
        return init;
    }
    
    /**
     * ##enum.some(obj,fn)##
     * return true if one or more item in obj pass fn test(fn return true)
     * @param  {Array}   obj
     * @param  {Function} fn
     * @return {Boolean}
     */
    function some(obj, fn) {
        var ret = false;
        each(obj, function(v, k, i) {
            if (fn.call(obj, v, k, i) === true) {
                ret = true;
                return false;
            }
        }, obj, true);
        return ret;
    }
    
    /**
     * ##enum.all(obj,fn)##
     * return true if all obj pass fn test(fn return true)
     * @param  {Array}   obj [description]
     * @param  {Function} fn   [description]
     * @return {Boolean}
     */
    function all(obj, fn) {
        var ret = true;
        each(obj, function(v, k, i) {
            if (fn.call(obj, v, k, i) === false) {
                ret = false;
                return false;
            }
        }, obj, true);
        return ret;
    }
    
    /**
     * ##enum.find(obj,fn,returnValueOnly)##
     * return first which pass fn test(fn return true)
     * @param  {Array}   obj
     * @param  {Function} fn
     * @param  {Boolean} return value only
     * @return {Object} {key,value,index}|value
     */
    function find(obj, fn, returnValueOnly) {
        returnValueOnly = typeof returnValueOnly == 'undefined' ? true : false;
        var ret = returnValueOnly ? null : {};
        each(obj, function(v, k, i) {
            if (fn.call(obj, v, k, i) === true) {
                if (returnValueOnly) {
                    ret = v;
                } else {
                    ret.key = k;
                    ret.value = v;
                    ret.index = i;
                }
                return false;
            }
        }, obj, true);
        return ret;
    }
    
    /**
     * ##enum.findAll(obj,fn,returnValueOnly)##
     * return array of item which pass fn test(fn return true)
     * @param  {Array}   obj
     * @param  {Function} fn
     * @param  {Boolean} return value only
     * @return {Array} {key,value,index}|value
     */
    function findAll(obj, fn, returnValueOnly) {
        returnValueOnly = typeof returnValueOnly == 'undefined' ? true : false;
        var ret = [];
        each(obj, function(v, k, i) {
            if (fn.call(obj, v, k, i) === true) {
                if (returnValueOnly) {
                    ret.push(v);
                } else {
                    ret.push({
                        key: k,
                        value: v,
                        index: i
                    });
                }
            }
        }, obj, true);
        return ret;
    }
    
    /**
     * ##enum.map(obj,fn,context)##
     * @param  {Array|Object}   obj
     * @param  {Function} fn
     * @param  {Any}   context
     * @return {Array|Object}
     */
    function map(obj, fn, context) {
        var ret;
        if (_type.isArrayLike(obj)) {
            ret = [];
            _array_each(obj, function(v, k, i) {
                ret.push(fn.call(context, v, k, i));
            });
        } else {
            ret = [];
            _object_each(obj, function(v, k, i) {
                ret[i] = fn.call(context, v, k, i);
            });
        }
        return ret;
    }
    
    /**
     * ##enum.pluck(obj,key,doNotReturn)##
     * @param  {Array|Object} obj
     * @param  {String} key
     * @param  {Boolean} do not return anything,
     * @return {Object|Undefined} object|undefined
     */
    function pluck(obj, key, doNotReturn) {
        var f;
        if (typeof doNotReturn == 'undefined') {
            doNotReturn = false;
        }
        if (key[0] == '&') {
            key = key.substring(1);
            f = function(e) {
                return e[key] ? e[key].call(e) : undefined;
            };
        } else {
            f = function(e) {
                return e[key];
            };
        }
        if (doNotReturn) {
            if (_type.isArrayLike(obj)) {
                _array_each(obj, function(v, k, i) {
                    f.call(null, v, k, i);
                });
            } else {
                _object_each(obj, function(v, k, i) {
                    f.call(null, v, k, i);
                });
            }
        } else {
            return map(obj, f);
        }
    }
    
    
    /**
     * ##enum.compact(obj)##
     * remove null/undfined item in array or object.
     * different from `array.compact` which also remove empty string and empty array recursively
     * @param  {Array|Object} obj
     * @return {Array|Object} array|object
     */
    function compact(obj) {
        var ret;
        if (_type.isArrayLike(obj)) {
            ret = [];
            _array_each(obj, function(v, k, i) {
                if (v === null || typeof v == 'undefined') return;
                ret.push(v);
            });
        } else {
            ret = {};
            _object_each(obj, function(v, k, i) {
                if (v === null || typeof v == 'undefined') return;
                ret[k] = v;
            });
        }
        return ret;
    }
    
    /**
     * ##enum.parallel(ary1,ary2[,...,short])###
     * iterate 2 or more array at the same time
     * @param {Array} ary1
     * @param {Array} ary2
     * @param {Boolean} short, if true use shortest array length as iteration upper bounds
     * @return {Undefined} undefined
     *
     * ```javascript
     *  parallel([1,2,3],['a','b'],['A','B'],function(){console.log(arguments)},true);
     *  =>  1 a A 0
     *      2 b B 1
     * ```
     */
    function parallel() {
        var len = arguments.length;
        if (len === 0) {
            return;
        } else if (len == 1) {
            return arguments[0];
        }
        var args = _slice.call(arguments),
            upbounds = Math.max,
            up, lengths, i = 0,
            j, fn, items, ret;
        if (args[args.length - 1] === true) {
            upbounds = Math.min;
            args.pop();
        }
        if (typeof args[args.length - 1] == 'function') {
            fn = args.pop();
            ret = [];
        }
        if (args.length === 2) {
            up = upbounds(args[0].length, args[1].length);
            for (; i < up; ++i) {
                if (fn) {
                    fn.call(null, args[0][i], args[1][i], i);
                } else {
                    ret.push([args[0][i], args[1][i]]);
                }
            }
        } else {
            lengths = pluck(args, 'length');
            up = upbounds.apply(null, lengths);
            for (; i < up; ++i) {
                items = [];
                for (j = 0; j < args.length; ++j) {
                    items.push(args[j][i]);
                }
                items.push(i);
                if(fn) {
                    fn.apply(null, items);
                } else {
                    ret.push(items);
                }
            }
        }
    }
    
    exports['each'] = each;
    exports['inject'] = inject;
    exports['all'] = all;
    exports['some'] = some;
    exports['find'] = find;
    exports['findAll'] = findAll;
    exports['map'] = map;
    exports['compact'] = compact;
    exports['pluck'] = pluck;
    exports['parallel'] = parallel;
    exports.__doc__ = "Enumerable Interface";
    exports.VERSION = '0.0.1';
    return exports;
}));
//end of $root.lang.enumerable
/**
 * #Object Utils#
 * ============
 * - Dependencies: `lang/type`,`lang/string`,`lang/enumerable`
 * - Version: 0.0.1
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
    'use strict';
    exports = exports || {};
    
    /**
     * ##obj.mix##
     * extends target with source
     * @param  {Object} target
     * @param  {Object} source
     * @return {Object} augmented target
     */
    function mix(target, source) {
        _enum.each(source, function(v, k, i) {
            if(source.hasOwnProperty(k)) {
                target[k] = v;
            }
        });
        return target;
    }
    
    /**
     * ##obj.keys(obj)##
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
     * ##obj.values##
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
     * ##obj.tryget(obj,path,defaultValue)##
     * try to retrieve value of object according to given `path`
     * @param {Object} o
     * @param {String} path
     * @param {Any} v, default value if
     * @returns {Any} object
     * ```javascript
     * tryget({a:[{b:42}]},'a.0.b', -1) => 42
     * ````
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
     * ##obj.tryset(obj,path,value)##
     * @param  {Any} obj
     * @param  {String} path, dot separated property name
     * @param  {Any} v, value to be set to
     * @return {Any} obj
     * ```javascript
     * tryset({a:[{b:42}]},'a.0.b', 43).a[0].b => 43
     * ```
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
    
    /**
     * ##obj.pairs(obj)##
     * @param  {[type]} obj [description]
     * @return {[type]}     [description]
     */
    function pairs(obj) {
        var ret = [];
        for (var k in obj) {
            if (obj.hasOwnProperty(k)) {
                ret.push([k, obj[k]]);
            }
        }
        return ret;
    }
    
    /**
     * fromPairs
     * @param  {[type]} pairs [description]
     * @return {[type]}       [description]
     */
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
     * ##obj.fromKeyValuePairString(s [,pairSeparator, keyValueSeparator, start, end])##
     * convert a key-value string into an hash(Object)
     * @param  {String} self
     * @param  {String} pairSeparator
     * @param  {Object} keyValueSeparator
     * @param  {[type]} start
     * @param  {[type]} end
     * @return {Object} object
     *
     * ```javascript
     * obj.fromKeyValuePairString('uid=42&name=mike')
     * => {uid: "42", name: "mike"}
     *
     * obj.fromKeyValuePairString('?uid=42&name=mike', null, null, 1)
     * => {uid: "42", name: "mike"}
     *
     * obj.fromKeyValuePairString('{name:mike,age:28}',',',':',1,-1)
     * => {name: "mike", age: "28"}
     * ```
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
    exports.__doc__ = "Object Utils";
    exports.VERSION = '0.0.1';
    return exports;
}));
//end of $root.lang.object
/**
 * #Extend JavaScript builtins intrusively#
 * ======================================
 * - Dependencies: `lang/string`,`lang/array`,`lang/object`,`lang/date`,`lang/number`,`lang/enumerable`,`lang/fn`
 * - Version: 0.0.1
 */

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('lang/intrusive', ['lang/string', 'lang/array', 'lang/object', 'lang/date', 'lang/number', 'lang/enumerable', 'lang/fn'], factory);
    } else if (typeof module === 'object') {
        var $root_lang_string = require('lang/string'),
            $root_lang_array = require('lang/array'),
            $root_lang_object = require('lang/object'),
            $root_lang_date = require('lang/date'),
            $root_lang_number = require('lang/number'),
            $root_lang_enumerable = require('lang/enumerable'),
            $root_lang_fn = require('lang/fn');
        module.exports = factory($root_lang_string, $root_lang_array, $root_lang_object, $root_lang_date, $root_lang_number, $root_lang_enumerable, $root_lang_fn, exports, module, require);
    } else {
        var exports = $root._createNS('$root.lang.intrusive');
        factory($root.lang.string, $root.lang.array, $root.lang.object, $root.lang.date, $root.lang.number, $root.lang.enumerable, $root.lang.fn, exports);
    }
}(this, function(_str, _array, _object, _date, _num, _enum, _fn, exports) {
    'use strict';
    exports = exports || {};
    
    var _slice = Array.prototype.slice;
    
    /**
     * extends prototype of a
     */
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
    
    /**
     * extends class (function)
     */
    function _intrude_clazz(clz, statics) {
        var k;
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
    exports.VERSION = '0.0.1';
    return exports;
}));
//end of $root.lang.intrusive
/**
 * #JavaScript Language Supplement#
 * ==============================
 * - Dependencies: `lang/json`,`lang/type`,`lang/fn`,`lang/number`,`lang/arguments`,`lang/range`,`lang/string`,`lang/date`,`lang/array`,`lang/object`,`lang/enumerable`,`lang/intrusive`
 * - Version: 0.0.1
 */

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('lang', ['lang/json', 'lang/type', 'lang/fn', 'lang/number', 'lang/arguments', 'lang/range', 'lang/string', 'lang/date', 'lang/array', 'lang/object', 'lang/enumerable', 'lang/intrusive'], factory);
    } else if (typeof module === 'object') {
        var $root_lang_json = require('lang/json'),
            $root_lang_type = require('lang/type'),
            $root_lang_fn = require('lang/fn'),
            $root_lang_number = require('lang/number'),
            $root_lang_arguments = require('lang/arguments'),
            $root_lang_range = require('lang/range'),
            $root_lang_string = require('lang/string'),
            $root_lang_date = require('lang/date'),
            $root_lang_array = require('lang/array'),
            $root_lang_object = require('lang/object'),
            $root_lang_enumerable = require('lang/enumerable'),
            $root_lang_intrusive = require('lang/intrusive');
        module.exports = factory($root_lang_json, $root_lang_type, $root_lang_fn, $root_lang_number, $root_lang_arguments, $root_lang_range, $root_lang_string, $root_lang_date, $root_lang_array, $root_lang_object, $root_lang_enumerable, $root_lang_intrusive, exports, module, require);
    } else {
        var exports = $root._createNS('$root.lang');
        factory($root.lang.json, $root.lang.type, $root.lang.fn, $root.lang.number, $root.lang.arguments, $root.lang.range, $root.lang.string, $root.lang.date, $root.lang.array, $root.lang.object, $root.lang.enumerable, $root.lang.intrusive, exports);
    }
}(this, function('json', 'type', 'fn', 'number', 'arguments', 'range', 'string', 'date', 'array', 'object', 'enumerable', 'intrusive', exports) {
    'use strict';
    exports = exports || {};
    
    var lang = {
        json: json,
        type: type,
        fn: fn,
        number: number,
        arguments: arguments,
        range: range,
        string: string,
        date: date,
        array: array,
        object: object,
        enumerable: enumerable,
        intrusive: intrusive
    };
    
    exports['lang'] = lang;
    exports.__doc__ = "JavaScript Language Supplement";
    exports.VERSION = '0.0.1';
    return exports;
}));
//end of $root.lang
