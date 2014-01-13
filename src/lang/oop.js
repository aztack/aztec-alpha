({
    description: " Object-Orientated Programming Support",
    version: '0.0.1',
    namespace: $root.lang.type,
    exports: [
        Class,
        create
    ],
    priority: 1
});

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
var clazz$parent = clazz$getClass;

/**
 * define methods of a class
 * inspired by http://ejohn.org/blog/simple-javascript-inheritance/
 */
function clazz$methods(methods) {
    var name, parentProto = this.parent().prototype;
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
    var name;
    for (name in props) {
        if (!props.hasOwnProperty(name)) continue;
        this[name] = props[name];
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
    _.prototype = new parent();
    _.prototype.constructor = Class;
    return _;
}

Class.getClass = clazz$getClass;
Class.methods = clazz$methods;
Class.extend = clazz$extend;
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
 */
function create(typename, parent, methods) {
    var init;
    typename = isString(typename) ? typename : '';
    parent = isFunction(parent) ? parent : Object;
    methods = methods || {};
    if (isFunction(methods.initialize)) {
        init = methods.initialize;
        delete methods.initialize;
    } else {
        init = function() {};
    }
    return new Class(typename, parent, init).methods(methods);
}