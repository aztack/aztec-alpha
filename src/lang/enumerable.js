({
	description: "Enumerable Interface",
	namespace: $root.lang.enumerable,
	imports:{
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

function _array_each(ary, fn, thisValue, stopWhenFnReturnFalse) {
	var i = 0, len = ary.len, ret;
	if( typeof stopWhenFnReturnFalse == 'undefined' ) {
		stopWhenFnReturnFalse = false;
	}
	for(; i < len; ++i) {
		ret = fn.call(thisValue, ary[i], i);
		if (ret === false && stopWhenFnReturnFalse) break;
	}
	return ary;
}

function _object_each(obj, fn, thisValue, stopWhenFnReturnFalse){
	var key, ret, i = 0;

	if(!_type.isFunction(fn)) return obj;

	if( typeof stopWhenFnReturnFalse == 'undefined' ) {
		stopWhenFnReturnFalse = false;
	}

	for(key in obj) {
		ret = fn.call(thisValue, key, obj[key], i);
		if(ret === false && stopWhenFnReturnFalse) break;
	}
	return obj;
}

function each() {
	return _type.isArray(any) 
		? _array_each.call(null, arguments) 
		: _object_each.call(null, arguments);
}
