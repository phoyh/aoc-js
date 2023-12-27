var api = require('../../api/api.js');
var assert = require('chai').assert;

var input = api.parse('2021/13');
var aPoints = input[0].map(line => line.split(',').map(e => parseInt(e)));
var aInstruction = input[1].map(line => line.substring('fold along '.length));

var paper = new api.grid().fromPointElems(aPoints.map(([x,y]) => [x, y, '*']));

var fold = (instr) => {
	var param = parseInt(instr.substring(2));
	var dim = instr.includes('x') ? 0 : 1;
	return paper.map(pe => ( pe[dim] = Math.min(pe[dim], param * 2 - pe[dim] ), pe));
};

describe('2021 - day 13', () => {
	it('*', () => {
		var paperAfterFirst = fold(aInstruction[0]);

		assert.equal(paperAfterFirst.getPoints().length, 621);
	});
	it('**', () => {
		aInstruction.forEach(i => paper = fold(i));
		var code = paper.toString(' ', '').split('\n');
		assert.deepEqual(code, [
			'*  * *  * *  *   **  **   **    ** ****',
			'*  * * *  *  *    * *  * *  *    *    *',
			'**** **   *  *    * *    *  *    *   * ',
			'*  * * *  *  *    * * ** ****    *  *  ',
			'*  * * *  *  * *  * *  * *  * *  * *   ',
			'*  * *  *  **   **   *** *  *  **  ****',
		]);
	});
});
