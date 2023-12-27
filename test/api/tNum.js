var assert = require('chai').assert;
var api = require('../../api/api.js');

describe('Number', () => {
	it('hex string to binary string', () => {
		assert.equal(api.num.hexToBin('EE00D40C823060'), '11101110000000001101010000001100100000100011000001100000');
	});
});