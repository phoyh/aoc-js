var api = require('../../api/api.js');
var assert = require('chai').assert;

var inputRaw = api.parse('2021/19_ex');

var scanners = inputRaw.map(sr => sr.filter((_,i) => i > 0).map(l => l.split(',').map(e => parseInt(e))));

var aPerm = api.math.perm([0,1,2]).map(p => (e => [e[p[0]], e[p[1]], e[p[2]]]));
var trafo = (ti, c) => {
	var permi = ti % 6;
	var res = aPerm[permi](c);
	ti = Math.floor(ti / 6);
	if (ti & 1) res[0] = -res[0];
	if (ti & 2) res[1] = -res[1];
	if (ti & 4) res[2] = -res[2];
	return res;
};

const getBestOffsetForTrafo = (ti,knownBeacons,scanner) => {
	var offsets = new api.dict(0);
	for (var a = 0; a < knownBeacons.length; a++) {
		for (var b = 0; b < scanner.length; b++) {
			offsets.add(api.vector.sub(knownBeacons[a], trafo(i, scanner[b])), 1);
		}
	}
	var offsetHsByTrafo = offsets.keyValues().sort((a,b) => b[1] - a[1]);
	if (offsetHsByTrafo.length > 0) return offsetHsByTrafo[0];
}

beacons = new api.dict();
scanners[0].forEach(b => beacons.set(b, true));
var pos = [[0,0,0]];
var tbd = scanners.map((_,i) => i).filter(i => i > 0);

while (tbd.length > 0) {
	var s = tbd.shift();
	//console.log('looking at ' + s);
	var aBeacons = beacons.keys();
	var trafoOffsetHits = [];
	for (var i = 0; i < 48; i++) {
		var o = getBestOffsetForTrafo(i, aBeacons, scanners[s]);
		if (o) trafoOffsetHits.push([i, ...o]);
	}
	var trafoOffsetHsByHits = trafoOffsetHits.sort((a,b) => b[2] - a[2]);
	if (trafoOffsetHsByHits[0][2] > trafoOffsetHsByHits[1][2]) { // clearly best?
		var hs = trafoOffsetHsByHits[0];
		var bef = beacons.length;
		scanners[s].map(ob => trafo(hs[0],ob))
			.map(e => api.vector.add(e, hs[1]))
			.forEach(b => beacons.set(b, true));
		//console.log('...found new ' + (beacons.length - bef));
		pos.push(hs[1]);
	} else {
		//console.log('...postponing');
		tbd.push(s);
	}
}

describe('2021 - day 19', () => {
	it('*', () => {
		var beaconNum = beacons.keys().length;

		assert.equal(beaconNum, 79);
	});
	it('**', () => {
		var manhattanDistances = pos.flatMap(p1 => pos.map(p2 =>
			api.math.sum(api.vector.sub(p1, p2).map(d => Math.abs(d)))
		));

		assert.equal(Math.max(...manhattanDistances), 3621);
	});
});
