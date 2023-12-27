var fnEquals = function(array1, array2) {
	if (array1.length === undefined) return array1 === array2;
	if (array1.length !== array2.length) return false;
	for (var i = 0; i < array1.length; i++) {
		if (array1[i] !== array2[i]) return false;
	}
	return true;
};

module.exports = {
	create: function(length, defaultValueOrFunctionWithPositionInput) {
		var isFun = typeof defaultValueOrFunctionWithPositionInput === 'function';
		return ' '.repeat(length).split('').map((_,i) => isFun
			? defaultValueOrFunctionWithPositionInput(i)
			: defaultValueOrFunctionWithPositionInput 
		);
	},
	equals: function(array1, array2) {
		return fnEquals(array1, array2);
	},
	cullDuplicates: function(array) {
		var result = [];
		for (var i = 0; i < array.length; i++) {
			var isDuplicate = false;
			for (var j = 0; j < i && !isDuplicate; j++) {
				isDuplicate = fnEquals(array[i], array[j]);
			}
			if (!isDuplicate) result.push(array[i]);
		}
		return result;
	},
	last: function(array) {
		return array[array.length - 1];
	}
};