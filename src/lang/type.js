({
	description: "JavaScript type system supplement",
	namespace: $root.lang.type,
	exports: [
		isPrimitive,
		isUndefined,
		isNull,
		isNullOrUndefined,
		containsNullOrUndefined,
		isEmpty,
		isRegExp,
		isString,
		isArray,
		isFunction,
		isNumber,
		isBoolean,
		isPlainObject,
		isEmptyObject,
		typename,
		hasSameTypeName
	]
});

var _toString = Object.prototype.toString,
	_primitives = {
		'boolean': 'Boolean',
		'number': 'Number',
		'string': 'String',
		'undefined': 'Undefined'
	};

// exports

/**
 * isPrimitive
 * @param  {Any}  arg
 * @return {Boolean}
 */
function isPrimitive(arg) {
	return arg === null || typeof arg in _primitives;
}

/**
 * isUndefined
 * return true if all arguments are undefined
 * @param  {[type]}  arg [description]
 * @return {Boolean}     [description]
 */
function isUndefined(arg) {
	var i = arguemtns.length;
	if (i == 1) {
		return typeof arg == 'undefined';
	} else {
		while (--i) {
			if (typeof arguments[i] != 'undefined') return false;
		}
		return true;
	}
}

/**
 * isNull
 * return true if all arguments are null
 * @param  {[type]}  arg [description]
 * @return {Boolean}     [description]
 */
function isNull(arg) {
	var i = arguemtns.length;
	if (i == 1) {
		return typeof arg === null;
	} else {
		while (--i) {
			if (arguments[i] !== null) return false;
		}
		return true;
	}
}

/**
 * isNullOrUndefined
 * @param  {any}  arg
 * @return {Boolean}
 */
function isNullOrUndefined(arg) {
	return arg === null || typeof arg == 'undefined';
}

/**
 * containNullOrUndefined
 * return true if arguments contains null or undefined
 * @return {Boolean}
 */
function containsNullOrUndefined() {
	var i = arguments.length;
	while (i >= 0) {
		if (arguments[i] === null) return true;
		i = i - 1;
	}
	return false;
}

/**
 * isEmptyObjct
 * return true if arg has no property
 * @param  {Any}  arg
 * @return {Boolean}
 */
function isEmptyObject(arg) {
	var i;
	for (i in arg) {
		return false;
	}
	return true;
}

/**
 * isEmpty
 * return true if arg is undefined or null or zero length or plain object with no property
 * @param  {Any}  arg
 * @return {Boolean}
 */
function isEmpty(arg) {
	var b = typeof arg === 'undefined' || arg === null || arg.length === 0;
	return b ? true : isEmptyObject(arg);
}

function isRegExp(arg) {
	return _toString.call(arg) == '[object RegExp]';
}

function isString(arg) {
	return _toString.call(arg) == '[object String]';
}

/**
 * isArray
 * return true if given arg is truly an array
 * @see http://perfectionkills.com/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/
 * @param  {Any} arg
 * @return {Boolean}
 */
function isArray(arg) {
	return _toString.call(arg) == '[object Array]';
}

function isFunction(arg) {
	return _toString.call(arg) == '[object Function]';
}

function isNumber(arg) {
	return _toString.call(arg) == '[object Number]';
}

function isBoolean(arg) {
	return _toString.call(arg) == '[object Boolean]';
}

/**
 * isPlainObject
 * return true if arg is a plain object: create with object literal or new Object
 * @param  {Any}  arg
 * @return {Boolean}
 */
function isPlainObject(arg) {
	return arg && ctorName(arg) === 'Object';
}

/**
 * ctorName
 * return constructor of arg in string
 * @see http://stackoverflow.com/questions/332422/how-do-i-get-the-name-of-an-objects-type-in-javascript
 * @param  {Any} arg can be anything
 * @return {String} string representation of constructor of arg
 * @remark
 *     `arg.constructor` and `instanceof` are both not work cross-frame and cross-window
 */
function _ctorName(arg) {
	var ctor = arg.constructor;
	if (isFunction(ctor) && !isEmpty(ctor.name)) {
		return ctor.name;
	} else {
		return _toString.call(arg).slice(8, -1);
	}
}

/**
 * typename
 * return type of arg in string
 * @param  {Any} arg
 * @return {String}
 */
function typename(arg) {
	var t = typeof arg;
	if (arg === null) {
		return 'Null';
	}
	return t in _primitives ? _primitives[t] : _ctorName(arg);
}

/**
 * hasSameTypeName
 * return true if a, b has the same type name
 * @param  {Any}  a
 * @param  {Any}  b
 * @return {Boolean}
 */
function hasSameTypeName(a, b) {
	return typename(a) == typename(b);
}