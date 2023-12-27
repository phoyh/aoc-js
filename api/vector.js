module.exports = {
	add: function(aVector1, aVector2) {
		return aVector1.map((e1,i) => e1 + aVector2[i]);
	},
	sub: function(aVector1, aVector2) {
		return aVector1.map((e1,i) => e1 - aVector2[i]);
	}
};