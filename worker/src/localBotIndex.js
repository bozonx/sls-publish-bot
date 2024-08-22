import 'dotenv/config';
import { BotIndex } from './BotIndex.js';

const app = new BotIndex(process.env.TG_TOKEN, process.env.WEB_APP_URL, process.env.API_BASE_URL);

(async () => {
	await app.init();

	app.botStart();
})();
