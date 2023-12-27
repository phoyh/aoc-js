var api = require('../../api/api.js');
var assert = require('chai').assert;

var input = api.parse('2021/11').map(l => l.trim().split('').map(e => parseInt(e)));
var energy = new api.grid().from2dArray(input);
var flashNum = 0;
var allFlashIteration = 0;

for (var i = 0; !allFlashIteration; i++) {
	energy = energy.map(([x,y,e]) => [x, y, e + 1]);
	var isDone = false;
	var itFlashNum = 0;
	while (!isDone) {
		isDone = true;
		energy.getPointElems().forEach(([x,y,e]) => {
			if (e > 9) {
				energy.getAdjacentPointElems(x, y, 1, true).forEach(([ax,ay,ae]) => {
					var currentE = energy.getElem(ax,ay);
					if (currentE !== 0) {
						energy.setElem(ax, ay, 1 + currentE);
						isDone = false;
					}
				});
				energy.setElem(x, y, 0);
				itFlashNum++;
			}
		});
	}
	if (i < 100) flashNum += itFlashNum;
	if (itFlashNum === energy.size) allFlashIteration = i + 1;
}

describe('2021 - day 11', () => {
	it('*', () => {
		assert.equal(flashNum, 1652);
	});
	it('**', () => {
		assert.equal(allFlashIteration, 220);
	});
});
