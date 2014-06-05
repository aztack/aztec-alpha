// $root
// $root.lang.type
// $root.lang.fn
// $root.lang.array
// $root.lang.enumerable
// $root.browser.template
// $root.lang.arguments
// $root.lang.string
// $root.lang.object
// jQueryExt
// $root.ui.draggable
// $root.ui.overlay
// $root.ui.dialog
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
 * #Templating#
 * ==========
 * - Dependencies: `lang/type`,`jquery`
 * - Version: 0.0.1
 */

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('browser/template', ['lang/type', 'jquery'], factory);
    } else if (typeof module === 'object') {
        var $root_lang_type = require('lang/type'),
            jquery = require('jquery');
        module.exports = factory($root_lang_type, jquery, exports, module, require);
    } else {
        var exports = $root._createNS('$root.browser.template');
        factory($root.lang.type, jQuery, exports);
    }
}(this, function(_type, $, exports) {
    'use strict';
    exports = exports || {};
    
    var templates = {},
        XTEMPLATE_ID_ATTR = 'xtemplate',
        XTEMPLATE_ID_ATTR_SEL = '[xtemplate]',
        INTERNAL_ATTRS = [
            /(\s*)sigil-class=".*?"(\s*)/g,
            /(\s*)sigil=".*?"(\s*)/g
        ];
    
    
    function stripAttr(matched, precedeSpace, succeedSpace) {
        return precedeSpace && succeedSpace ? ' ' : '';
    }
    
    function removeWhiteTextNode(node) {
        var child, next;
        if (!node) return;
    
        switch (node.nodeType) {
            case 3: //TextNode
                if (node.nodeValue && node.nodeValue.match(/^\s*$/)) {
                    node.parentNode.removeChild(node);
                }
                break;
            case 1: // ElementNode
            case 9: // DocumentNode
                child = node.firstChild;
                while (child) {
                    next = child.nextSibling;
                    removeWhiteTextNode(next);
                    child = next;
                }
                break;
        }
        return node;
    }
    
    
    /**
     * collect
     * collect templates in current document
     * @param  {Boolean} force, set template string even if already set
     * @return {Undefined}
     */
    function collect(force) {
        if (typeof force == 'undefined') force = false;
        
        $(XTEMPLATE_ID_ATTR_SEL).each(function(i, ele) {
            var n = $(ele),
                data = n.attr(XTEMPLATE_ID_ATTR).split(','),
                id = data[0],
                html;
            if (n.tagName == 'SCRIPT') {
                html = n.text();
            } else {
                tmp = n.clone().removeAttr(XTEMPLATE_ID_ATTR);
                tmp = $('<div>').append(removeWhiteTextNode(tmp[0]));
                html = tmp.html();
            }
            if (data.length > 0 && data[1] == 'delete') {
                ele.parentNode.removeChild(ele);
            }
    
            //remove internal attribute nodes
            var j = 0,
                len = INTERNAL_ATTRS.length;
            for (; j < len; ++j) {
                html = html.replace(INTERNAL_ATTRS[j], stripAttr);
            }
    
            if (_type.isUndefined(templates[id]) || force) {
                set(id, html);
            }
        });
    }
    
    /**
     * set
     * set template string for given id(full name)
     * @param {[type]} id  [description]
     * @param {[type]} tpl [description]
     */
    function set(id, tpl) {
        if (id.indexOf(',') > 0) {
            id = id.split(',')[0];
        }
        templates[id] = tpl;
        return this;
    }
    
    /**
     * get
     * get template string for given id(full name)
     * @param  {[type]} id [description]
     * @return {[type]}    [description]
     */
    function get(id) {
        return templates[id];
    }
    
    /**
     * id$
     * return a function that return template string for given id(short name)
     * under given namespce
     * @param  {String} namespace, from which the template string will be retrieved
     * @return {String} template string
     */
    function id$(namespace) {
        return function(id) {
            return get(namespace + '.' + id);
        };
    }
    
    //collect template in current page when dom is ready
    //dynamic created template may not collected
    if($ || jQuery) {
        ($||jQuery)(collect);
    }
    
    exports['collect'] = collect;
    exports['set'] = set;
    exports['get'] = get;
    exports['id$'] = id$;
    exports.__doc__ = "Templating";
    exports.VERSION = '0.0.1';
    return exports;
}));
//end of $root.browser.template
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
 * #jQuery Sigil Extension#
 * ======================
 * - Dependencies: `lang/type`,`lang/object`
 * - Version: 0.0.1
 */

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('jQueryExt', ['lang/type', 'lang/object'], factory);
    } else if (typeof module === 'object') {
        var $root_lang_type = require('lang/type'),
            $root_lang_object = require('lang/object');
        module.exports = factory($root_lang_type, $root_lang_object, exports, module, require);
    } else {
        var exports = $root._createNS('jQueryExt');
        factory($root.lang.type, $root.lang.object, exports);
    }
}(this, function(_type, _object, exports) {
    'use strict';
    exports = exports || {};
    
jQuery.typename = function() {
    return 'jQuery';
};

var selectorsCache = jQuery.__selectorsCache__ = {};

function getSelectorInInheritanceChain(obj, clazz, sigil) {
    clazz = clazz || obj.$getClass();
    var sigils = clazz.Sigils,
        selector;
    if (sigils) selector = sigils[sigil];
    while (!selector && typeof clazz.parent == 'function') {
        clazz = clazz.parent();
        if (!clazz) break;
        sigils = clazz.Sigils;
        if (sigils) selector = sigils[sigil];
        if (selector) break;
    }
    return selector;
}

if (typeof jQuery !== 'undefined') {
    jQuery.fn.sigil = function(sigil, returnSelector) {
        var clazz, selector, typename, hashkey, sels, obj, parent;
        if (typeof this.$getClass == 'function') {
            clazz = this.$getClass();
            typename = clazz.typename();
            hashkey = typename + ':' + sigil;
            selector = selectorsCache[hashkey];
            if (!selector) {
                selector = getSelectorInInheritanceChain(this, clazz, sigil);
                if (selector) selectorsCache[hashkey] = selector;
            }
            if (selector) {
                if (selector.indexOf('|') > 0) {
                    sels = selector.split('|');
                    if (returnSelector) {
                        return sels[0];
                    } else {
                        for (var i = 0; i === sels.length; ++i) {
                            obj = this.find(sels[i]);
                            if (obj.length > 0) return obj;
                        }
                    }
                } else {
                    return returnSelector ? selector : this.find(selector);
                }
            }

        }
        return returnSelector ? sigil : this.find(sigil);
    };

    /**
     * jQuery - Get Width of Element when Not Visible (Display: None)
     * http://stackoverflow.com/questions/1472303/jquery-get-width-of-element-when-not-visible-display-none
     */
    var props = {
        position: "absolute",
        visibility: "hidden",
        display: "block"
    };

    jQuery.fn.dimension = function() {
        var parent = this.parent(),
            self = this,
            dim = {
                width: 0,
                height: 0
            };
        if (!this.length) return dim;
        if (!parent.length) this.appendTo('body');
        $.swap(this[0], props, function() {
            dim.width = self.width();
            dim.height = self.height();
        });
        return dim;
    };

    var extractCreateOptions = function(ele, prefix) {
        var optionsFromAttributes = {},
            attrs = ele.attributes,
            name, path, attrNode;

        //gather creat options from element's attributes
        for (var i in attrs) {
            attrNode = attrs[i];
            name = attrNode.name;
            if (name.indexOf(prefix) < 0) continue;
            path = name.replace(prefix + '-', '').replace('-', '.');
            _object.tryset(optionsFromAttributes, path, attrNode.value);
        }
    };

    /**
     * create $root.ui.* class instance from attributed dom element
     * @param  {HTMLElement} ele
     * @return {jQuery}
     */
    jQuery.fromElement = function(ele, callback, opts) {
        var typenamePath = ele.getAttribute('az-typename');
        if (!_type.isElement(ele)) {
            throw Error('fromElement need first parameter to be a HTMLElement');
        } else if (!typenamePath) {
            return jQuery(ele);
        }
        if (ele.attributes.length === 0) return jQuery(ele);
        opts = opts || {};

        //TODO: aync loading
        require(typenamePath, function(clazz) {
            var instance = !_type.isFunction(clazz.create) ?
                null : clazz.create(extractCreateOptions(ele, opts.prefix || 'az'));
            if (callback) callback(instance);
            instance.removeAttr('az-typename');
        });
    };

    /**
     * add show/hide/remove events for jQuery
     */
    var _hide = jQuery.fn.hide;
    jQuery.fn.hide = function() {
        this.trigger('beforehide');
        _hide.apply(this, arguments);
        this.trigger('afterhide');
        return this;
    };

    var _show = jQuery.fn.show;
    jQuery.fn.show = function() {
        this.trigger('beforeshow');
        _show.apply(this, arguments);
        this.trigger('afterremove');
        return this;
    };

    var _remove = jQuery.fn.remove;
    jQuery.fn.remove = function() {
        this.trigger('beforeremove');
        _remove.apply(this, arguments);
        this.trigger('afterremove');
        return this;
    };
} //we have jQuery
    
    
    exports.__doc__ = "jQuery Sigil Extension";
    exports.VERSION = '0.0.1';
    return exports;
}));
//end of jQueryExt
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
/**
 * #Overlay#
 * =======
 * - Dependencies: `lang/type`,`browser/template`,`lang/arguments`,`lang/fn`,`jquery`,`jQueryExt`
 * - Version: 0.0.1
 */

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('ui/overlay', ['lang/type', 'browser/template', 'lang/arguments', 'lang/fn', 'jquery', 'jQueryExt'], factory);
    } else if (typeof module === 'object') {
        var $root_lang_type = require('lang/type'),
            $root_browser_template = require('browser/template'),
            $root_lang_arguments = require('lang/arguments'),
            $root_lang_fn = require('lang/fn'),
            jquery = require('jquery'),
            jQueryExt = require('jQueryExt');
        module.exports = factory($root_lang_type, $root_browser_template, $root_lang_arguments, $root_lang_fn, jquery, jQueryExt, exports, module, require);
    } else {
        var exports = $root._createNS('$root.ui.overlay');
        factory($root.lang.type, $root.browser.template, $root.lang.arguments, $root.lang.fn, jQuery, jQueryExt, exports);
    }
}(this, function(_type, _tpl, _arguments, _fn, $, jqe, exports) {
    'use strict';
    exports = exports || {};
    _tpl
        .set('$root.ui.overlay.iframeMask',"<iframe src=\"about:blank\" unselectable=\"on\" tabindex=\"-1\" class=\"ui-overlay\"></iframe>\n")
        .set('$root.ui.overlay.mask',"<div class=\"ui-overlay\" unselectable=\"on\" tabindex=\"-1\"></div>\n");
    var varArg = _arguments.varArg,
        tpl = _tpl.id$('$root.ui.overlay'),
        maskTemplate = tpl('mask');
    
    var Mask = _type.create('$root.ui.overlay.Mask', jQuery, {
        init: function() {
            this.base(maskTemplate);
        },
        setOpacity: function() {
            return varArg(arguments, this)
                .when('float', function(f) {
                    return [f];
                })
                .when('string', function(s) {
                    return [parseFloat(s)];
                })
                .when('*', function(s) {
                    return [parseFloat(String(s))];
                })
                .invoke(function(opacity) {
                    return this.css('opacity', opacity);
                });
        },
        getZIndex: function() {
            return this.css('z-index');
        }
    }).statics({
        WithMaskClassName: 'withmask'
    })
    
    var theMask = null,
        _oldHide, _oldShow, _oldRemove,
        visibleMaskSel = '.' + Mask.WithMaskClassName + ':visible';
    /**
     * ##Mask.getInstance()##
     * @return {Mask}
     */
    Mask.getInstance = function() {
        if (theMask === null) {
            theMask = new Mask();
            _oldHide = theMask.hide;
            _oldShow = theMask.show;
            _oldRemove = theMask.remove;
            theMask.hide = null;
            theMask.hide = function() {
                var args = arguments;
                setTimeout(function() {
                    if ($(visibleMaskSel).length === 0) {
                        _oldHide.apply(theMask, args);
                    }
                }, 0);
                return this;
            };
            theMask.remove = function() {
                var args = arguments;
                setTimeout(function() {
                    if ($(visibleMaskSel).length === 0) {
                        _oldRemove.apply(theMask, args);
                    }
                }, 0);
                return this;
            };
        }
        if (theMask.parent().length === 0) {
            theMask.appendTo('body');
        }
        return theMask;
    };
    
    Mask.disposeInstance = function() {
        if (theMask) {
            theMask.remove();
            theMask.$dispose();
            theMask = null;
        }
    };
        
    ///sigils

    exports['Mask'] = Mask;
//     exports['create'] = create;
    exports.__doc__ = "Overlay";
    exports.VERSION = '0.0.1';
    return exports;
}));
//end of $root.ui.overlay
/**
 * #dialogs#
 * =======
 * - Dependencies: `lang/type`,`lang/fn`,`lang/enumerable`,`browser/template`,`lang/arguments`,`ui/draggable`,`ui/overlay`,`jquery`,`jQueryExt`
 * - Version: 0.0.1
 */

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('ui/dialog', ['lang/type', 'lang/fn', 'lang/enumerable', 'browser/template', 'lang/arguments', 'ui/draggable', 'ui/overlay', 'jquery', 'jQueryExt'], factory);
    } else if (typeof module === 'object') {
        var $root_lang_type = require('lang/type'),
            $root_lang_fn = require('lang/fn'),
            $root_lang_enumerable = require('lang/enumerable'),
            $root_browser_template = require('browser/template'),
            $root_lang_arguments = require('lang/arguments'),
            $root_ui_draggable = require('ui/draggable'),
            $root_ui_overlay = require('ui/overlay'),
            jquery = require('jquery'),
            jQueryExt = require('jQueryExt');
        module.exports = factory($root_lang_type, $root_lang_fn, $root_lang_enumerable, $root_browser_template, $root_lang_arguments, $root_ui_draggable, $root_ui_overlay, jquery, jQueryExt, exports, module, require);
    } else {
        var exports = $root._createNS('$root.ui.dialog');
        factory($root.lang.type, $root.lang.fn, $root.lang.enumerable, $root.browser.template, $root.lang.arguments, $root.ui.draggable, $root.ui.overlay, jQuery, jQueryExt, exports);
    }
}(this, function(_type, _fn, _enum, _tpl, _arguments, _drag, _overlay, $, jqe, exports) {
    'use strict';
    exports = exports || {};
    _tpl
        .set('$root.ui.Dialog.dialog',"<div class=\"ui-dialog\">\n<div class=\"ui-dialog-header\">\n<a class=\"ui-dialog-title\"></a><a class=\"ui-dialog-title-button close\"></a>\n</div>\n<div class=\"ui-dialog-body\">\n            </div>\n<div class=\"ui-dialog-footer\"></div>\n</div>\n")
        .set('$root.ui.Dialog.button',"<button data-action=\"ok\" class=\"ui-dialog-button\"></button>\n")
        .set('$root.ui.Dialog.titleButton',"<a class=\"ui-dialog-close-button\" sigil-calss=\"Dialog\">&times;</a>\n")
        .set('$root.ui.Dialog.icon',"<div class=\"ui-dialog-icon\"></div>\n");
    //TODO
    //====
    //- [x] auto close, timeout
    //- [x] drag bug
    
    var varArg = _arguments.varArg,
        tpl = _tpl.id$('$root.ui.Dialog');
    
    /**
     * Dialog
     * ======
     * Generic dialog which contains only empty header,body,footer and can not be dragged.
     * Extends this class to implements your own dialog
     */
    var Dialog = _type.create('$root.ui.dialog.Dialog', jQuery, {
        init: function(opts) {
            var options = Dialog.options(opts);
            this.$attr('options', options);
            this.base(this.options.template || Dialog.Template.DefaultTemplate);
            this.$attr('header', this.sigil('.header'));
            this.$attr('body', this.sigil('.body'));
            this.$attr('footer', this.sigil('.footer'));
            this.$attr('buttons', this.sigil('.button'));
            Dialog_initialize(this, options);
        },
        /**
         * ##Dialog\#show()##
         * if dialog is not in DOM append it to body
         * if dialog is hidden, show it
         * @return {Dialog} dialog
         */
        show: function() {
            if (!this.parent().length) {
                this.appendTo('body');
            }
            if (this.options.mask) _overlay.Mask.getInstance().show();
            this.base.apply(this, arguments);
            return this;
        },
        hide: function() {
            //prevent call mask.hide when dialog is already hidden
            if (!this.is(':visible')) return this;
            if (this.options.mask) _overlay.Mask.getInstance().hide();
            this.base.apply(this, arguments);
            return this;
        },
        /**
         * ##Dialog\#showAt()##
         * ###Dialog\#showAt(xpos[, ypos])###
         * ###Dialog\#showAt(parent, xpos, ypox)###
         * Show dialog at given position
         * @param {Integer|Position} xpos
         * @param {Integer|Position} ypos
         * @param {Selector|HTMLElement} parent
         * @return {Dialog} dialog
         *
         * ```javascript
         * dialog.showAt(100,100);
         * dialog.showAt(Dialog.Position.GoldenRatio);
         * dialog.showAt(parent,Dialog.Position.Center);
         * ```
         */
        showAt: function() {
            var parent = this.parent(),
                inDom = parent.length > 0;
            if (!parent.length || parent.height() === 0 || parent.width() === 0) {
                parent = $(window);
            }
            varArg(arguments, this)
                .when(function() {
                    return [parent, this.css('left'), this.css('top')];
                })
                .same(['string'], ['int', 'string'], ['string', 'int'], function(xpos, ypos) {
                    this.data('showAt', [xpos, ypos]);
                    var coord = Dialog_getShowPosition(this, xpos, ypos);
                    coord.unshift(parent);
                    return coord;
                })
                .when('int', 'int', function(x, y) {
                    return [parent, x, y];
                })
                .when('int', function(x) {
                    return [parent, x, this.css('top')];
                })
                .when('jquery', 'int', 'int', function(parent, x, y) {
                    return [parent, x || 0, y || 0];
                })
                .invoke(function(parent, x, y) {
                    parent = parent || this.parent();
                    if (parent.length === 0) {
                        parent = document.body;
                    }
                    this.css({
                        left: x,
                        top: y
                    }).appendTo(parent).show();
                    if (this.options.mask) _overlay.Mask.getInstance().show();
                });
            return this;
        },
        /**
         * ##Dialog\#remove()##
         * Remove dialog from DOM.
         * Remove mask behide dialog if has
         * @return {Dialog} dialog
         */
        remove: function() {
            if (this.options.mask) _overlay.Mask.getInstance().remove();
            this.base();
            return this;
        },
        /**
         * ##Dialog\#setTitle(title)##
         * @param {String} title, string or html
         * @return {Dialog} dialog
         */
        setTitle: function(title) {
            var titleEle = this.sigil('.dialog-title');
            varArg(arguments, this)
                .when('htmlFragment', function(html) {
                    titleEle.html(html);
                })
                .when('*', function(arg) {
                    titleEle.text(String(arg));
                })
                .resolve();
            return this;
        },
        /**
         * ##Dialog\#setHeader(string)##
         * ###Dialog\#setHeader(html[,style])###
         */
        setHeader: function() {
            return Dialog_setPart(this, 'header', arguments);
        },
        /**
         * ##Dialog\#setBody(string)##
         * ###Dialog\#setBody(html[,style])###
         */
        setBody: function() {
            return Dialog_setPart(this, 'body', arguments);
        },
        /**
         * ##Dialog\#setFooter(string)##
         * ###Dialog\#setFooter(html[,style])###
         */
        setFooter: function() {
            return Dialog_setPart(this, 'footer', arguments);
        },
        /**
         * ##Dialog\#bringToFront()##
         * make dialog the first child of parent
         * @return {Dialog} dialog
         */
        bringToFront: function() {
            return Dialog_setLayerPosition(this, 'front');
        },
        /**
         * ##Dialog\#sendToBack()##
         * make dialog the last child of parent
         * @return {Dialog} dialog
         */
        sendToBack: function() {
            return Dialog_setLayerPosition(this, 'back');
        },
        /**
         * ##Dialog\#setDraggable(isDraggable)##
         * @param {Boolean} isDraggable
         * @return {Dialog} dialog
         */
        setDraggable: function(isDraggable) {
            var draggable = _drag.isDraggable(this.header),
                opts = this.options;
            if (draggable == null) return this;
    
            if (typeof isDraggable == 'undefined') {
                isDraggable = true;
            }
            if (isDraggable) {
                draggable.enable();
                opts.draggable = true;
                this.header.css('cursor', 'move');
            } else {
                draggable.disable();
                opts.draggable = false;
                this.header.css('cursor', 'default');
            }
            if (opts.autoReposition && !opts.draggable) {
                Dialog_reposition(this);
            }
            return this;
        },
        /**
         * ##Dialog\#setButtons(array of string)##
         * ###Dialog\#setButtons(array of config)###
         * ###Dialog\#setButtons(text1,...,textN)###
         * ###Dialog\#setButtons(config1,...,configN)###
         * @return {Dialog} dialog
         *
         * ```javascript
         * dialog.setButtons('OK','Cancel');
         * dialog.setButtons(['OK','Cancel']);
         * dialog.setButtons(
         *     {caption:'OK',css:{color:'green'},data:{id:100}},
         *     {caption:'Cancel',css:{color:'red'},data:{id:101}}
         * );
         * ```
         */
        setButtons: function() {
            var args = _arguments.toArray(arguments),
                footer = this.footer;
            varArg(args, this)
                .when('array', function(a) {
                    return [a];
                })
                .invoke(function(captions) {
                    captions = captions || args;
                    footer.empty();
                    _enum.each(captions, function(arg) {
                        var btn = Dialog_createButton(arg);
                        btn.appendTo(footer);
                    });
                });
            return this.$attr('buttons', this.sigil('.button'));
        }
    }).aliases({
        /**
         * ##Dialog\#setContent()##
         * alias of Dialog#setBody
         */
        setContent: 'setBody',
        /**
         * ##Dialog\#close()##
         * alias of Dialog#setBody
         */
        close: 'hide'
    }).options({
        // #Creating Options of Dialog#
        okButtonText: 'OK',
        cancelButtonText: 'Cancel', //default Cancel button text
        buttons: ['OK', 'Cancel'], //default buttons
        draggable: false, //whether dialog is draggble
        closeButton: true, //whether dialog has close button
        autoReposition: true, //whether reposition when window resized
        mask: true, //whether mask screen when dialog show up
        closeWhenLostFocus: false, //whether close dialog when lost focus(click outside dialog)
        content: '', //content of dialog, can be text or html
        title: '', //title of dialog
        position: 'golden' //default position when show
    }).statics({
        // #Dialog.Template#
        Template: {
            DefaultTemplate: tpl('dialog'),
            DefaultButton: tpl('button')
        },
        // #Dialog.Position#
        Position: {
            Center: 'center',
            GoldenRatio: 'golden'
        },
        // #Dialog.Parts#
        // Pre-defined Icons
        Parts: {
            IconError: $(tpl('icon')).addClass('error'),
            IconInfo: $(tpl('icon')).addClass('info'),
            IconWarnning: $(tpl('icon')).addClass('warnning')
        }
    }).events({
        // Dialog.Events
        // =============
        OnShowAt: 'ShowAt(event,x,y).Dialog',
        OnButtonClick: 'ButtonClick(event,buttonIndex,buttonCaption).Dialog'
    });
    
    function Dialog_createButton() {
        var button;
        varArg(arguments)
            .when('plainObject', function(config) {
                button = $(config.template || Dialog.Template.DefaultButton);
                button.text(config.caption);
                if (config.css) button.css(config.css);
                _enum.each(config.data, function(k, v) {
                    button.data(k, v);
                });
            })
            .when('*', function(cap) {
                button = $(Dialog.Template.DefaultButton);
                button.text(String(cap));
            })
            .resolve();
        return button;
    }
    
    function Dialog_initialize(self) {
        var opts = self.options;
        self.addClass('ui-generic-dialog');
    
        var draggable;
        opts.draggable = opts.draggable || true;
        if (opts.draggable) {
            draggable = _drag.draggable(self.header, self);
            self.$attr('draggable', draggable);
        } else {
            self.header.css('cursor', 'default');
        }
    
        if (opts.content) {
            self.setContent(opts.content);
        }
    
        opts.closeButton = opts.closeButton || true;
        var closeButton = self.sigil('.close-button');
        if (!opts.closeButton) {
            closeButton.remove();
        } else {
            closeButton.on('mouseup', function() {
                _fn.delay(function() {
                    self.close();
                }, 0);
            });
        }
    
        //register OnClose event handler if provided in create options
        if (_type.isFunction(self.options.onClose)) {
            self.on(Dialog.Events.OnClose, self.options.onClose);
        }
    
        //bring dialog to front when active
        self.header.on('mousedown', function(e) {
            self.bringToFront();
        });
    
        //delegate button click event
        var selector = self.sigil('.button', true);
        self.delegate(selector, 'click', function(e) {
            var button = $(e.target),
                buttons = self.sigil('.button'),
                index = buttons.index(button[0]),
                caption = button.text(),
                action = button.data('action');
    
            self.trigger(Dialog.Events.OnButtonClick, [index, caption]);
            if (action == 'ok' || action == 'cancel') {
                self.close();
            }
            return false;
        });
    
        if (opts.mask) {
            self.addClass(_overlay.Mask.WithMaskClass);
            _overlay.Mask.getInstance().show().before(self);
        }
    
        $(document).click(function(e) {
            if (!opts.closeWhenLostFocus) return;
            setTimeout(function() {
                if (!self.find(e.target).length) self.remove();
            }, 0);
        });
    }
    
    
    function Dialog_reposition(self) {
        var resizeEvent = 'resize.dialog',
            win = $(window);
        win.off(resizeEvent).on(resizeEvent, function() {
            var coord, pos = self.data('showAt');
            if (!pos) return;
            coord = Dialog_getShowPosition(self, pos[0], pos[1]);
            self.css({
                left: coord[0],
                top: coord[1]
            });
        });
    }
    
    function Dialog_getShowPosition(self, xpos, ypos) {
        var w, h, x = xpos,
            y = ypos,
            dim = self.dimension(),
            Center = Dialog.Position.Center,
            GoldenRatio = Dialog.Position.GoldenRatio,
            parent = self.parent()[0];
        if (typeof ypos == 'undefined') {
            ypos = Center;
        }
        if (xpos == Center || xpos == GoldenRatio) {
            w = parent.clientWidth;
            x = w / 2 - dim.width / 2;
            if (x < 0) x = 0;
        }
        if (ypos == Center || ypos == GoldenRatio) {
            h = parent.clientHeight;
            y = h / 2 - dim.height / 2;
            if (y < 0) y = 0;
        }
        if (xpos == GoldenRatio || ypos == GoldenRatio) {
            y = y * 0.618;
        }
        return [x, y];
    }
    
    
    function Dialog_setPart(self, whichPart, args) {
        var part = self[whichPart];
        if (!part || part.length === 0) {
            return self;
        }
        varArg(args, self)
            .when('htmlFragment', function(html) {
                part.html(html);
            })
            .when('string', function(text) {
                part.text(text);
            })
            .when('htmlFragment', 'plainObject', function(html, style) {
                part.html(html).css(style);
            })
            .when('*', function(anything) {
                part.text(String(anything));
            })
            .resolve();
        return self;
    }
    
    function Dialog_setLayerPosition(self, frontOrBack) {
        var sel = self.sigil('.dialog', true),
            parent = self.parent(),
            dialogs = parent.find(sel);
        if (!dialogs.length) return self;
        if (frontOrBack == 'front') {
            self.appendTo(parent);
        } else if (frontOrBack == 'back') {
            self.prependTo(parent);
        }
        return self;
    }
    
    /**
     * Alert
     * =====
     * Alert is a simple extension of Dialog.
     * With OK,Cancel,Close buttons and simple content
     */
    var Alert = Dialog.extend('$root.ui.dialog.Alert', {
        init: function(options) {
            this.base.apply(this, arguments);
            $.extend(this.options, options);
            this.setTitle(this.options.title || '');
            Alert_initialize(this);
        }
    });
    
    function Alert_initialize(self) {
        var opts = self.options, button;
        //if no buttons specified, create a default 'OK' button
        if (!opts.buttons && self.buttons.length === 0) {
            self.setButtons(opts.okButtonText);
        } else {
            self.setButtons(opts.buttons);
        }
        self.addClass('ui-dialog-alert');
    }
    
    
    Alert.create = function() {
        return varArg(arguments, this)
            .when('*', function(content) {
                return ['', content, null, null];
            })
            .when('*', 'function', function(content, fn) {
                return ['', content, fn, null];
            })
            .when('*', '*', function(title, content) {
                return [title, content, null, null];
            })
            .when('*', '*', 'function', function(title, content, fn) {
                return [title, content, fn, null];
            })
            .when('*', 'plainObject', function(content, opts) {
                return ['', content, null, opts];
            })
            .when(function() {
                return [location.host, undefined, null, null];
            })
            .otherwise(function() {
                return [location.host, undefined, null, null];
            })
            .invoke(function(title, content, onClose, options) {
                options = options || {};
                options.title = String(title);
                options.content = String(content);
                options.onClose = onClose;
                return new Alert(options);
            });
    };
    
    var alertSingleton = null;
    
    /**
     * ##dialog.alert(content)##
     * ##dialog.alert(content, onClose)##
     * ##dialog.alert(title, content, onClose)##
     * ##dialog.alert(content, options)##
     * @return {Alert} alert
     */
    function alert() {
        if (alertSingleton) {
            alertSingleton.close().remove();
            alertSingleton = null;
        }
        alertSingleton = Alert.create.apply(null, arguments);
        alertSingleton.showAt(Dialog.Position.GoldenRatio).setDraggable(false);
        return alertSingleton;
    }
    
    /**
     * Notice
     * ======
     * Notice is a auto-close Dialog without header, footer, buttons, only content.
     */
    var Notice = Dialog.extend('$root.ui.dialog.Notice', {
        init: function(options) {
            this.$attr('options', Notice.options(options));
            this.base.apply(this, arguments);
            this.header.remove();
            this.footer.remove();
            this.addClass('ui-dialog-notice');
            Notice_initialize(this, options);
        },
        showAt: function() {
            var self = this,
                opts = this.$get('options');
            this.base.apply(this, arguments);
            if (opts.duration > 0) {
                _fn.delay(self.remove, opts.duration, self);
            }
            return this;
        }
    }).statics({
        Type: {
            Info: Dialog.Parts.IconInfo,
            Error: Dialog.Parts.IconError,
            Warnning: Dialog.Parts.IconWarnning
        }
    }).options({
        // ##Creating Options of Notice##
        duration: 4000, //notice display duration
        type: Dialog.Parts.IconInfo //notice default type, see Notice.Type
    });
    
    function Notice_initialize(self, opts) {
        if (opts.type && opts.type.length > 0) self.body.prepend(opts.type);
    }
    
    function notice(content, duration, opts) {
        var n;
        opts = Notice.options(opts);
        opts.duration = duration;
        opts.content = content;
        n = new Notice(opts);
        n.showAt(Dialog.Position.GoldenRatio)
            .appendTo('body');
        return n;
    }
        
    ///sigils
    if (!Dialog.Sigils) Dialog.Sigils = {};
    Dialog.Sigils[".header"] = ".ui-dialog-header";
    Dialog.Sigils[".dialog-title"] = ".ui-dialog-title";
    Dialog.Sigils[".close-button"] = ".close";
    Dialog.Sigils[".body"] = ".ui-dialog-body";
    Dialog.Sigils[".footer"] = ".ui-dialog-footer";
    Dialog.Sigils[".dialog"] = ".ui-dialog";
    Dialog.Sigils[".button"] = ".ui-dialog-button";

    exports['Dialog'] = Dialog;
    exports['Alert'] = Alert;
    exports['alert'] = alert;
    exports['Notice'] = Notice;
    exports['notice'] = notice;
    exports.__doc__ = "dialogs";
    exports.VERSION = '0.0.1';
    return exports;
}));
//end of $root.ui.dialog
