var api = require('../../api/api.js');
var assert = require('chai').assert;

var [_,input1,input2] = api.parse('2021/17').split('=');
var rx = input1.split(',')[0].split('..').map(Number);
var ry = input2.split('..').map(Number);

var qualified = [];

var getQualifiedMaxY = (vx, vy) => {
	var [posx,posy] = [0,0];
	var maxY = 0;
	while (posx <= rx[1] && posy >= ry[0]) {
		posx += vx;
		posy += vy;
		maxY = Math.max(posy, maxY);
		vx = Math.max(vx - 1, 0);
		vy--;
		if (posx >= rx[0] && posx <= rx[1] && posy >= ry[0] && posy <= ry[1]) {
			return maxY;
		}
	}
};

//downward velocity at posy = 0 will be as initial => don't overshoot on the way down
for (var y = ry[0]; y < -ry[0]; y++) { 
	for (var x = Math.floor(Math.sqrt(rx[0])); x <= rx[1]; x++) {
		var maxY = getQualifiedMaxY(x, y);
		if (maxY !== undefined) qualified.push(maxY);
	}
}

describe('2021 - day 17', () => {
	it('*', () => {
		assert.equal(api.math.max(qualified), 3916);
	});
	it('**', () => {
		assert.equal(qualified.length, 2986);
	});
});
