module.exports = (filePath) => {
	var inputRaw = require('fs').readFileSync('./input/' + filePath + '.txt', 'utf8');
	var result = inputRaw.split('\n\n').map(part => part.split('\n').filter(l => l))
		.map(partArray => partArray.length === 1 ? partArray[0] : partArray);
	return result.length === 1 ? result[0] : result;
};