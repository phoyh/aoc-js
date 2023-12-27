module.exports = {
	asc: function(a,b) {
		return a < b ? -1 : 1;
	},
	desc: function(a,b) {
		return a < b ? 1 : -1;
	}
};