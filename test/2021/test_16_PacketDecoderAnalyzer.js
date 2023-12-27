var api = require('../../api/api.js');
var assert = require('chai').assert;

var inputRaw = api.parse('2021/16');

var fnPeek = (s, charNum) => [s.substring(0, charNum), s.substring(charNum)];
var fnPeekNum = (s, charNum) => [parseInt(s.substring(0, charNum), 2), s.substring(charNum)];

var fnDecodeLiteral = s => {
	var res = '';
	var v = '';
	while (v.charAt(0) !== '0') {
		[v,s] = fnPeek(s, 5);
		res = res + v.substring(1);
	}
	return [parseInt(res, 2), s];
};

var fnDecodePackage0 = s => {
	var [bitLen,s] = fnPeekNum(s, 15);
	var restTargetSize = s.length - bitLen;
	var cont = [];
	var rest = '';
	while (restTargetSize < s.length) {
		var [subCont,s] = decode(s);
		cont.push(subCont);
	}
	return [cont, s];
};

var fnDecodePackage1 = s => {
	var [len,s] = fnPeekNum(s, 11);
	var cont = [];
	while (len-- > 0) {
		var [subCont,s] = decode(s);
		cont.push(subCont);
	}
	return [cont, s];
}

var decode = p => {
	if (p.length < 4) return []; // check for trailing bits due to hex input (max 4)
	var [vers,p] = fnPeekNum(p, 3);
	var [type,p] = fnPeekNum(p, 3);
	var [content, rest] = type === 4 ? fnDecodeLiteral(p.substring(0))
		: (p.charAt(0) === '0' ? fnDecodePackage0(p.substring(1)) : fnDecodePackage1(p.substring(1)));
	return [[type, vers, content], rest];
};

var aFnEval = [
	api.math.sum,
	api.math.prod,
	api.math.min,
	api.math.max,
	v => v,
	a => a[0] > a[1] ? 1 : 0,
	a => a[0] < a[1] ? 1 : 0,
	a => a[0] === a[1] ? 1 : 0
];

var binary = api.num.hexToBin(inputRaw);

var [ast,_] = decode(binary);

describe('2021 - day 16', () => {
	it('*', () => {
		var fnVersSum = a => a[1] + (a[2].length ? a[2].reduce((s,aa) => s + fnVersSum(aa), 0): 0);

		assert.equal(fnVersSum(ast), 967);
	});
	it('**', () => {
		var fnEval = a => aFnEval[a[0]](a[2].length ? a[2].map(aa => fnEval(aa)) : a[2]);

		assert.equal(fnEval(ast), 12883091136209);
	});
});
