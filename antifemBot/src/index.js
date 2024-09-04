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
			// webhook request from Telegram - pass it to Grammy
			const app = new BotIndex(
				env.TG_TOKEN,
				env.MAIN_ADMIN_TG_USER_ID,
				env.CHAT_OF_ADMINS_ID,
				env.DESTINATION_CHANNEL_ID,
				env.KV,
				env.APP_DEBUG,
			);

			await app.init();

			return webhookCallback(app.bot, 'cloudflare-mod')(request);
		} else {
			// manually set webhook
			if (parseUrl(request.url).pathname === '/api/setwh') {
				const res = await setWebhook(env);

				return new Response(await res.text());
			}
		}

		return new Response('Not found', { status: 404 });
	},

	async scheduled(event, env, ctx) {
		ctx.waitUntil(setWebhook(env));
	},
};
