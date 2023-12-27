var assert = require('chai').assert;
var api = require('../../api/api.js');

describe('Set', () => {
	it('Init with duplicate input', () => {
		var s = new api.set(1,3,5,3);
		assert.deepEqual(s.elems(), [1,3,5]);
		assert.deepEqual(s.length, 3);
	});
	it('Remove with duplicate input', () => {
		var s = new api.set(1,2,3,5,7,11);
		
		s.remove(7,3,7);
		
		assert.deepEqual(s.elems(), [1,2,5,11]);
	});
	it('Remove included => not included', () => {
		var s = new api.set(1,2,3,5,7,11);
		assert.isTrue(s.includes(3));
		
		s.remove(7,3,7);
		
		assert.isFalse(s.includes(3));
	});
});
