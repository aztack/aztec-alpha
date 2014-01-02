test("$root.lang.date", function(require, specs) {
	var _date = require('$root.lang.date'),
		_leap = _date.isLeapYear;
	specs
		.___("date#thisYear")
		.it.maybe.anything(2014,function(){
			return _date.thisYear();
		})
		.___("date#thisMonth")
		.it.maybe.anything(1, function(){
			return _date.thisMonth();
		})
		.___("date#isLeapyear")
		.it.should.equal([true,false,false,true],function(){
			return [
				_leap(2012),
				_leap(1999),
				_leap(1900),
				_leap(124)
			];
		})
		.done();
});