var dict = require('./dict.js');

class phset {
	constructor(...startElems) {
		this._dict = new dict();
		this.add(...startElems);
	}
	add(...newElems) {
		newElems.forEach(e => this._dict.set(e, true));
		return this;
	}
	remove(...exElems) {
		exElems.forEach(e => this._dict.remove(e));
		return this;
	}
	includes(elem) {
		return !!this._dict.get(elem);
	}
	elems() {
		return [...this._dict.keys()];
	}
	get length() {
		return this._dict.length;
	}
}

module.exports = phset;