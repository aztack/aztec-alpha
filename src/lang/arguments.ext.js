({
	description: 'Arguments Module Extension',
	namespace: $root.lang.arguments,
	exports: [],
	priority: 1
});

/* varArgTypeMapping must be exist */
if (varArgTypeMapping) {

	var vat = varArgTypeMapping;

	vat.gt0 = function(n) {
		return _type.isNumber(n) && n > 0;
	};

	vat.lt0 = function(n) {
		return _type.isNumber(n) && n < 0;
	};

	vat.egt0 = function(n) {
		return _type.isNumber(n) && n >= 0;
	};

	vat.elt0 = function(n) {
		return _type.isNumber(n) && n <= 0;
	};

	vat.pattern = vat['string|regexp'] = vat['regexp|string'] = function(s) {
		return _type.isString(s) || _type.isRegExp(s);
	};

	vat.jquery = function(jq) {
		return jq instanceof jQuery;
	};

	vat.element = function(ele) {
		return ele && ele.nodeType === 1;
	};

	vat.htmlFragment = function (s) {
		return typeof s == 'string' && s.charAt(0) === '<' && s.charAt( s.length - 1 ) === '>' && s.length >= 3;
	};
}