var api = require('../../api/api.js');
var assert = require('chai').assert;

var inputRaw = api.parse('2021/15_ex_min').map(line => line.split('').map(s => parseInt(s)));
// ex solutions are 40 and 315

var riskOrig = new api.grid(Number.MAX_VALUE).from2dArray(inputRaw);

var getMinRisk = function(risk) {
	var [maxX, maxY] = [risk.width - 1, risk.height - 1];
	var result = new api.grid(Number.MAX_VALUE);
	result.setElem(maxX, maxY, risk.getElem(maxX, maxY));
	
	found = 1;
	while (found) { // iterative in order to allow paths to left / up being seriously considered
		found = 0;
		for (var y = maxY; y >= 0; y--) {
			for (var x = maxX; x >= 0; x--) {
				var bestNeighbor = api.math.min(result.getAdjacentPointElems(x, y, 1, false).map(([x,y,e]) => e));
				var newVal = risk.getElem(x, y) + bestNeighbor;
				if (newVal < result.getElem(x,y)) {
					result.setElem(x, y, newVal);
					found++;
				}
			}
		}
		//console.log(found);
		//console.log(result.getElem(0,0) - risk.getElem(0,0));
	}
	return result.getElem(0,0) - risk.getElem(0,0);
};

var getMinRiskByDijkstra = function(risk) {
	var graph = new api.graph();
	risk.getPointElems().forEach(([x,y,e]) => risk.getAdjacentPointElems(x, y, 1, false).forEach(([xx,yy,_]) => {
		if (xx >= 0 && xx < risk.width && yy >= 0 && yy < risk.height) graph.add([xx,yy], [x,y], e)
	}));
	return graph.getCost([0,0], [risk.width - 1, risk.height - 1]);
};
var risk = new api.grid(Number.MAX_VALUE);
var wrap = num => {
	var res = num;
	while (res > 9) res -= 9;
	return res;
}
for (var rx = 0; rx < 5; rx++) {
	for (var ry = 0; ry < 5; ry++) {
		riskOrig.getPointElems().forEach(([x,y,e],i) => {
			risk.setElem(x + rx * riskOrig.width, y + ry * riskOrig.height, wrap(e + rx + ry))
		});
	}
}

describe('2021 - day 15', () => {
	it('*', () => {
		assert.equal(getMinRisk(riskOrig), 24);
	});
	it('**', () => {
		assert.equal(getMinRisk(risk), 158);
	});
	it('* Dijkstra', () => {
		assert.equal(getMinRiskByDijkstra(riskOrig), 24);
	});
	it('** Dijkstra', () => {
		assert.equal(getMinRiskByDijkstra(risk), 158);
	});
});
