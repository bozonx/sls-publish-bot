import { TG_BOT_URL } from './constants.js';

export async function setWebhook(env) {
	const url = `https://api.telegram.org/bot${env.TG_TOKEN}/setWebhook?url=https://${env.WORKER_HOST}${TG_BOT_URL}`;

	return fetch(url);
}
