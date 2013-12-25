({
	description: "Ruby String like string module",
	namespace: $root.lang.array,
	imports: {
		_type: $root.lang.type
	},
	exports: [
		forEach,
		toArray
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