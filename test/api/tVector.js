var assert = require('chai').assert;
var api = require('../../api/api.js');

describe('Vector', () => {
	it('add', () => {
		assert.deepEqual(api.vector.add([1,2],[4,6]), [5,8]);
	});
	it('subtract', () => {
		assert.deepEqual(api.vector.sub([1,2,3,4],[4,6,2,8]), [-3,-4,1,-4]);
	});
});