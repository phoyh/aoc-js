var assert = require('chai').assert;
var api = require('../../api/api.js');

describe('Grid', () => {
	it('Init from matrix', () => {
		var aa = [[1,2,3,4],[2,4,6,8]];
		var g = new api.grid().from2dArray(aa);
		
		assert.deepEqual(g.to2dArray(), aa);
	});
	it('Init empty, set element, set element in negative area => check sparse matrix and bounding box', () => {
		var g = new api.grid();

		g.setElem(2,1,'hi');
		g.setElem(-1,-2,'ho');
		
		assert.deepEqual(g.to2dArray('-'), [['ho','-','-','-'],['-','-','-','-'],['-','-','-','-'],['-','-','-','hi']]);
		assert.equal(g.minX, -1);
		assert.equal(g.maxX, 2);
		assert.equal(g.minY, -2);
		assert.equal(g.maxY, 1);
		assert.equal(g.width, 4);
		assert.equal(g.height, 4);
		assert.equal(g.size, 16);
	});
	it('Init empty, set element, get element', () => {
		var g = new api.grid();
		
		g.setElem(2,1,'hi');
		
		assert.equal(g.getElem(2,1), 'hi');
		assert.equal(g.getElem(2,2), undefined);
	});
	it('Mapping that transposes and increments elements', () => {
		var g = new api.grid().from2dArray([[1,2,3],[4,5,6]]);
		
		var newG = g.map(([x,y,e]) => [y, x, e + 1]);
		
		assert.deepEqual(newG.to2dArray(), [[2,5],[3,6],[4,7]]);
	});
	it('Mapping that replaces with constant', () => {
		var g = new api.grid().from2dArray([[1,2,3],[4,5,6]]);
		
		var newG = g.map(58);
		
		assert.deepEqual(newG.to2dArray(), [[58,58,58],[58,58,58]]);
	});
	it('Chebyshev adjacency (w/ diagonals), incl. exclusion out of grid point elements', () => {
		var g = new api.grid().from2dArray([[1,2,3],[4,5,6]]);
		
		var pointElems = g.getAdjacentPointElems(1, 0, 1, true);
		
		assert.deepEqual(pointElems, [[0,0,1],[2,0,3],[0,1,4],[1,1,5],[2,1,6]]);
	});
	it('Manhattan adjacency (w/o diagonals), incl. exclusion out of grid point elements', () => {
		var g = new api.grid().from2dArray([[1,2,3],[4,5,6]]);
		
		var pointElems = g.getAdjacentPointElems(1, 0, 1, false);
		
		assert.deepEqual(pointElems, [[0,0,1],[2,0,3],[1,1,5]]);
	});
	it('Default value', () => {
		var g = new api.grid(578).from2dArray([[1,2,3],[4,5,6]]);
		
		assert.equal(g.getElem(2,2), 578);
	});
	it('Default generator for x and y', () => {
		var g = new api.grid((x,y) => x * y).from2dArray([[1,2,3],[4,5,6]]);
		
		assert.equal(g.getElem(2,2), 4);
	});
	it('Default generator set, is used', () => {
		var g = new api.grid(3).from2dArray([[1,2,3],[4,5,6]]);
		
		g.setDefault((x,y) => x * y);
		
		assert.equal(g.getElem(2,2), 4);
	});
});