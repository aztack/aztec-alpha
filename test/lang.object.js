test("$root.lang.object", function(require, specs) {
	var obj = require('$root.lang.object'),
		json = {content:{rss:[{lgt:{g:"12.34"}}]}};
	specs
		.___('object#tryget')
		.it.should.equal(["12.34", null], function() {
			return [
		        obj.tryget(json,'content.rss.0.lgt.g'),
		        obj.tryget(json,'content,rss0', null)
			];
		})
		.done();
});