var api = require('../../api/api.js');
var assert = require('chai').assert;

var inputRawMin = api.parse('2021/23_ex');

var aLetter = ['A', 'B', 'C', 'D'];
var aDest = [3, 5, 7, 9];
var aCost = [1, 10, 100, 1000];
var aCorridor = [1, 2, 4, 6, 8, 10, 11];

var toString = (buckets,corridor,raw) => {
	return buckets.map(b => b.join(',')).join(';') + '|' + corridor.map(c => c.join(',')).join(';');
	// following is inefficient but good for debugging
	var g = new api.grid();
	raw.forEach((line,y) => line.split('').forEach((ge,x) => g.setElem(x,y, (ge === '#' ? ge : ' '))));
	corridor.forEach(([p,e]) => g.setElem(p,1,aLetter[e]));
	buckets.forEach((b,bi) => b.forEach((be,bh) => g.setElem(aDest[bi], raw.length - 2 - bh, aLetter[be])));
	return g.toString();
};

var getDistance = (bucketIndex,bucketWithElement,xCorridor,height) => {
	return Math.abs(aDest[bucketIndex] - xCorridor) + (height - 1 - bucketWithElement.length - 1);
};

var isPathClear = (corridor, fromX, toX, isIntervalClosed) => {
	var adj = isIntervalClosed ? 0 : 1
	for (let x = Math.min(fromX,toX) + adj; x <= Math.max(fromX, toX) - adj; x++) {
		if (corridor.find(([ccx,_]) => ccx == x)) return false;
	}
	return true;
};

var moveOffCorridor = ([currentCost, buckets, corridorCandidates, sHistory, costHistory], sState, raw) => {
	var tbd = [];
	corridorCandidates.forEach(([cx,val],ci) => {
		let dx = aDest[val];
		if (!isPathClear(corridorCandidates, cx, dx, false)) return;
		//wrong elements in destination?
		if (buckets[val].find(v => v !== val) !== undefined) return;
		let news1 = buckets.map(b => [...b]);
		let news2 = corridorCandidates.filter((_,i) => i !== ci).map(e => e);
		news1[val].push(val);
		let cost = getDistance(val,news1[val],cx,raw.length) * aCost[val];
		tbd.push([cost + currentCost, news1, news2, [...sHistory, sState], [...costHistory, cost]]);
	});
	return tbd;
}

var moveIntoCorridor = ([currentCost, buckets, corridor, sHistory, costHistory], sState, raw) => {
	var tbd = [];
	buckets.forEach((b,bi) => {
		if (b.length === 0) return;
		let upperVal = api.array.last(b);
		if (upperVal === bi && b.find(bb => bb !== upperVal) === undefined) return; //already fine below
		let bx = aDest[bi];
		aCorridor.forEach(cx => {
			if (!isPathClear(corridor, cx, bx, true)) return;
			let news1 = buckets.map(b => [...b]);
			let news2 = [[cx, upperVal], ...corridor];
			let cost = getDistance(bi,news1[bi],cx,raw.length) * aCost[upperVal];
			news1[bi].pop();
			tbd.push([cost + currentCost, news1, news2, [...sHistory, sState], [...costHistory, cost]]);
		});
	});
	return tbd;
};

var fnEval = (startBuckets,startCorridor,targetBuckets,raw) => {
	var bucketSize = targetBuckets[0].length;
	var sTargetState = toString(targetBuckets,[],raw);
	var tbd = new api.heap((a,b) => a[0] < b[0] ? -1 : 1);
	tbd.add([0, startBuckets, startCorridor, [], []]);
	var seen = new api.set();
	while (tbd.length > 0) {
		var s = tbd.shift();
		var ss = toString(s[1], s[2],raw);
		if (seen.includes(ss)) continue;
		seen.add(ss);
		if (sTargetState === ss) return [s[0],[...s[3], ss],[...s[4], 0]];
		moveOffCorridor(s, ss, raw).forEach(n => tbd.add(n));
		moveIntoCorridor(s, ss, raw).forEach(n => tbd.add(n));
	}
}

var getMinCost = raw => {
	var grid = raw.map((line,y) => line.split(''));
	
	var aStartBuckets = api.array.create(4,() => []);
	grid.filter((_,i) => i < grid.length - 1 && i > 1).reverse().forEach(line => {
		aDest.forEach((val,di) => {
			var valIndex = aLetter.indexOf(line[val]);
			if (valIndex !== -1) aStartBuckets[di].push(valIndex);
		});
	});
	
	var aStartCorridor = [];
	grid[1].forEach((ce,ci) => {
		if (aLetter.includes(ce)) aStartCorridor.push([ci, aLetter.indexOf(ce)]);
	});
	
	var aTargetBuckets = api.array.create(4, () => []);
	grid.filter((_,i) => i < grid.length - 1 && i > 1).forEach(_ => aTargetBuckets.forEach((tb,tbi) => tb.push(tbi)));
	
	var [cost,history,histCosts] = fnEval(aStartBuckets, aStartCorridor, aTargetBuckets, raw);
	
	//history.forEach((h,i) => console.log(h + '\n' + histCosts[i]));
	//console.log(cost);
	return cost;
}

describe('2021 - day 23', () => {
	it('*', () => {
		assert.equal(getMinCost(inputRawMin), 77);
	});
	it('**', () => {
		let enhInputRawMin = [...inputRawMin];
		enhInputRawMin.splice(3,0, '  #B#A#C#D#');

		assert.equal(getMinCost(enhInputRawMin), 160);
	});
});
