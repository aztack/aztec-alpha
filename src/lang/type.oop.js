({
    description: " Object-Orientated Programming Support",
    version: '0.0.1',
    namespace: $root.lang.type,
    exports: [
        Class,
        Classes,
        create
    ],
    priority: 1
});

var Classes = {};

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
    // use underscore as name for less debugging noise
    function instance$getClass() {
        return _;
    }
    var _ = function() {
        var ret, init;
        this.getClass = instance$getClass;
        this.toString = instance$toString;
        this.methods  = instance$methods;
        this.is = instance$is;
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
        if(!Classes[parentName]) {
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