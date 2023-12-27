var api = require('../../api/api.js');
var assert = require('chai').assert;

var inputPos = api.parse('2021/07_ex').split(',');
//large input solutions: 352331 and 99266250

var fnMinCost = fnPosCost => api.math.min(
	api.array.create(Math.max(...inputPos), i => 
		api.math.sum(inputPos.map(p => fnPosCost(i,p)))
	)
);

describe('2021 - day 7', () => {
	it('*', () => {
		var linearCost = fnMinCost((a,b) => Math.abs(a-b));
		
		assert.equal(linearCost, 37);
	});
	it('**', () => {
		var accumulativeCost = fnMinCost((a,b) => Math.abs(a-b) * (Math.abs(a-b) + 1) / 2);

		assert.equal(accumulativeCost, 168);
	});
});
