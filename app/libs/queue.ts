//this is probbaly overkill, but I want a real queue

export interface QueueInterface<T> {
	size(): number;
	enqueue(datum: T): void;
	dequeue(): T | undefined;
}
export class Queue<T> implements QueueInterface<T> {
	_oldestIndex = 1;
	_newestIndex = 1;
	_storage: { [index: number]: T } = {};

	size() {
		return this._newestIndex - this._oldestIndex;
	}

	enqueue(datum: T) {
		this._storage[this._newestIndex] = datum;
		this._newestIndex++;
	}

	dequeue() {
		let oldestIndex = this._oldestIndex,
			newestIndex = this._newestIndex,
			deletedData;

		if (oldestIndex !== newestIndex) {
			deletedData = this._storage[oldestIndex];
			delete this._storage[oldestIndex];
			this._oldestIndex++;
			return deletedData;
		}
	}
}
