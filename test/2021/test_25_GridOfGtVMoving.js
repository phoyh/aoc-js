var api = require('../../api/api.js');
var assert = require('chai').assert;

var inputRaw = api.parse('2021/25_ex');

var width = inputRaw[0].length;
var height = inputRaw.length;

var getStepsUntilStop = raw => {
	var g = new api.grid().from2dArray(inputRaw, '.');
	var stepNum = 0;
	do {
		stepNum++;
		var hasMoved = false;
		[['>', [1,0]], ['v', [0,1]]].forEach(([mover, translation]) => {
			g = g.map(([x,y,e]) => {
				var translated = [(x + translation[0]) % width, (y + translation[1]) % height];
				if (e === mover && !g.getElem(...translated)) {
					hasMoved = true;
					return [...translated, e];
				} else {
					return [x,y,e];
				}
			});
		});
	} while (hasMoved)
	return stepNum;
}

describe('2021 - day 25', () => {
	it('*', () => {
		assert.equal(getStepsUntilStop(), 58);
	});
});
