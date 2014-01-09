({
    description: "JavaScript Type System Supplement",
    version: '0.0.1',
    namespace: $root.lang.type,
    exports: [
        isPrimitive,
        isUndefined,
        isNull,
        isNullOrUndefined,
        containsNullOrUndefined,
        isEmpty,
        isRegExp,
        isString,
        isArray,
        isFunction,
        isNumber,
        isFinitNumber,
        isBoolean,
        isPlainObject,
        isEmptyObject,
        typename,
        hasSameTypeName,
        create
    ]
});

var _toString = Object.prototype.toString,
    _primitives = {
        'boolean': 'Boolean',
        'number': 'Number',
        'string': 'String',
        'undefined': 'Undefined'
    };

// exports

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
 * @param  {[type]}  arg [description]
 * @return {Boolean}     [description]
 */
function isUndefined(arg) {
    var i = arguments.length;
    if (i == 1) {
        return typeof arg == 'undefined';
    } else {
        while (--i) {
            if (typeof arguments[i] != 'undefined') return false;
        }
        return true;
    }
}

/**
 * isNull
 * return true if all arguments are null
 * @param  {[type]}  arg [description]
 * @return {Boolean}     [description]
 */
function isNull(arg) {
    var i = arguemtns.length;
    if (i == 1) {
        return typeof arg === null;
    } else {
        while (--i) {
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
    var i = arguments.length;
    while (i >= 0) {
        if (arguments[i] === null) return true;
        i = i - 1;
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
function _ctorName(arg) {
    var ctor = arg.constructor;
    if (isFunction(ctor) && !isEmpty(ctor.name)) {
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
    var t;
    if (isFunction(arg.__class__)) {
        return arg.__class__.typename();
    }
    t = typeof arg;
    if (arg === null) {
        return 'Null';
    }
    return t in _primitives ? _primitives[t] : _ctorName(arg);
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

/**
 * Object-Orientated Programming Support
 */
function clazz$getClass(){
    return Class;
}

function instance$is(t) {debugger;
    var clazz = this.getClass();
    if (clazz === Object && t == Object) {
        return true;
    }
    while(clazz !== Object) {
        if (clazz === t) {
            return true;
        }
        if (!isFunction(clazz.getParent)) {
            return false;
        }
        clazz = clazz.getParent();
    }
    return false;
}

var clazz$getParent = clazz$getClass;
/**
 * The Ultimate Class class
 * Methods inheritated through protype chain
 * proeprty belongs to every instance, not shared throught prototype
 */
function Class(typename, parent, init){
    // use underscore as name for less debugging noise
    var _ = function (){
        this.getClass = function (){
            return _;
        };
        this.is = instance$is;
        this.constructor = _;
        if (parent.prototype.initialize) {
            parent.prototype.initialize.apply(this, arguments);
        }
        init.apply(this, arguments);
    };
    _.getClass = clazz$getClass;
    _.newInstance = function(){
        return new _();
    };
    _.typename = function(){
        return typename || 'Object';
    };
    _.getParent = function(){
        return parent || Object;
    };
    _.constructor = Class;
    _.prototype = new parent();
    _.prototype.initialize = init;    
    return _;
};

Class.getClass = clazz$getClass;
Class.newInstance = function(){
    return new Class();
};
Class.typename = function(){
    return 'Class';
};
Class.getParent = clazz$getParent;

Person = new Class('Person',Object, function(){
    this.name = 'adma';
})
Student = new Class('Student', Person,function(){
    this.grade = 0;
});

p = new Person();
s = new Student();

function include(mod) {
    for(var i in mod) {
        if (mod.hasOwnProperty(i) && isFunction(mod)) {
            this.prototype[i] = mod[i];
        }
    }
    return this;
}

function create(/* [typename, [parent,]] init */) {
    var len = arguments.length,
        typename, parent, init;
    if (len === 1) {
        init = arguments[0];
    } else if (len === 2) {
        typename = String(arguments[0]);
        init = arguments[1];
    } else if (len === 3) {
        typename = String(arguments[0]);
        parent = arguments[1];
        init = arguments[2];
    }
    if (!isFunction(init)) {
        throw Error('(constructor (1/1 or 2/3 argument) must be a function!');
    } else if (len === 3 && isFunction(parent)) {
        throw Error('parent (2/3 argument) must be a function')
    }
    
    return new Class(typename, parent, init);
}


Person = type.create('Person', function (){
});
type.create('Student', Person, function(){
});

type.create('module', {
    hi: function(){}
});




































