var assert = require('chai').assert;
var api = require('../../api/api.js');

describe('Array', () => {
	it('Create with initial values', () => {
		var a = api.array.create(4, 'el');
		
		assert.deepEqual(a, ['el', 'el', 'el', 'el']);
	});
	it('Level 1 deep equals, positive case', () => {
		assert.isTrue(api.array.equals([3,5,2],[3,5,2]));
	});
	it('Level 1 deep equals, negative case', () => {
		assert.isFalse(api.array.equals([3,0,2],[3,null,2]));
	});
	it('Cull duplicates incl. subarrays', () => {
		assert.deepEqual(api.array.cullDuplicates([3,0,[3,1],[2,2],[3,1],3]),[3,0,[3,1],[2,2]]);
	});
});