var api = require('../../api/api.js');
var assert = require('chai').assert;

var inputRaw = api.parse('2021/22_ex');

var orders = inputRaw.map(line => {
	var isOn = line.split(' ')[0] === 'on';
	var parts = line.split('=').filter((_,i) => i > 0).map(p => p.split(',')[0].split('..').map(pp => parseInt(pp)));
	return [isOn, parts];
});

var intersect = (r1,r2) => {
	var int = r1.map((r1d,i) => [Math.max(r1d[0],r2[i][0]),Math.min(r1d[1],r2[i][1])]);
	if (int.find(d => d[0] > d[1])) return undefined;
	return int;
};

var minus = (r1,r2) => {
	var int = intersect(r1,r2);
	if (!int) return [r1];
	var [ix,iy,iz] = int;
	var [rx,ry,rz] = r1;
	return [
		[rx, ry, [rz[0], iz[0] - 1]], // z-below
		[rx, ry, [iz[1] + 1,rz[1]]], // z-above
		[rx, [ry[0], iy[0] - 1], iz], // rest y-below
		[rx, [iy[1] + 1,ry[1]], iz], // rest y-above
		[[rx[0], ix[0] - 1], iy, iz], // rest x-above
		[[ix[1] + 1,rx[1]], iy, iz], // rest x-below
	].filter(r => api.math.min(r.map(([from,to]) => to - from)) >= 0);
};

var getOnCubes = o => {
	var onRegions = [];
	o.forEach(([isOn,reg]) => {
		if (isOn) {
			var newr = [reg];
			onRegions.forEach(onr => newr = newr.flatMap(nr => minus(nr,onr)));
			onRegions.push(...newr);
		} else {
			onRegions = onRegions.flatMap(onr => minus(onr,reg));
		}
	});
	var regionSizes = onRegions.map(r => api.math.prod(r.map(d => d[1] - d[0] + 1)));
	return api.math.sum(regionSizes);
};

describe('2021 - day 22', () => {
	it('*', () => {
		var interest = [[-50,50],[-50,50],[-50,50]];
		var ordersOnInterest = orders.map(([isOn,reg]) => [isOn,intersect(reg,interest)]).filter(e => e[1]);
		
		assert.equal(getOnCubes(ordersOnInterest), 474140);
	});
	it('**', () => {
		assert.equal(getOnCubes(orders), 1414930379825432);
	});
});
