import 'dotenv/config';
import { BotIndex } from './BotIndex.js';

const testData = {
	scheduled: JSON.stringify([
		{
			id: 'omltnQ',
			preview: true,
			template: 'default',
			text: 'sdfsdf',
			author: 'Айван Кей',
			tags: ['sd', 'fwer'],
			date: '2024-09-03',
			hour: 21,
			publisher: 'eeee',
		},
		{
			id: 'omwerltnQ',
			preview: true,
			template: 'default',
			text: 'sdslkdjflsdfsdf',
			author: 'Айван Кей',
			tags: ['sd', 'fwsdfder'],
			date: '2024-09-02',
			hour: 12,
			publisher: 'eeee',
		},
	]),
};

function KVStub(initialData = {}) {
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

const app = new BotIndex(
	process.env.TG_TOKEN,
	process.env.MAIN_ADMIN_TG_USER_ID,
	process.env.CHAT_OF_ADMINS_ID,
	process.env.DESTINATION_CHANNEL_ID,
	KVStub(testData),
);

(async () => {
	await app.init();

	app.botStart();
})();
