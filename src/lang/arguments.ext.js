({
	description: 'Arguments Module Extension',
	namespace: $root.lang.arguments,
	imports: {
		_color: $root.lang.color
	},
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

	vat.jqueryOrElement = function(arg) {
		return (arg && arg.nodeType === 1) || arg instanceof jQuery;
	};

	vat.htmlFragment = function(s) {
		return typeof s == 'string' && s.charAt(0) === '<' && s.charAt(s.length - 1) === '>' && s.length >= 3;
	};

	var rhex1 = /^[0-9a-f]{3}$/ig,
		rhex2 = /^[0-9a-f]{6}$/ig;
	vat.hexString = function(s) {
		return rhex2.text(s) || rhex1.text(s);
	};

	vat.color = function(s) {
		if (!s) return false;
		if (s.charAt(0) == '#') {
			return vat.hextString(s.substr(1));
		} else {
			return !!_color.hexString(s);
		}
	};
}