var api = require('../../api/api.js');
var assert = require('chai').assert;

var input = api.parse('2021/12_ex');

var edgesSym = input.map(line => line.split('-'));

var adj = new api.dict(() => new api.set());
edgesSym.concat(edgesSym.map(edge => [...edge].reverse())).forEach(([k,v]) => adj.change(k, s => (s.add(v), s)));

var isSmallAndOnPrefix = (cave, prefix) => (cave.toUpperCase() !== cave) && prefix.includes(cave);
var findPaths = (prefix, isJokerUsed) => (current = api.array.last(prefix),
	current === 'end' ? [prefix] :
		adj.get(current).elems()
		.filter(node => node !== 'start' && !(isJokerUsed && isSmallAndOnPrefix(node, prefix)))
		.flatMap(node => findPaths(prefix.concat(node), isJokerUsed || isSmallAndOnPrefix(node, prefix)))
);

describe('2021 - day 12', () => {
	it('*', () => {
		var pathsSmallOnlyOnce = findPaths(['start'], true);
		
		assert.equal(pathsSmallOnlyOnce.length, 226);
	});
	it('**', () => {
		var pathsAtMostOneSmallTwice = findPaths(['start'], false);
		
		assert.equal(pathsAtMostOneSmallTwice.length, 3509);
	});
});
