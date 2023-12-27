var assert = require('chai').assert;
var api = require('../../api/api.js');

describe('Math', () => {
	it('sum', () => {
		assert.equal(api.math.sum([1,2,3,4]), 10);
	});
	it('max also works on strings', () => {
		assert.equal(api.math.max(['dbc','dbd','acf']), 'dbd');
	});
	it('median for odd number of values', () => {
		assert.equal(api.math.med([1,4,2,9,5]), 4);
	});
	it('median for even number of values', () => {
		assert.equal(api.math.med([1,4,2,9]), 3);
	});
	it('average', () => {
		assert.equal(api.math.avg([1,4,2,9]), 4);
	});
	it('average for empty array', () => {
		assert.equal(api.math.avg([]), undefined);
	});
	it('permutations for one element', () => {
		var a = api.math.perm([1]);
		
		assert.deepEqual(a, [[1]]);
	});
	it('permutations for two elements', () => {
		var a = api.math.perm([1,2]);
		
		assert.equal(a.length, 2);
		assert.deepInclude(a, [1, 2]);
		assert.deepInclude(a, [2, 1]);
	});
	it('permutations for four elements', () => {
		var a = api.math.perm([1, 2, 3, 4]);
		
		assert.equal(a.length, 24);
		assert.deepInclude(a, [3,1,4,2]);
	});
});