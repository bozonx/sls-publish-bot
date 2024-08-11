import { webhookCallback } from 'grammy';
import parseUrl from 'parse-url';
import { App } from './App.js';
import { TG_BOT_URL, SET_WEBHOOK_URL } from './constants.js';

export default {
	async fetch(request, env, ctx) {
		if (request.method === 'GET') {
			if (parseUrl(request.url).pathname === SET_WEBHOOK_URL) {
				const res = await setWebhook(env);
				const jsonBody = await res.json();

				return new Response(JSON.stringify(jsonBody));
			}
		} else if (request.method === 'POST') {
			if (parseUrl(request.url).pathname === TG_BOT_URL) {
				const app = new App(env.TG_TOKEN);

				await app.init();

				// const cb = webhookCallback(app.bot, 'cloudflare');

				// await cb({ request, respondWith: request.fetcher.respondWith });
				return webhookCallback(app.bot, 'cloudflare-mod')(request);
			}
		}

		return new Response('OK');
	},

	async scheduled(event, env, ctx) {
		ctx.waitUntil(setWebhook(env));
	},
};

async function setWebhook(env) {
	const url = `https://api.telegram.org/bot${env.TG_TOKEN}/setWebhook?url=https://${env.WORKER_HOST}${TG_BOT_URL}`;

	return fetch(url);
}
