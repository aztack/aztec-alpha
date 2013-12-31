({
	description: "console",
	namespace: $root.browser.console,
	imports: {
		_type: $root.lang.type,
		_str: $root.lang.string,
		_$: $root,
		$: jQuery
	},
	exports: [
	]
});

//vars
var console, con;
if (typeof window.console !== 'undefined') {
	return window.console;
}

//helper

//impl
console = {};
con = $('<div>');


//exports