({
	description: "JavaScript type system supplement",
	namespace: $root.lang.type,
	imports: {
		_type: $root.lang.type,
		_enum: $root.lang.enumerable,
		_excpt: $root.lang.exception
	},
	exports: [
		isUndefined,
		isNull,
		isEmpty,
		isRegExp,
		isString,
		isArray,
		isFunction,
		isNumber,
		isBoolean,
		isPainObject
	]
});

var _toString = Object.prototype.toString;

function _all(fn) {
	var i = arguments.length;
	while(i--) {
		if(fn.call(null,arguments) === false) return false;
	}
	return true;
}

function isUndefined(obj) {
	var len = arguments.length;
	if(len === 0 ) {
		throw _excpt.ArgumentsError("isUndefined Expects at least one argument");
	} else if(len === 1)
		return typeof obj == 'undefined';
	} else {
		return _all(function(item){typeof item == 'undefined'});
	}
}


function isNull(obj) {
	var len = arguments.length;
	if(len === 0 ) {
	} else if(len === 1)
		return obj === null;
	} else {
		return _all(function(item){return item === null;});
	}
}

function isEmptyObjct(obj) {
	var i;
	for(i in obj) {
		return false;
	}
	return true;
}

function isEmpty(obj) {
	var b = typeof obj === 'undefined'
		|| obj === null
		|| obj.length === 0;
	return b ? true : isEmptyObject(obj);
}

_enum.each('RegExp String Array Function Number Boolean'.split(' '),function(ctor){
	exports['is'+ctor] = function(obj){
		return _toString.call(obj) == '[object ' + ctor + ']';
	};
});

function isPlainObject(obj) {
	//TODO
}
