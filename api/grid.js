var array = require('./array.js');

class grid {
	constructor(defaultValueOrGeneratorIfUndefined) {
		this.setDefault(defaultValueOrGeneratorIfUndefined);
		this._points = {};
		this._maxX = null;
		this._maxY = null;
		this._minX = null;
		this._minY = null;
		this._width = 0;
		this._height = 0;
	}
	setDefault(defaultValueOrGeneratorIfUndefined) {
		this._defaultGenerator = typeof defaultValueOrGeneratorIfUndefined === 'function' ? defaultValueOrGeneratorIfUndefined : null;
		this._defaultValue = !this._defaultGenerator ? defaultValueOrGeneratorIfUndefined : null;
		return this;
	}
	setElem(x, y, element) {
		this._points[[x,y].join()] = element;
		if (this._maxX === null) {
			this._maxX = x;
			this._maxY = y;
			this._minX = x;
			this._minY = y;
		} else {
			this._maxX = Math.max(this._maxX, x);
			this._maxY = Math.max(this._maxY, y);
			this._minX = Math.min(this._minX, x);
			this._minY = Math.min(this._minY, y);
		}
		this._width = this._maxX - this._minX + 1;
		this._height = this._maxY - this._minY + 1;
	}
	getElem(x, y) {
		var result = this._points[[x,y].join()];
		if (result !== undefined) return result;
		if (this._defaultGenerator) return this._defaultGenerator(x,y);
		return this._defaultValue;
	}
	getPointElem(x, y) {
		return [x, y, this.getElem(x, y)];
	}
	getPointElems() {
		return this.getPoints().map(([x,y]) => [x,y,this.getElem(x,y)]);
	}
	getPoints() {
		return Object.keys(this._points).map(s => s.split(',').map(e => parseInt(e)));
	}
	get minX() {
		return this._minX;
	}
	get maxX() {
		return this._maxX;
	}
	get minY() {
		return this._minY;
	}
	get maxY() {
		return this._maxY;
	}
	get width() {
		return this._width;
	}
	get height() {
		return this._height;
	}
	get size() {
		return this.width * this.height;
	}
	// isChebyshev = true, means with diagonals (otherwise it is Manhattan)
	getAdjacentPointElems(x, y, distance, isChebyshev, isSelfIncluded) {
		var result = [];
		for (var dy = -distance; dy <= distance; dy++) {
			var startOffset = distance - (isChebyshev ? 0 : Math.abs(dy));
			for (var dx = -startOffset; dx <= startOffset; dx++) {
				if (isSelfIncluded || !(dx === 0 && dy === 0)) {
					var pointElem = this.getPointElem(x + dx, y + dy);
					if (pointElem[2] !== undefined) result.push(pointElem);
				}
			}
		}
		return result;
	}
	
	// IMPORTERS
	from2dArray(array, valueToBeIgnored) {
		for (var y = 0; y < array.length; y++) {
			for (var x = 0; x < array[y].length; x++) {
				if (valueToBeIgnored !== array[y][x]) this.setElem(x, y, array[y][x]);
			}
		}
		return this;
	}
	fromPointElems(pointElems) {
		pointElems.forEach(([x,y,e]) => this.setElem(x, y, e));
		return this;
	}

	// EXPORTERS
	to2dArray(defaultElem) {
		var result = array.create(this._height).map(() => array.create(this._width, defaultElem));
		this.getPoints().forEach(([x,y]) => result[y-this._minY][x-this._minX] = this.getElem(x, y));
		return result;
	}
	toString(defaultElem, separator) {
		return this.to2dArray(defaultElem)
			.map(line => line.join(separator !== undefined ? separator : '')).join('\n');
	}
	
	// LAMBDA
	
	//example: map(([x,y,e]) => [y,x,e+1])
	//example: map(false)
	map(fnFromPointElemOrConstant) {
		var fun = typeof fnFromPointElemOrConstant === 'function' ? fnFromPointElemOrConstant
			: (([x,y,_]) => [x,y,fnFromPointElemOrConstant]);
		return new grid().fromPointElems(this.getPoints().map(([x,y]) => fun([x, y, this.getElem(x, y)])));
	}
}

module.exports = grid;