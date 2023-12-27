module.exports = {
	hexToBin: function(stringOfHexesToBeConvertedIntoStringOfBinary) {
		var p = stringOfHexesToBeConvertedIntoStringOfBinary;
		var htb = h => {
			var result = parseInt(h, 16).toString(2);
			return '0'.repeat(4 - result.length) + result;
		}
		return p.split('').flatMap(char => htb(char).split('')).join('');		
	}
};