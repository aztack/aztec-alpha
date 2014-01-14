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
 * - containsNullOrUndefined
 * - isEmpty
 * - isRegExp
 * - isString
 * - isArray
 * - isFunction
 * - isNumber
 * - isFinitNumber
 * - isBoolean
 * - isPlainObject
 * - isEmptyObject
 * - typename
 * - hasSameTypeName
 * - Boolean
 * - Number
 * - String
 * - Undefined
 * - Integer
 * - Class
 * - create
 * files:
 * - ../src/lang/type.js
 * - ../src/lang/type.oop.js
 * imports: {}
 */

;define('$root.lang.type',[],function(require, exports){
    //'use strict';
    
    
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
        for (i in arg) {
            return false;
        }
        return true;
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
            return _ctorName(arg);
        }
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
    // ../src/lang/type.oop.js
    /**
     *  Object-Orientated Programming Support
     */
    function instance$is(t) {
        var clazz = this.getClass();
        if (clazz === Object && t == Object) {
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
        var type = this.getClass().typename(),
            s = [],
            k, v;
        for (k in this) {
            if (this.hasOwnProperty(k)) {
                v = this[k];
                if (isString(v)) {
                    s.push(' ' + k + '="' + v + '"');
                } else if (isFunction(v)) {
                    continue;
                } else {
                    s.push(' ' + k + '=' + v);
                }
            }
        }
        return '#<' + type + s.join('') + '>';
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
        var name, parentProto = this.parent().prototype;
        this.super = instance$noop;
        for (name in methods) {
            if (!methods.hasOwnProperty(name)) continue;
    
            //if parent class does not define method with this name
            //just added it to prototype(instance method)
            if (!parentProto.hasOwnProperty(name)) {
                this.prototype[name] = methods[name];
                continue;
            }
    
            //if parent already defined a method with the same name
            //we need to wrap provided function to make call to
            //this.super() possible by replace this.super to
            //parent method on the fly
            this.prototype[name] = (function(name, method) {
                return function() {
                    //bakcup existing property named super
                    var t = this.super,
                        r;
    
                    //make this.super to parent's method
                    //so you can call this.super() in your method
                    this.super = parentProto[name];
    
                    //call the method
                    r = method.apply(this, arguments);
    
                    //restore super property
                    this.super = t;
                    return r;
                };
            }(name, methods[name]));
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
            name, m;
        if (len === 0) {
            return new Class('', this);
        } else if (len === 1) {
            return new Class('', this).methods(arguments[1]);
        }
        return new Class(arguments[0], this).methods(arguments[1]);
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
    function Class(typename, parent) {
        // use underscore as name for less debugging noise
        function instance$getClass() {
            return _;
        }
        var _ = function() {
            this.getClass = instance$getClass;
            this.toString = instance$toString;
            this.is = instance$is;
            if (isFunction(_.prototype.initialize)) {
                this.initialize.apply(this, arguments);
            }
        };
        _.getClass = clazz$getClass;
        _.methods = clazz$methods;
        _.statics = clazz$statics;
        _.newInstance = function() {
            return new _();
        };
        _.typename = function() {
            return typename || 'Object';
        };
        _.parent = function() {
            return parent || Object;
        };
        _.extend = clazz$extend;
        _.readonly = clazz$readonly;
        _.prototype = new parent();
        _.prototype.constructor = Class;
        return _;
    }
    
    Class.getClass = clazz$getClass;
    Class.methods = clazz$methods;
    Class.extend = clazz$extend;
    Class.readonly = clazz$readonly;
    Class.newInstance = function() {
        return new Class();
    };
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
            methods = getMethods(methodsOrFn);
            init = getInitializeFn(methods);
            return new Class(typename, parent, init).methods(methods);
        }
    }
    
    function getInitializeFn(methods) {
        if (isFunction(methods.initialize)) {
            init = methods.initialize;
            delete methods.initialize;
        } else {
            init = instance$noop;
        }
        return init;
    }
    
    function getMethods(methodsOrFn) {
        return (isFunction(methodsOrFn) ? methodsOrFn() : methodsOrFn) || {};
    }
    exports['isPrimitive'] = isPrimitive;
    exports['isUndefined'] = isUndefined;
    exports['isNull'] = isNull;
    exports['isNullOrUndefined'] = isNullOrUndefined;
    exports['containsNullOrUndefined'] = containsNullOrUndefined;
    exports['isEmpty'] = isEmpty;
    exports['isRegExp'] = isRegExp;
    exports['isString'] = isString;
    exports['isArray'] = isArray;
    exports['isFunction'] = isFunction;
    exports['isNumber'] = isNumber;
    exports['isFinitNumber'] = isFinitNumber;
    exports['isBoolean'] = isBoolean;
    exports['isPlainObject'] = isPlainObject;
    exports['isEmptyObject'] = isEmptyObject;
    exports['typename'] = typename;
    exports['hasSameTypeName'] = hasSameTypeName;
//     exports['Boolean'] = Boolean;
//     exports['Number'] = Number;
//     exports['String'] = String;
//     exports['Undefined'] = Undefined;
//     exports['Integer'] = Integer;
    exports['Class'] = Class;
    exports['create'] = create;
    return exports;
});
//end of $root.lang.type
