var api = require('../../api/api.js');
var assert = require('chai').assert;

var input = api.parse('2021/14');
var poly = input[0];
var rules = input[1].map(line => line.split(' -> '));
var pairCounts = new api.dict(0);
for (var i = 0; i < poly.length; i++) {
	pairCounts.add(poly.substring(i, i+2), 1);
}

var pairCountsAfter10;

for (var i = 0; i < 40; i++) {
	var newPairCounts = new api.dict(0);
	pairCounts.keys().forEach(p => {
		var rule = rules.find(r => r[0] === p);
		(rule ? [p.charAt(0) + rule[1], rule[1] + p.charAt(1)] : [p])
			.forEach(followUpP => newPairCounts.add(followUpP, pairCounts.get(p)))
	});
	pairCounts = newPairCounts;
	if (i === 9) pairCountsAfter10 = pairCounts;
}

var getOccurrenceMaxMinusMin = function(pc) {
	var occ = new api.dict(0);
	pc.forEach((k,v) => occ.add(k.charAt(0), v));
	var vals = occ.values().sort(api.sort.asc);
	return api.array.last(vals) - vals[0];
}

describe('2021 - day 14', () => {
	it('*', () => {
		assert.equal(getOccurrenceMaxMinusMin(pairCountsAfter10), 2584);
	});
	it('**', () => {
		assert.equal(getOccurrenceMaxMinusMin(pairCounts), 3816397135460);
	});
});
