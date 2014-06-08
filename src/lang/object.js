({
    description: "Object Utils",
    version: '0.0.1',
    namespace: $root.lang.object,
    imports: {
        _type: $root.lang.type,
        _str: $root.lang.string,
        _enum: $root.lang.enumerable
    },
    exports: [
        mix,
        keys,
        values,
        tryget,
        tryset,
        pairs,
        fromPairs,
        fromKeyValuePairString
    ]
});

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
function keys(obj) {
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