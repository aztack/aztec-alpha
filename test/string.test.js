var assert = require('assert'),
	string = require('aztec').string;

describe('string', function() {
	describe('.format', function() {
		it('should return string "hello world!"', function() {
			assert.equal('hello world!', string.format('{1} {0}!','world','hello'));
		});

		it('should return string "2014-06-13"', function(){
			assert.equal('2014-06-13', string.format('{year}-{month,2,0}-{date,2,0}', {year:2014, month:6, date:13}));
		});
	});
});