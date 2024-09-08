import 'dotenv/config';
import { BotIndex } from './BotIndex.js';
import { APP_INITIAL_CONFIG } from './constants.js';
import { handleScheduled } from './indexShedullerPublisher.js';
import { KVStub } from './io/KVstub.js';

const testData = {
	config: JSON.stringify(APP_INITIAL_CONFIG),
};

(async () => {
	const KV = KVStub(testData);
	const app = new BotIndex(
		process.env.TG_TOKEN,
		process.env.MAIN_ADMIN_TG_USER_ID,
		process.env.CHAT_OF_ADMINS_ID,
		process.env.DESTINATION_CHANNEL_ID,
		process.env.PUBLICATION_TIME_ZONE,
		process.env.PUBLISHING_MINUS_MINUTES,
		process.env.SESSION_STATE_TTL_DAYS,
		KV,
		// do not need to specify any prisma adapter for sqlite
		undefined,
		process.env.APP_DEBUG,
	);

	await app.init();

	// test scheduled
	// await handleScheduled(
	// 	process.env.TG_TOKEN,
	// 	process.env.DESTINATION_CHANNEL_ID,
	// 	process.env.PUBLISHING_MINUS_MINUTES,
	// 	KV,
	// 	undefined,
	// );

	app.botStart();
})();
