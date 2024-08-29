import 'dotenv/config';
import { BotIndex } from './BotIndex.js';
import { KVStub } from './kvStub.js';

const app = new BotIndex(
	process.env.TG_TOKEN,
	process.env.MAIN_ADMIN_TG_USER_ID,
	KVStub(),
);

(async () => {
	await app.init();

	app.botStart();
})();