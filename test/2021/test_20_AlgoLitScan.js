var api = require('../../api/api.js');
var assert = require('chai').assert;

var inputRaw = api.parse('2021/20_ex');

var algo = inputRaw[0].split('').map(e => e === '#' ? 1 : 0);
var oddIterDefault = parseInt(algo[0]);
var originalGrid = new api.grid();
inputRaw[1].forEach((line,y) => line.split('').forEach((e,x) => originalGrid.setElem(x, y, e === '#' ? 1 : 0)));

var findLitAfter = iterNum => {
	var g = originalGrid.map(a => a);
	g.setDefault(0);
	for (var iter = 0; iter < iterNum; iter++) {
		var g2 = new api.grid((iter % 2 === 0) ? oddIterDefault : 0);
		for (var x = g.minX - 1; x <= g.maxX + 1; x++) {
			for (var y = g.minY - 1; y <= g.maxY + 1; y++) {
				var algoIndex = parseInt(g.getAdjacentPointElems(x, y, 1, true, true).map(([x,y,e]) => e).join(''), 2);
				g2.setElem(x, y, algo[algoIndex]);
			}	
		}
		g = g2;
	}
	//console.log(g.toString());
	return g.getPointElems().filter(([x,y,e]) => e === 1).length;
}


describe('2021 - day 20', () => {
	it('*', () => {
		assert.equal(findLitAfter(2), 35);
	});
	it('**', () => {
		//original question for 50: minInput => 3351
		assert.equal(findLitAfter(6), 103);
	});
});
