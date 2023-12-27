const fnPerm = array => (array.length === 1) ? [array]
	: array.flatMap((a,i) => fnPerm(array.slice(0,i).concat(array.slice(i+1))).map(p => p.concat(a)));

module.exports = {
	avg: function(array) {
		if (array.length) return array.reduce((sum,e) => sum + e, 0) / array.length;
	},
	max: function(array) {
		if (!array || !array.length) return undefined;
		return array.reduce((m,e) => (e > m || m === undefined) ? e : m);
	},
	med: function(array) {
		var aSorted = [...array].sort((a,b) => a < b ? -1 : 1);
		if (aSorted.length % 2 === 0) {
			return (aSorted[aSorted.length / 2] + aSorted[(aSorted.length - 2) / 2]) / 2;
		} else {
			return aSorted[( aSorted.length - 1) / 2];
		}
	},
	min: function(array) {
		if (!array || !array.length) return undefined;
		return array.reduce((m,e) => (e < m || m === undefined) ? e : m);
	},
	perm: function(array) {
		return fnPerm(array);
	},
	prod: function(array) {
		return array.reduce((prod,e) => prod * e, 1);
	},
	sum: function(array) {
		return array.reduce((sum,e) => sum + e, 0);
	}
};