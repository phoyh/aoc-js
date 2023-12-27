class heap {
	constructor(fnSorter) {
		this.values = [];
		this._fnSorter = fnSorter;
	}
	add(value) {
		this.values.push(value);
		let index = this.values.length - 1;
		const current = this.values[index];

		while (index > 0) {
			let parentIndex = Math.floor((index - 1) / 2);
			let parent = this.values[parentIndex];
			if (this._fnSorter(parent, current) > 0) {
				this.values[parentIndex] = current;
				this.values[index] = parent;
				index = parentIndex;
			} else break;
		}
		return this;
	}
	shift() {
		const max = this.values[0];
		const end = this.values.pop();
		if (this.values.length === 0) return end;
		this.values[0] = end;

		let index = 0;
		const length = this.values.length;
		const current = this.values[0];
		while (true) {
			let leftChildIndex = 2 * index + 1;
			let rightChildIndex = 2 * index + 2;
			let leftChild, rightChild;
			let swap = null;

			if (leftChildIndex < length) {
				leftChild = this.values[leftChildIndex];
				if (this._fnSorter(leftChild, current) < 0) swap = leftChildIndex;
			}
			if (rightChildIndex < length) {
				rightChild = this.values[rightChildIndex];
				if (
					(swap === null && this._fnSorter(rightChild, current) < 0) ||
					(swap !== null && this._fnSorter(rightChild, leftChild) < 0)
				)
					swap = rightChildIndex;
			}

			if (swap === null) break;
			this.values[index] = this.values[swap];
			this.values[swap] = current;
			index = swap;
		}
		return max;
	}
	toArray() {
		return [...this.values].sort((a,b) => this._fnSorter(a,b)); //heap only contains sorted hierarchy
	}
	get length() {
		return this.values.length;
	}
}

module.exports = heap;