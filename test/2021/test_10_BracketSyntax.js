var api = require('../../api/api.js');
var assert = require('chai').assert;

var input = api.parse('2021/10');

var bracketMap = new api.dict();
var errorCostMap = new api.dict();
[['{}', 1197], ['()', 3], ['[]', 57], ['<>', 25137]].forEach(b => {
	var [o,c] = b[0].split('');
	bracketMap.set(o, c);
	errorCostMap.set(c, b[1]);
});

var errorCostAndCompletion = input.map(line => {
    var stack = [];
    var errorCost = 0;
    for (var i = 0; i < line.length && !errorCost; i++) {
    	var e = line.charAt(i);
        var closeForOpen = bracketMap.get(e);
        if (closeForOpen) {
            stack.push(closeForOpen);
        } else {
            if (e !== stack.pop()) errorCost = errorCostMap.get(e);
        }
    }
    return {errorCost: errorCost, completion: stack.reverse()};
});

describe('2021 - day 10', () => {
	it('*', () => {
		var totalErrorCost = api.math.sum(errorCostAndCompletion.map(o => o.errorCost));
		
		assert.equal(totalErrorCost, 288291);
	});
	it('**', () => {
		var medianCompletionCost = api.math.med(errorCostAndCompletion.filter(o => !o.errorCost).map(o =>
			o.completion.reduce((sum,e) => sum * 5 + (1 + ')]}>'.indexOf(e)), 0)
		));

	    assert.equal(medianCompletionCost, 820045242);
	});
});
