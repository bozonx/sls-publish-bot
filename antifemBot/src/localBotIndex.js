import 'dotenv/config';
import { BotIndex } from './BotIndex.js';
import { APP_INITIAL_CONFIG } from './constants.js';
import { handleScheduled } from './indexShedullerPublisher.js';

const testData = {
	config: JSON.stringify(APP_INITIAL_CONFIG),
	// scheduled: JSON.stringify([
	// 	{
	// 		id: 'omltnQ',
	// 		preview: true,
	// 		template: 'default',
	// 		text: 'sdfsdf',
	// 		author: 'Айван Кей',
	// 		tags: ['sd', 'fwer'],
	// 		date: '2024-09-03',
	// 		time: '09:55',
	// 		publisher: 'eeee',
	// 	},
	// 	{
	// 		id: 'omwerltnQ',
	// 		preview: true,
	// 		template: 'default',
	// 		text: 'sdslkdjflsdfsdf',
	// 		author: 'Айван Кей',
	// 		tags: ['sd', 'fwsdfder'],
	// 		date: '2024-09-03',
	// 		time: '10:00',
	// 		publisher: 'eeee',
	// 	},
	// ]),
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

(async () => {
	const KV = KVStub(testData);
	const app = new BotIndex(
		process.env.TG_TOKEN,
		process.env.MAIN_ADMIN_TG_USER_ID,
		process.env.CHAT_OF_ADMINS_ID,
		process.env.DESTINATION_CHANNEL_ID,
		KV,
	);

	await app.init();

	// test scheduled
	// await handleScheduled(
	// 	process.env.TG_TOKEN,
	// 	process.env.DESTINATION_CHANNEL_ID,
	// 	KV,
	// );

	app.botStart();
})();
