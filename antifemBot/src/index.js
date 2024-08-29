import parseUrl from 'parse-url';
import { webhookCallback } from 'grammy';
import { BotIndex } from './BotIndex.js';
import { setWebhook } from './helpers.js';
import { TG_BOT_URL } from './constants.js';

export default {
	async fetch(request, env, ctx) {
		if (
			request.method === 'POST' &&
			parseUrl(request.url).pathname === TG_BOT_URL
		) {
			const app = new BotIndex(env.TG_TOKEN, env.MAIN_ADMIN_TG_USER_ID, env.KV);

			await app.init();

			return webhookCallback(app.bot, 'cloudflare-mod')(request);
		} else {
			if (parseUrl(request.url).pathname === '/setwh') {
				const res = await setWebhook(c.env);
				const jsonBody = await res.json();

				return new Response(jsonBody);
			}
		}

		return new Response({
			body: 'Not found',
			status: 404,
		});
	},

	async scheduled(event, env, ctx) {
		ctx.waitUntil(setWebhook(env));
	},
};
