var api = require('../api/api.js');
var fs = require('fs');
const { EOL } = require('os');

var style = 'style="font-family: monospace"';

var result = '<html><head><title>API Doc</title></head><body>';

Object.keys(api).forEach(name => {
	var fileContent = fs.readFileSync('api/' + name + '.js', 'utf8');
	var startIndexes = [fileContent.indexOf('class '),fileContent.indexOf('module.exports ')];
	var isClass = startIndexes[0] !== -1;
	fileContent = fileContent.substring(
		startIndexes.reduce((hs,i) => i === -1 ? hs : Math.min(hs, i), Number.MAX_SAFE_INTEGER),
		fileContent.length
	);
	var singleFunApi = fileContent.split(EOL).find(line => line.includes('module.exports ') && line.includes('('));
	var funs = null;
	if (singleFunApi) {
		funs = [singleFunApi.substring(singleFunApi.indexOf('('), singleFunApi.lastIndexOf(')') + 1)];
	} else {
		funs = fileContent.split(EOL).filter(line => line.charAt(0) === '\t' && line.substring(0, 2) !== '\t\t'
			&& line.includes('(') && !line.includes('//'))
			.map(line => line.replace(': function', '').replace(' {', '').replace('\t', ''))
			.map(fun => !fun.includes('get ') ? fun : fun.split('get ')[1].split('(')[0])
			.sort((a,b) => (a < b) ? -1 : 1)
	}
	if (funs) {
		result += '<p ' + style + '>' + name.toUpperCase() + (!isClass ? ' <i>(static)</i>' : '')
			+ '</p><ul>' + funs.map(fun => {
				var parts = fun.split('(');
				var rr = '<li ' + style + '><b>';
				return '<li ' + style + '><b>' + (parts.length > 1 ? parts.join('</b>(') : parts[0] + '</b>');
			}).join('') + '</ul>';
	}
});

result += '</body></html>';

fs.writeFileSync('tools/apiDoc.html', result);
