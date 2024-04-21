export default class LocalStorage {
	protected localStorage: Storage;
	constructor(localStorage: Storage) {
		this.localStorage = localStorage;
	}
}
