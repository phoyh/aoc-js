var assert = require('chai').assert;
var api = require('../../api/api.js');

var fnSorter = ([prioA,_],[prioB,__]) => prioB - prioA;

describe('Heap', () => {
	it('Add values, shift', () => {
		var h = new api.heap(fnSorter);
		h.add([4, 'a']);
		h.add([82, 'aa']);
		h.add([5, 'b']);
		h.add([3, 'c']);
		
		var s = h.shift();
		
		assert.deepEqual(s, [82,'aa']);
		assert.deepEqual(h.toArray(), [[5, 'b'], [4, 'a'], [3, 'c']]);
		assert.deepEqual(h.length, 3);
	});
	it('Shift on one element heap => heap empty', () => {
		var h = new api.heap(fnSorter);
		h.add([4, 'a']);
		
		var s = h.shift();
		
		assert.deepEqual(h.toArray(), []);
	});
	it('Add many literal values, sorted array returned', () => {
		var h = new api.heap(api.sort.desc);
		var input = [8,2,7,4,10,0,4,8,5];
		input.forEach(i => h.add(i));

		assert.deepEqual(h.toArray(), input.sort(api.sort.desc));
	});
});