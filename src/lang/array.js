({
	description: "Ruby String like string module",
	namespace: $root.lang.array,
	imports: {
		_type: $root.lang.type
	},
	exports: [
		forEach,
		first,
		last
	]
});

var _forEach = Array.prototype.forEach,
    forEach = _forEach ? function(ary, fn) {
	_forEach.call(ary,fn);
} : function(ary, fn) {
	var i = 0, len = ary.len, item;
	for(;i < len; ++i) {
		item = ary[i];
		fn(item,i);
	}
};

