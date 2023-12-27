var api = require('../../api/api.js');
var assert = require('chai').assert;

var inputRaw = api.parse('2021/24');

var segmentParameters = [];
for (var i = 0; i < inputRaw.length; i += inputRaw.length / 14) {
	segmentParameters.push([4,5,15].map(ii => parseInt(api.array.last(inputRaw[i + ii].split(' ')))));
}

var rules = [];
var pushcs = [];
var pushidxs = [];
segmentParameters.forEach(([a,b,c],i) => {
	if (a === 1) {
		pushcs.push(c);
		pushidxs.push(i);
	} else {
		rules.push([pushidxs.pop(), i, pushcs.pop() + b]);
	}
});

var getPushPullPossibilities = delta => {
	var pairs = [];
	for (var pu = Math.max(1,1-delta); pu <= Math.min(9,9-delta); pu++) {
		pairs.push([pu, pu + delta]);
	}
	return pairs;
}

var pairCombinations = [[]];
rules.flatMap(([pushidx,pullidx,delta]) => {
	pairCombinations = getPushPullPossibilities(delta).flatMap(pair => pairCombinations.map(prior =>
		[...prior, [pushidx,pullidx, pair]]
	));
});

var candidates = pairCombinations.map(s => {
	var comps = [];
	s.forEach(([pushidx,pullidx,[valpush,valpull]]) => {
		comps[pushidx] = valpush;
		comps[pullidx] = valpull;
	})
	return comps.join('');
});

solutions = candidates; // yes, everything was exact

/*
var checkCode = sCode => {
	var code = sCode.split('').map(e => parseInt(e));
	var vars = {w: 0, x: 0, y: 0, z: 0};
	var codeParts = [...code];
	var ops = {
		mul: (x,y) => vars[x] = vars[x] * evalParam(y),  
		add: (x,y) => vars[x] = vars[x] + evalParam(y),  
		div: (x,y) => vars[x] = Math.floor(vars[x] / evalParam(y)),  
		mod: (x,y) => vars[x] = vars[x] % evalParam(y),
		eql: (x,y) => vars[x] = (vars[x] === evalParam(y) ? 1 : 0),
		inp: (x) => vars[x] = codeParts.shift()
	};
	var evalParam = p => {
		var varValue = vars[p];
		if (varValue !== undefined) return varValue;
		return parseInt(p);
	}
	inputRaw.forEach(ins => {
		var [op,...params] = ins.split(' ');
		ops[op](params[0], params[1]);
	});
	return vars['z'] === 0;
};
*/
//var solutions = candidates.filter(s => checkCode(s)).map(e => parseInt(e));
solutions.sort(api.sort.desc);

describe('2021 - day 24', () => {
	it('*', () => {
		assert.equal(solutions[0], 91297395919993);
	});
	it('**', () => {
		assert.equal(api.array.last(solutions), 71131151917891);
	});
});
