import 'dotenv/config';
import { BotIndex } from './BotIndex.js';
import { KVStub } from './io/KVstub.js';

(async () => {
	const KV = KVStub();
	const app = new BotIndex(
		process.env.TG_TOKEN,
		process.env.WEB_APP_URL,
		process.env.API_CALL_LOCAL_CODE,
		KV,
		// do not need to specify any prisma adapter for sqlite
		undefined,
		process.env.APP_DEBUG,
		process.env.TEST_MODE,
	);

	await app.init();

	app.botStart();
})();
