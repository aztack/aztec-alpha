({
	description: "String Utils",
	namespace: $root.lang.string,
	imports: {
		_type: $root.lang.type
	},
	exports: [
		toInt,
		toFloat,
		capitalize,
		strip,
		isBlank,
		lstrip,
		rstrip,
		chomp,
		chop,
		reverse,
		repeat,
		startWith,
		endWith
	]
});


///exports

/**
 * toInt
 * convert string s into integer. if it's not a string call it's toString method
 * @param  {Any} s
 * @param  {int} radix
 * @return {int}
 */
function toInt(s, radix) {
	if (!_type.isString(s)) {
		s = s.toString();
	}
	return parseInt(s, radix || 10);
}

/**
 * toFloat
 * convert string s into float. if it's not a string call it's toString method
 * @param  {Any} s
 * @param  {int} radix
 * @return {float}
 */
function toFloat(s, radix) {
	if (!_type.isString(s)) {
		s = s.toString();
	}
	return parseFloat(s, radix || 10);
}

function capitalize(s) {
	return s.replace(/^([a-zA-Z])/, function(a, m, i) {
		return m.toUpperCase();
	});
}

function isBlank(s) {
	return !Boolean(s.match(/\S/));
}

function lstrip(s) {
	return s.replace(/^\s+/, '');
}

function rstrip(s) {
	return s.replace(/\s+$/, '');
}

function chomp(s, sep) {
	if (typeof sep !== 'undefined') {
		return s.replace((new RegExp(sep + '$')), '');
	}
	return s.replace(/[\r\n]$/, '');
}

function chop(s) {
	if (typeof s == 'undefined' || isEmpty(s)) {
		return '';
	}
	var a = s.substr(s.length - 1),
		b = s.substr(s.length - 2);
	if (a === '\n' && b === '\r') {
		return a.substring(0, a.length - 2);
	}
	return a.substring(0, a.length - 1);
}

function reverse(s) {
	return s.split('').reverse.join('');
}

function repeat(s, n) {
	if (n <= 0) return '';
	else if (n === 1) return s;
	else if (n === 2) return s + s;
	else if (n > 2) return Array(n + 1).join(s);
}

var _trim = String.prototype.trim,
	strip = _trim ? function(s) {
		return $trim.call(s);
	} : function(s) {
		return s.replace(/^\s+|s+$/g, '');
	};

function startWith(s, prefix) {
	return s.substr(0, prefix.length) == prefix;
}

function endWith(s, suffix) {
	return s.substr(-suffix.length) == suffix;
}