({
	description: "JavaScript type system supplement",
	namespace: $root.lang.type,
	imports: {
		_enum: $root.lang.enumerable
	},
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
		isEmptyObjct,
		ctorName
	]
});

var _toString = Object.prototype.toString,
	_all = _enum.all;

// exports

/**
 * isPrimitive
 * @param  {Any}  arg
 * @return {Boolean}
 */
function isPrimitive(arg) {
	return arg === null ||
		typeof arg === 'boolean' ||
		typeof arg === 'number' ||
		typeof arg === 'string' ||
		typeof arg === 'symbol' || // ES6 symbol
	typeof arg === 'undefined';
}

/**
 * isUndefined
 * return true if all arguments are undefined
 * @param  {[type]}  arg [description]
 * @return {Boolean}     [description]
 */
function isUndefined(arg) {
	if (arguments.length > 1) {
		return _all(arguments, function(item) {
			typeof item == 'undefined'
		});
	} else {
		typeof item == 'undefined'
	}
}

/**
 * isNull
 * return true if all arguments are null
 * @param  {[type]}  arg [description]
 * @return {Boolean}     [description]
 */
function isNull(arg) {
	if (arguments.length > 1) {
		return _all(arguments, function(item) {
			return item === null;
		});
	} else {
		return arg === null;
	}
}

/**
 * isNullOrUndefined
 * @param  {any}  arg
 * @return {Boolean}
 */
function isNullOrUndefined(arg) {
	return arg == null;
}

/**
 * containNullOrUndefined
 * return true if arguments contains null or undefined
 * @return {Boolean}
 */
function containsNullOrUndefined() {
	var i = arguments.length;
	while(i >= 0) {
		if (arguments[i] == null) return true;
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
function isEmptyObjct(arg) {
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

/**
 * isArray
 * return true if given arg is truly an array
 * @see http://perfectionkills.com/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/
 * @param  {Any} arg
 * @return {Boolean}
 */
_enum.each('RegExp String Array Function Number Boolean'.split(' '), function(ctor) {
	exports['is' + ctor] = function(arg) {
		return _toString.call(arg) == '[object ' + ctor + ']';
	};
});

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
 * 		`arg.constructor` and `instanceof` are both not work cross-frame and cross-window
 */
function ctorName(arg) {
	return _toString.call(arg).slice(8, -1);
}