var assert = require('chai').assert;
var api = require('../../api/api.js');

//   /--14-F-9--\                      
//  A--\   2     \                    
//  |   9  |      \                    
//  7    --C       E                   
//  |  10  |      /                   
//  B-/   11     /                   
//   \--15-D-6--/                      
var getSymGraph = () => {
	var g = new api.graph();
	g.addSym('A', 'B', 7);
	g.addSym('A', 'C', 9);
	g.addSym('A', 'F', 14);
	g.addSym('B', 'C', 10);
	g.addSym('B', 'D', 15);
	g.addSym('C', 'D', 11);
	g.addSym('C', 'F', 2);
	g.addSym('E', 'F', 9);
	g.addSym('D', 'E', 6);
	return g;
}

//   /--14-F-<9-\                      
//  A<-\   2     \                    
//  |   9  |      \                    
//  7    --C       E                   
//  |  10  |      /                   
//  B>/   11     /                   
//   \--15-D-6>-/                      
var getAsymGraph = () => {
	var g = new api.graph();
	g.addSym('A', 'B', 7);
	g.add('C', 'A', 9);
	g.add('F', 'A', 14);
	g.add('B', 'C', 10);
	g.addSym('B', 'D', 15);
	g.addSym('C', 'D', 11);
	g.addSym('C', 'F', 2);
	g.add('E', 'F', 9);
	g.add('D', 'E', 6);
	return g;
}

describe('Graph', () => {
	it('Distance cost on symmetric graph', () => {
		var g = getSymGraph();
		
		assert.equal(g.getCost('A', 'A'), 0);
		assert.equal(g.getCost('A', 'B'), 7);
		assert.equal(g.getCost('A', 'E'), 20);
		assert.equal(g.getCost('A', 'XXX'), Number.POSITIVE_INFINITY);
	});
	it('Distance cost on asymmetric graph', () => {
		var g = getAsymGraph();
		
		assert.equal(g.getCost('A', 'A'), 0);
		assert.equal(g.getCost('A', 'B'), 7);
		assert.equal(g.getCost('A', 'E'), 28);
		assert.equal(g.getCost('A', 'F'), 19);
	});
	it('Graph nodes are typed, Dijkstra converts internally to strings (for dictionary lookup)', () => {
		var g = new api.graph();
		g.add('A', 8888, 7);
		g.addSym(['C'], 'A', 9);
		
		assert.equal(g.getCost(['C'], 8888), 16);
		assert.equal(g.getCost('A', ['C']), 9);
		assert.deepEqual(g.toEdges(), [['A', 8888, 7], ['A', ['C'], 9], [['C'], 'A', 9]]);
	});
	it('Shortest path on asymmetric graph', () => {
		var g = getAsymGraph();
		
		assert.deepEqual(g.getPathWithCost('A', 'A'), [[0, 'A']]);
		assert.deepEqual(g.getPathWithCost('A', 'B'), [[0, 'A'], [7, 'B']]);
		assert.deepEqual(g.getPathWithCost('A', 'E'), [[0, 'A'], [7, 'B'], [22, 'D'], [28, 'E']]);
		assert.deepEqual(g.getPathWithCost('A', 'F'), [[0, 'A'], [7, 'B'], [17, 'C'], [19, 'F']]);
	});
});
