({
    description: 'Arguments Module Extension',
    namespace: $root.lang.arguments,
    imports: {},
    exports: [],
    priority: 1
});

/* varArgTypeMapping must be exist */
if (varArgTypeMapping) {

    var vat = varArgTypeMapping,
        rehtmltag = /^\s*<.*>\s*$/,
        rhex1 = /^[0-9a-f]{3}$/ig,
        rhex2 = /^[0-9a-f]{6}$/ig;

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
        return (arg && arg.nodeType === 1) || arg.jquery;
    };

    vat.jqueryOrElementOrHtml = function(arg) {
        return (arg && arg.nodeType === 1) || arg.jquery || (typeof s == 'string' && s.match(rehtmltag) && s.length >= 3);
    };

    vat.htmlFragment = function(s) {
        return typeof s == 'string' && s.match(rehtmltag) && s.length >= 3;
    };

    vat.idOrClass = function(s) {
        return s && s.length > 0 && (s.charAt(0) === '#' || s.charAt(0) === '.');
    };

    vat.hexColorString = function(s) {
        return rhex2.test(s) || rhex1.test(s);
    };
}
