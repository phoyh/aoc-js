var dict = require('./dict.js');
var heap = require('./heap.js');
var phset = require('./set.js');
var array = require('./array.js');

class graph {
	constructor() {
		this._nodeAdj = new dict(() => new dict());
	}
	add(fromNode, toNode, cost) {
		this._nodeAdj.change(fromNode, s => (s.set(toNode, cost), s));
		return this;
	}
	addSym(node1, node2, cost) {
		this.add(node1, node2, cost);
		this.add(node2, node1, cost);
		return this;
	}
	toEdges() {
		return this._nodeAdj.keys().flatMap(from => {
			var adj = this._nodeAdj.get(from);
			return adj.keys().map(to => [from, to, adj.get(to)]);
		});
	}
	toString() {
		return this.toEdges().map(([from,to,c]) => from.join(',') + ' - ' + to.join(',') + ' = ' + c).join('\n');
	}
	getCost(fromNode, toNode) {
		var pathWithCost = this.getPathWithCost(fromNode, toNode);
		return pathWithCost.length > 0 ? array.last(pathWithCost)[0] : Number.POSITIVE_INFINITY;
	}
	getPathWithCost(fromNode, toNode) {
		var sToNode = String(toNode); // internal dictionary lookup is based on string anyway + arrays can be directly used as node names
		var cs = new dict(Number.MAX_VALUE).set(fromNode, 0);
		var pred = new dict();
		var visited = new phset();
		var tbd = new heap((a,b) => a[0] - b[0]);
		tbd.add([0, fromNode]);
		while (tbd.length > 0) {
			var [c,current] = tbd.shift();
			if (String(current) === sToNode) {
				var node = current;
				var pathWithCost = [];
				while (node !== undefined) {
					pathWithCost.push([cs.get(node), node]);
					node = pred.get(node);
				}
				return pathWithCost.reverse();
			}
			if (visited.includes(current)) continue;
			visited.add(current);
			this._nodeAdj.get(current).forEach((next,cost) => {
				if (visited.includes(next)) return;
				var possibleCost = cost + c;
				if (possibleCost < cs.get(next)) {
					cs.set(next, possibleCost);
					pred.set(next, current);
					tbd.add([possibleCost, next]);
				}
			});
		}
		return [];
	}
}

module.exports = graph;