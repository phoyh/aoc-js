var assert = require('chai').assert;
var api = require('../../api/api.js');

describe('Dict', () => {
	it('Keys sorted by their values, keys retain their type (no forced stringification)', () => {
		var m = new api.dict();
		m.set(1, 10);
		m.set(3, 5);
		m.set(2, 20);
		
		assert.deepEqual(m.keysSortedByValue(), [3,1,2]);
	});
	it('Array key works on array equality', () => {
		var m = new api.dict().set([1,2], 10).set([1,2], 5);
		
		assert.deepEqual(m.keys(), [[1,2]]);
		assert.deepEqual(m.values(), [5]);
	});
	it('Remove also removes key', () => {
		var m = new api.dict().set(4, 10).set(2, 5);
		
		m.remove(4);
		
		assert.deepEqual(m.keys(), [2]);
	});
	it('Stringification', () => {
		var m = new api.dict().set(4, 10).set(2, 5);
		
		assert.deepEqual(m.toString(), '[{key: 4, value: 10}, {key: 2, value: 5}]');
	});
});