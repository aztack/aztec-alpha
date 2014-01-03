({
	description: "Enumerable Interface",
	version: '0.0.1',
	namespace: $root.lang.enumerable,
	imports: {
		_type: $root.lang.type,
		_ary: $root.lang.array
	},
	exports: [
		each,
		eachWithIndex,
		map,
		inject,
		find,
		findAll,
		reject,
		deleteIf
	]
});

///helper

function _array_each(ary, fn, thisValue, stopWhenFnReturnFalse) {
	var i = 0,
		len = ary.len,
		ret;
	if (typeof stopWhenFnReturnFalse == 'undefined') {
		stopWhenFnReturnFalse = false;
	}
	for (; i < len; ++i) {
		ret = fn.call(thisValue, ary[i], i);
		if (ret === false && stopWhenFnReturnFalse) break;
	}
	return ary;
}

function _object_each(obj, fn, thisValue, stopWhenFnReturnFalse) {
	var key, ret, i = 0;

	if (!_type.isFunction(fn)) return obj;

	if (typeof stopWhenFnReturnFalse == 'undefined') {
		stopWhenFnReturnFalse = false;
	}

	for (key in obj) {
		ret = fn.call(thisValue, key, obj[key], i);
		if (ret === false && stopWhenFnReturnFalse) break;
	}
	return obj;
}

/// exports

/**
 * each
 * iterate over an array or object
 * @return {object} return array or object being iterated
 */
function each() {
	return _type.isArray(any) 
		? _array_each.call(null, arguments) 
		: _object_each.call(null, arguments);
}

/**
 * all
 * return true if all objs pass fn test(fn return true)
 * @param  {[type]}   objs [description]
 * @param  {Function} fn   [description]
 * @return {[type]}        [description]
 */
function all(objs, fn) {
	var i = objs.length;
	while (--i) {
		if (fn.call(null, objs[i]) === false) return false;
	}
	return true;
}
