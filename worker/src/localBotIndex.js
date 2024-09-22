import 'dotenv/config';
import { BotIndex } from './BotIndex.js';
import { KVStub } from './io/KVstub.js';

(async () => {
	const KV = KVStub();
	const app = new BotIndex(
		process.env.TG_TOKEN,
		process.env.WEB_APP_URL,
		KV,
		// do not need to specify any prisma adapter for sqlite
		undefined,
		process.env.BOT_SESSION_TTL_DAYS,
		true,
		true,
	);

	await app.init();

	app.botStart();
})();
