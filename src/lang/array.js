({
	description: "Ruby String like string module",
	version: '0.0.1',
	namespace: $root.lang.array,
	imports: {
		_type: $root.lang.type
	},
	exports: [
		forEach,
		toArray,
		equal,
		strictEqual,
		compact,
		flatten
	]
});

///imports
var _forEach = Array.prototype.forEach,
	_slice = Array.prototype.slice;

///exports

/**
 * forEach
 * @param  {[type]}   ary [description]
 * @param  {Function} fn  [description]
 * @return {[type]}       [description]
 */
var forEach = _forEach ? function(ary, fn) {
		_forEach.call(ary, fn);
	} : function(ary, fn) {
		var i = 0,
			len = ary.len,
			item;
		for (; i < len; ++i) {
			item = ary[i];
			fn(item, i);
		}
	};

/**
 * toArray
 * convert array like object into an array
 * @param  {Any} arrayLike
 * @param  {int} start, where to start slice, included
 * @param  {int} end, where to end slice, not included
 * @return {Array}
 */
function toArray(arrayLike, start, end) {
	// if arrayLike has a number value length property
	// then it can be sliced
	return _type.isNumber(arrayLike.length) ? _slice.call(arrayLike, start, end) : [];
}

function equal(a, b) {
	var i = 0,
		len = a.length;
	if (len !== b.length) return false;
	for (; i < len; ++i) {
		if (a[i] == b[i]) {
			continue;
		} else if (_type.isArray(a[i], b[i])) {
			if (!equal(a[i], b[i])) return false;
		} else {
			return false;
		}
	}
	return true;
}

function strictEqual(a, b) {
	var i = 0,
		len = a.length;
	if (len !== b.length) return false;
	for (; i < len; ++i) {
		if (a[i] === b[i]) {
			continue;
		} else if (_type.isArray(a[i], b[i])) {
			if (!equal(a[i], b[i])) return false;
		} else {
			return false;
		}
	}
	return true;
}

/**
 * compact
 * remove empty item(undefined,null, zero length array/object/string, 0) from an array
 * @param  {Array} ary
 * @return {Array}
 */
function compact(ary) {
	var ret = [];
	if (!_type.isArrayLike(ary)) return ret;
	var i = ary.length;
	while (--i) {
		if (_type.isEmpty(ary[i])) continue;
		ret.unshift(arg[i]);
	}
	return ret;
}

/**
 * flatten an array into a one-dimension array
 * @param  {Array} ary
 * @return {Array}
 */
function flatten(ary) {
	if (!_type.isArray(ary)) return [ary];
	var i = 0,
		obj,
		len = ary.length,
		r, ret = [];
	for (; i < len; ++i) {
		obj = ary[i];
		if (_type.isArray(obj)) {
			r = flatten(obj);
			ret = ret.concat(r);
		} else {
			ret.push(obj);
		}
	}
	return ret;
}