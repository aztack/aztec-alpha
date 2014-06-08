test("$root.lang.string", function(require, specs) {
	var str = require('$root.lang.string');

	specs
		.___('string#strip')
		.it.should.equal("hello", function() {
			return str.strip("  hello  ");
		})
		.___('string#rstrip')
		.it.should.equal(" hello", function() {
			return str.rstrip(" hello   ");
		})
		.___('string#toInt')
		.it.should.strictEqual(42, function() {
			return str.toInt('42');
		})
		.___('string#toFloat')
		.it.should.equal('3.1415926', function() {
			return str.toFloat('3.1415926');
		})
		.___('string#capitalize')
		.it.should.equal('HelloWorld', function() {
			return str.capitalize('helloWorld');
		})
		.it.should.equal(' !helloWorld', function() {
			return str.capitalize(' !helloWorld');
		})
		.___('string#isBlank')
		.it.should.equal([true, true], function(){
			return [
			        str.isBlank('  '),
			        str.isBlank("\t\n")];
		})
		.done();
});