export function KVStub(initialData = {}) {
	const storage = initialData;

	return {
		get: async (key) => {
			return storage[key];
		},
		put: async (key, value) => {
			storage[key] = value;
		},
	};
}
