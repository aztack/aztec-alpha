test("$root.lang.number", function(require, specs) {
	var _num = require('$root.lang.number');

	specs
		.___("number#max")
		.it.should.equal([Infinity, 42], function() {
			var x = [1,34,23,-2,Infinity],
				y = [1,34,23,42], r1, r2;
			r1 = _num.max(x);
			r2 = _num.max(y);
			return [r1, r2];
		})
		.done();
});