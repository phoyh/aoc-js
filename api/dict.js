var fnKeyToSTypedKey = key => (typeof key) + key;

class phdict {
	constructor(defaultValueOrGeneratorIfUndefined) {
		this._defaultGenerator = typeof defaultValueOrGeneratorIfUndefined === 'function' ? defaultValueOrGeneratorIfUndefined : null;
		this._defaultValue = !this._defaultGenerator ? defaultValueOrGeneratorIfUndefined : null;
		this._sKeyToKeyValue = {};
	}
	get(key) {
		var kv = this._sKeyToKeyValue[fnKeyToSTypedKey(key)];
		return kv ? kv.value : (this._defaultGenerator ? this._defaultGenerator() : this._defaultValue);
	}
	set(key, value) {
		this._sKeyToKeyValue[fnKeyToSTypedKey(key)] = {key: key, value: value};
		return this;
	}
	remove(key) {
		delete this._sKeyToKeyValue[fnKeyToSTypedKey(key)];
	}
	add(key, valueToBeAddedToExEntry) {
		this.set(key, this.get(key) + valueToBeAddedToExEntry);
		return this;
	}
	change(key, functionOldValueToNewValue) {
		this.set(key, functionOldValueToNewValue(this.get(key)));
		return this;
	}
	keys() {
		return Object.values(this._sKeyToKeyValue).map(kv => kv.key);
	}
	keysSortedByValue() {
		return Object.values(this._sKeyToKeyValue)
			.sort((kv1,kv2) => kv1.value < kv2.value ? -1 : 1)
			.map(kv => kv.key);
	}
	values() {
		return Object.values(this._sKeyToKeyValue).map(kv => kv.value);
	}
	keyValues() {
		return Object.values(this._sKeyToKeyValue).map(kv => [kv.key, kv.value]);
	}
	toString() {
		return '[' + Object.values(this._sKeyToKeyValue).map(kv => '{key: ' + kv.key + ', value: ' + kv.value + '}').join(', ') + ']';
	}
	get length() {
		return this.keys().length;
	}
	
	// LAMBDAS
	forEach(fnOnKeyValue) {
		Object.values(this._sKeyToKeyValue).forEach(kv => fnOnKeyValue(kv.key, kv.value));
	}
}

module.exports = phdict;