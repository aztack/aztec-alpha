test("$root.browser.query", function(require, specs) {
	var query = require('$root.browser.query');
	specs
		.___("query#_querySelectorAll")
		.it.maybe.anything(0, function() {
			document.body.innerHTML = [
			'<div>',
			'<span><a id="a"></a></span>',
			'</div>'
			].join('');
			query._querySelectorAll('div span a');
		})
		.done();
});