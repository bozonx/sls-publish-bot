export const KVStub = () => {
	const storage = new Map();

	return {
		put: (key, value) => {
			return new Promise((resolve) => {
				storage.set(key, value);
				resolve();
			});
		},

		get: (key) => {
			return new Promise((resolve) => {
				const value = storage.get(key);
				resolve(value);
			});
		},
	};
};
