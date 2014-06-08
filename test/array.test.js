var assert = require('assert'),
	array = require('aztec').array;

describe('array',function(){
	describe('.w',function(){
		it('should return array of string ["hello","world"]',function() {
			assert.deepEqual(["hello","world"], array.w('hello world'));
		});
	})
});