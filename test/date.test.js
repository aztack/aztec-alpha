var assert = require('assert'),
	date = require('aztec').date,
	TimeSpan = date.TimeSpan;

describe('date', function() {
	describe('.TimeSpan#minutes', function() {
		var ts = new TimeSpan(TimeSpan.DAY + 61);
		it('should equal "0Y 1D 00:01:01"', function() {
			assert.equal(ts.toString(), "0Y 1D 00:01:01");
		});
	});
	describe('.TimeSpan.ToObject', function() {
		var obj = TimeSpan.ToObject(TimeSpan.DAY + 61);
		it('should equal 1', function() {
			assert.equal(obj.day, 1);
		});
	});
});