/**
 * ---
 * description: JavaScript Type System Supplement
 * version: 0.0.1
 * namespace: $root.lang.type
 * exports:
 * - isPrimitive
 * - isUndefined
 * - isNull
 * - isNullOrUndefined
 * - isUndefinedOrNull
 * - containsNullOrUndefined
 * - isEmpty
 * - isRegExp
 * - isString
 * - isArray
 * - isFunction
 * - isNumber
 * - isInteger
 * - isFloat
 * - isFinitNumber
 * - isBoolean
 * - isPlainObject
 * - isEmptyObject
 * - isElement
 * - typename
 * - object
 * - hasSameTypeName
 * - Boolean
 * - Number
 * - String
 * - Undefined
 * - Integer
 * - Class
 * - Classes
 * - ObjectSpace
 * - create
 * files:
 * - src/lang/type.js
 * - src/lang/type.oop.js
 * imports: {}
 */

;define('lang/type',[{}], function (){
    //'use strict';
    var exports = {};
    
        var _toString = Object.prototype.toString,
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
    
    /**
     * isArray
     * return true if given arg is truly an array
     * @see http://perfectionkills.com/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/
     * @param  {Any} arg
     * @return {Boolean}
     */
    function isArray(arg) {
        return _toString.call(arg) == '[object Array]';
    }
    
    /**
     * isArrayLike
     * return true if arg has a length property and it's a integer
     * @param  {Any}  arg
     * @return {Boolean}
     */
    function isArrayLike(arg) {
        return isInteger(arg.length);
    }
    
    function isFunction(arg) {
        return _toString.call(arg) == '[object Function]';
    }
    
    function isNumber(arg) {
        return _toString.call(arg) == '[object Number]';
    }
    
    function isFinitNumber(arg) {
        if (arg === null) return false;
        return isFinit(arg);
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
        return arg && ctorName(arg) === 'Object';
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
        } else if (isFunction(arg.getClass)) {
            return arg.getClass().typename();
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
    // src/lang/type.oop.js
    /**
     *  Object-Orientated Programming Support
     */
    var Classes = {}, $ObjectSpace = {}, ObjectSpace = function() {};
    
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
        var clazz = this.getClass();
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
    
    var objectToStringValue = '[object Object]';
    
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
    /**
     * print object in format #<typename a=1 b="s">
     */
    function instance$toString() {
        var type = this.getClass().typename(),
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
    
    function instance$methods(includeMethodOnThisObject) {
        var ret = [],
            proto = this.getClass().prototype;
        ret = getMethodsOn(proto);
        if (includeMethodOnThisObject === true) {
            ret = getMethodsOn(this).concat(ret);
        }
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
        var typename = this.getClass().typename(),
            objSpace, attrs, cacheKey = typename + '@' + this.__id__,
            metaData = metaDataCache[cacheKey];
    
        if (typeof notifyObservers == 'undefined') {
            notifyObservers = true;
        }
    
        if (!metaData) {
            metaData = initMetaData(typename, cacheKey, this.__id__);
        }
        observers = metaData.observers;
        attrs = metaData.attrs;
        tryset(attrs, keyPath, value);
        if ( !! notifyObservers && observers) {
            for (var name in observers) {
                observers[name].call(this, value);
            }
        }
        return this;
    }
    
    function instance$get(keyPath, alternative) {
        var typename = this.getClass().typename(),
            objSpace, attrs, cacheKey = typename + '@' + this.__id__,
            metaData = metaDataCache[cacheKey];
    
        if (!metaData) {
            metaData = initMetaData(typename, cacheKey, this.__id__);
        }
        attrs = metaData.attrs;
        return keyPath ? tryget(attrs, keyPath, alternative) : attrs;
    }
    
    function instance$observe_internal(keyPath, name, fn) {
        var typename = this.getClass().typename(),
            objSpace, cacheKey = typename + '@' + this.__id__,
            metaData = metaDataCache[cacheKey],
            index;
    
        if (!metaData) {
            metaData = initMetaData(typename, cacheKey, this.__id__);
        }
    
        observers = metaData.observers;
        if(arguments.length === 0) return observers;
    
        if (typeof fn == 'function') {
            observers[name] = fn;
        } else if (fn === null) {
            observers[name] = null;
            delete observers[name];
        }
        return this;
    }
    
    function instance$observe(keyPath, name, fn) {
        if(typeof fn == 'undefined' && typeof name == 'function') {
            fn = name;
            name = keyPath;
        }
        if(arguments.length === 0) {
            return instance$observe_internal.call(this);
        } else {
            return instance$observe_internal.call(this, keyPath, name, fn);
        }
    }
    
    function instance$unobserve(keyPath, name) {
        return instance$observe_internal.call(this, keyPath, name, null);
    }
    
    function instance$dispose() {
        var typename = this.getClass().typename(),
            objSpace, id;
    
        //delete meta data
        id = this.__id__;
        objSpace = $ObjectSpace[typename];
        objSpace[id] = null;
        delete objSpace[id];
    
        return this;
    }
    
    /**
     * Every instance create with class which create with type.Class or type.create
     * will has a getClass function to get it's class object
     * `class` is a reserved word so we use `getClass` instead
     */
    function clazz$getClass() {
        return Class;
    }
    
    function instance$noop() {}
    
    var clazz$parent = clazz$getClass;
    
    /**
     * define methods of a class
     * inspired by http://ejohn.org/blog/simple-javascript-inheritance/
     */
    function clazz$methods(methods) {
        if (!methods) {
            return instance$methods.call(this);
        }
        var name, parentProto = this.parent().prototype,
            m;
        this.base = instance$noop;
        for (name in methods) {
            if (!methods.hasOwnProperty(name)) continue;
    
            if (!parentProto[name]) {
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
                })(methods['init']);
            }
        }
        return this;
    }
    
    function clazz$aliases(aliases) {
        var from, parentProto = this.parent().prototype,
            aliase;
        for (from in aliases) {
            if (!aliases.hasOwnProperty(from)) continue;
            to = aliases[from];
            this.prototype[from] = this.prototype[to];
        }
        return this;
    }
    
    function clazz$statics(props) {
        var name, methods;
        if (isFunction(props)) {
            methods = props();
        } else {
            methods = props || {};
        }
    
        for (name in methods) {
            if (!methods.hasOwnProperty(name)) continue;
            this[name] = methods[name];
        }
        return this;
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
            this.getClass = instance$getClass;
            this.toString = instance$toString;
            this.methods = instance$methods;
            this.is = instance$is;
            this.$class = _;
    
            /**
             * key-value observing support
             * method name starts with $ to avoid conflicts
             */
            this.$set = instance$set;
            this.$get = instance$get;
            this.$observe = instance$observe;
            this.$unobserve = instance$unobserve;
            this.$dispose = instance$dispose;
    
            if (isFunction(_.prototype.init)) {
                init = this.init;
                if (!isFunction(init)) {
                    init = _.prototype.init;
                }
                ret = init.apply(this, arguments);
            } else if (isFunction(_.prototype.initialize)) {
                init = this.initialize;
                if (!isFunction(init)) {
                    init = _.prototype.initialize || _.prototype.init;
                }
                ret = init.apply(this, arguments);
            }
            id = this.__id__ = objSpace.count;
            objSpace[id] = {};
            objSpace.count += 1;
            return ret;
        };
        _.getClass = clazz$getClass;
        _.methods = clazz$methods;
        _.aliases = clazz$aliases;
        _.statics = clazz$statics;
        _.typename = function() {
            return name;
        };
        _.parent = function() {
            return parent || _.prototype.constructor;
        };
        _.extend = clazz$extend;
        _.readonly = clazz$readonly;
        if (parent) {
            //create a instance of parent without invoke constructor
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
    
    Class.getClass = clazz$getClass;
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
        var init, methods, len = arguments.length,
            arg0 = arguments[0],
            arg1 = arguments[1],
            arg2 = arguments[2],
            noop = instance$noop;
    
        if (len === 0) {
            //type.create();
            return new Class('', Object, noop);
        } else if (len === 1) {
            if (isString(arg0)) {
                //type.create('ClassName');
                return new Class(typename, Object, noop);
            } else if (isFunction(arg0)) {
                //type.create(Parent);
                return new Class('', arg0, noop);
            } else if (isPlainObject(arg0)) {
                //type.create({method:function(){}});
                return new Class('', Object, noop).methods(arg0);
            }
        } else if (len === 2) {
            if (isString(arg0) && isFunction(arg1)) {
                //type.create('ClassName',Parent);
                return new Class(arg0, arg1, noop);
            } else if (isString(arg0) && isPlainObject(arg1)) {
                //type.create('ClassName',{method:function(){}})
                return new Class(arg0, Object, noop).methods(arg1);
            } else if (isFunction(arg0) && isPlainObject(arg1)) {
                //type.create(Parent,{method:function(){}})
                return new Class('', arg0).methods(arg1);
            }
        } else {
            //type.create('ClassName',Parent,{method:function(){});
            typename = isString(typename) ? typename : '';
            parent = isFunction(parent) ? parent : Object;
            methods = (isFunction(methodsOrFn) ? methodsOrFn() : methodsOrFn) || {};
            return new Class(typename, parent).methods(methods);
        }
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
    exports['isFunction'] = isFunction;
    exports['isNumber'] = isNumber;
    exports['isInteger'] = isInteger;
    exports['isFloat'] = isFloat;
    exports['isFinitNumber'] = isFinitNumber;
    exports['isBoolean'] = isBoolean;
    exports['isPlainObject'] = isPlainObject;
    exports['isEmptyObject'] = isEmptyObject;
    exports['isElement'] = isElement;
    exports['typename'] = typename;
    exports['object'] = object;
    exports['hasSameTypeName'] = hasSameTypeName;
//     exports['Boolean'] = Boolean;
//     exports['Number'] = Number;
//     exports['String'] = String;
//     exports['Undefined'] = Undefined;
//     exports['Integer'] = Integer;
    exports['Class'] = Class;
    exports['Classes'] = Classes;
    exports['ObjectSpace'] = ObjectSpace;
    exports['create'] = create;
    exports.__doc__ = "JavaScript Type System Supplement";
    return exports;
});
//end of $root.lang.type