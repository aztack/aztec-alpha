test("$root.browser.query", function(require, specs) {
	var query = require('$root.browser.query');
	specs
		.___("query#_querySelectorAll")
		.it.maybe.anything(0, function() {
			document.body.innerHTML = [
			'<div id="ad">',
			'<div class="klass">',
			'<span><a id="ae"></a></span>',
			'</div>',
			'</div>'
			].join('');
			//console.log(query._querySelectorAll('div span a'));
			//console.log(query._querySelectorAll('div#ad'));
			//console.log(query._querySelectorAll('.klass a#ae'));
			//console.log(query._querySelectorAll('[id*=a]'));
			console.log(query._querySelectorAll('div:nth(1)'));
		})
		.done();
});