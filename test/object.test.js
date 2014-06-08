var assert = require('assert'),
	object = require('aztec').object;

describe('object', function() {
	describe('.keys', function() {
		it('should return keys of ["hello","world"]: [0,1]', function() {
			assert.deepEqual([0, 1], object.keys(['hello', 'world']));
		});
	});
	describe('.values', function() {
		it('should return values of ["hello","world","",0,null,undefined,[]]', function() {
			var a = ["hello","world","",0,null,undefined,[]];
			assert.deepEqual(a, object.values(a));
		})
	});
});