test("$root.lang.type", function(require, specs) {
	var type = require('$root.lang.type'),
		c = type.typename;

	function UserDefinedType() {}

	specs
		.___('type#typename')
		.it.should.equal([
			'Null',
			'Undefined',
			'Number',
			'Number',
			'String',
			'String',
			'Date',
			'RegExp',
			'UserDefinedType'
		], function() {
			return [
				c(null),
				c(undefined),
				c(1),
				c(Number(42)),
				c('hello'),
				c(new String('hello')),
				c(new Date()), c(/a/),
				c(new UserDefinedType())];
		})
		.done();
});