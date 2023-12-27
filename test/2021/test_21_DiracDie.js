var api = require('../../api/api.js');
var assert = require('chai').assert;

var inputRaw = api.parse('2021/21');
var startPos = inputRaw.map(line => parseInt(api.array.last(line.split(' '))));

var fnStar1 = winScore => {
	var pos = [...startPos];
	var score = [0,0];
	var numberRolled = 0;
	var rollDie = () => (numberRolled++ % 100 + 1);
	while (true) {
		for (var p = 0; p < 2; p++) {
			pos[p] += rollDie() + rollDie() + rollDie();
			while (pos[p] > 10) pos[p] -= 10;
			score[p] += pos[p];
			if (score[p] >= winScore) {
				return numberRolled * score[1-p];
			}
		}
	}	
};

var fnStar2 = (winScore) => {
	var dieSides = [1,2,3];
	var rolls = dieSides.flatMap(a => dieSides.flatMap(b => dieSides.map(c => a + b + c)));
	var lookup = new api.dict();
	var play = (aPos, aScore, activeP) => {
		var statusKey = [aPos, aScore, activeP];
		var l = lookup.get(statusKey);
		if (l) return l;
		if (aScore[0] >= winScore) return [1,0];
		if (aScore[1] >= winScore) return [0,1];
		var res = [0,0];
		rolls.forEach(roll => {
			var newPos = [...aPos];
			newPos[activeP] += roll;
			while (newPos[activeP] > 10) newPos[activeP] -= 10;
			var newScore = [...aScore];
			newScore[activeP] += newPos[activeP];
			res = api.vector.add(res, play(newPos, newScore, 1 - activeP));
		});
		lookup.set(statusKey, res);
		return res;
	};
	var aUniverseWins = play(startPos, [0,0], 0);
	return Math.max(...aUniverseWins);
};

describe('2021 - day 21', () => {
	it('*', () => {
		//assert.equal(fnStar1(1000), 711480);
		assert.equal(fnStar1(100), 6750);
	});
	it('**', () => {
		//assert.equal(fnStar2(21), 265845890886828);
		assert.equal(fnStar2(6), 22704);
	});
});
