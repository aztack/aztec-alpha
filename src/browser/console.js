({
	description: "console",
	version: '0.0.1',
	namespace: $root.browser.console,
	imports: {
		_type: $root.lang.type,
		_str: $root.lang.string,
		_$: $root,
		$: jQuery
	},
	exports: [
		open,
		close,
		log,
		error,
		table
	]
});

//vars
var console = exports,
	con;
//if (typeof window.console !== 'undefined') {
//	return window.console;
//}

//helper

//impl
con = $('<div>');

console.open = function() {

};

console.close = function() {

};

console.log = function() {};
console.error = function() {};
console.table = function() {};

//exports
return console;