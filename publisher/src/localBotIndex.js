import 'dotenv/config';
import { App } from './App.js';

const app = new App(process.env.TG_TOKEN);

(async () => {
	await app.init();

	app.botStart();
})();
