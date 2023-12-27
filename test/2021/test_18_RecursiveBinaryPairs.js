var api = require('../../api/api.js');
var assert = require('chai').assert;

var inputRaw = api.parse('2021/18_ex');

const isLeaf = t => 'val' in t;

var buildTree = (a,p,d) => {
	if (!a.length || a.length === 0) {
		var newNode = {val: a, parent: p};
		return newNode;
	}
	newNode = {parent: p};
	newNode.kid1 = buildTree(a[0], newNode, d+1);
	newNode.kid2 = buildTree(a[1], newNode, d+1);
	return newNode;
};

var fromString = s => {
	return buildTree(eval(s), null, 0);
}

var toString = t => {
	if (isLeaf(t)) return t.val;
	return '[' + toString(t.kid1) + ',' + toString(t.kid2) + ']'; 
}

var add = (ta,tb) => {
	var copyTa = fromString(toString(ta));
	var copyTb = fromString(toString(tb));
	var newNode = {parent: null, kid1: copyTa, kid2: copyTb};
	copyTa.parent = newNode;
	copyTb.parent = newNode;
	return newNode;
}

var magni = t => {
	if (isLeaf(t)) return t.val;
	return magni(t.kid1) * 3 + magni(t.kid2) * 2;
}

const dirLeft = 'kid1';
const dirRight = 'kid2';
const switchDir = dir => (dirLeft === dir) ? dirRight : dirLeft;

var moveUp = (n,val,dir) => {
	if (!n.parent) return; //ignore not transferrable val
	if (n.parent[dir] === n) {
		moveUp(n.parent, val, dir);
	} else {
		if (isLeaf(n.parent[dir])) {
			n.parent[dir].val += val;
		} else {
			moveDown(n.parent[dir], val, switchDir(dir));
		}
	}
}

var moveDown = (n, val, dir) => {
	if (isLeaf(n)) {
		n.val += val;
	} else {
		moveDown(n[dir], val, dir);
	}
}

var findNode = (t,d,fn) => {
	if (fn(t,d)) return t;
	if (t.kid1) {
		var k1 = findNode(t.kid1, d+1, fn);
		if (k1) return k1;
	}
	if (t.kid2) {
		var k2 = findNode(t.kid2, d+1, fn);
		if (k2) return k2;
	}
}

var explode = t => {
	var n = findNode(t, 0, (tn,d) => d >=4 && !isLeaf(tn) && isLeaf(tn.kid1) && isLeaf(tn.kid2));
	if (!n) return false;
	n.val = 0;
	moveUp(n, n.kid1.val, dirLeft);
	moveUp(n, n.kid2.val, dirRight);
	delete n.kid1;
	delete n.kid2;
	return true;
};

var split = t => {
	var n = findNode(t, 0, tn => (isLeaf(tn)) && tn.val >= 10);
	if (!n) return false;
	n.kid1 = {val: Math.floor(n.val / 2), parent: n};
	n.kid2 = {val: Math.ceil(n.val / 2), parent: n};
	delete n.val;
	return true;
}

var reduce = t => {
	while (true) {
		if (!explode(t) && !split(t)) return t;
	}
}

var ts = inputRaw.map(line => fromString(line));

describe('2021 - day 18', () => {
	it('*', () => {
		var sum = magni(ts.reduce((s,t) => reduce(add(s, t))));
		
		assert.equal(sum, 4140);
	});
	it('**', () => {
		var high = api.math.max(ts.flatMap(ta => ts.map(tb => ta !== tb && magni(reduce(add(ta, tb))))));

		assert.equal(high, 3993);
	});
});
