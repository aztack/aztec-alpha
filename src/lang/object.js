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
		inject
	]
});

///exports

function mix(target, source) {
	_enum.each(source,function(k,v,i){
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
function keys(obj) {
	var ret = [];
	for (var i in obj) {
		ret.push(i);
	}
	return ret;
}

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
 * Inject
 * @param  {Any} obj
 * @param  {Any} init
 * @param  {Function} fn
 * @return {Any}
 */
function inject(obj, init, fn) {
	if (_type.isEmpty(obj)) return init;
	_type.each(obj, function(k, v, i) {
		init = fn(init, k, v, i);
	})
	return init;
}

/**
 * tryget
 * try to retrieve value of object according to given `path`
 * @param {Object} o
 * @param {String} path
 * @param {Any} v, default value if
 * @returns {Any}
 */
function tryget(o, path, v) {
    if (_type.isEmpty(o) || path.indexOf('.') < 0) return v;

    var parts = path.split("."),
        part, x, len = parts.length;

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
