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

function instance$methods() {
    var ret = [];
    for(var m in this) {
        if(typeof this[m] == 'function' && this.hasOwnProperty(m)) {
            ret.push(m);
        }
    }
    return ret;
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
    this.base = instance$noop;
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
        //this.base() possible by replace this.base to
        //parent method on the fly
        this.prototype[name] = (function(name, method) {
            return function() {
                //bakcup existing property named base
                var t = this.base,
                    r;

                //make this.base to parent's method
                //so you can call this.base() in your method
                this.base = parentProto[name];

                //call the method
                r = method.apply(this, arguments);

                //restore base property
                this.base = t;
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
        var ret, init;
        this.getClass = instance$getClass;
        this.toString = instance$toString;
        this.methods = instance$methods;
        this.is = instance$is;
        if (isFunction(_.prototype.initialize)) {
            init = this.initialize;
            ret = init.apply(this, arguments);
        } else if (isFunction(_.prototype.init)) {
            init = this.init;
            if(!isFunction(init)) {
                init = _.prototype.init;
            }
            ret = init.apply(this, arguments);
        }
        return ret;
    };
    _.getClass = clazz$getClass;
    _.methods = clazz$methods;
    _.statics = clazz$statics;
    _.typename = function() {
        return typename;
    };
    _.parent = function() {
        return parent || _.prototype.constructor;
    };
    _.extend = clazz$extend;
    _.readonly = clazz$readonly;
    if (parent) {
        _.prototype = new parent();
        //this will make extends jQuery failed
        //cause jQuery will call constructor to create new instance
        //_.prototype.constructor = Class;
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