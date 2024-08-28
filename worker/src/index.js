import parseUrl from 'parse-url';
import { webhookCallback } from 'grammy';
import apiIndex from './apiIndex.js';
import { BotIndex } from './BotIndex.js';
import { setWebhook } from './helpers.js';
import { TG_BOT_URL } from './constants.js';

export default {
	async fetch(request, env, ctx) {
		if (request.method === 'POST' && parseUrl(request.url).pathname === TG_BOT_URL) {
			const app = new BotIndex(env.TG_TOKEN, env.WEB_APP_URL, env.API_CALL_LOCAL_CODE, env.DB);

			await app.init();

			return webhookCallback(app.bot, 'cloudflare-mod')(request);
		} else {
			return apiIndex.fetch(request, env, ctx);
		}
	},

	async scheduled(event, env, ctx) {
		ctx.waitUntil(setWebhook(env));
	},
};
