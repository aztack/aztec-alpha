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