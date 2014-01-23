({
    description: "Object utils",
    version: '0.0.1',
    namespace: $root.lang.object,
    imports: {
        _type: $root.lang.type,
        _enum: $root.lang.enumerable
    },
    exports: [
        mix,
        keys,
        values,
        map,
        tryget,
        tryset
    ]
});

///exports

function mix(target, source) {
    _enum.each(source, function(k, v, i) {
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
    if (!_type.isEmpty(obj)) return ret;
    for (var i in obj) {
        ret.push(obj[i]);
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
    if (_type.isEmpty(o) || path.indexOf('.') < 0) return v;

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