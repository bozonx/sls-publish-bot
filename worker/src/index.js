import parseUrl from 'parse-url';
import { PrismaD1 } from '@prisma/adapter-d1';
import { webhookCallback } from 'grammy';
import apiIndex from './apiIndex.js';
import { BotIndex } from './BotIndex.js';
import { setWebhook } from './helpers.js';
import { handleScheduled } from './tgManageBot/indexShedullerPublisher.js';
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
				env.WEB_APP_URL,
				env.API_CALL_LOCAL_CODE,
				env.KV,
				new PrismaD1(env.DB),
				env.APP_DEBUG,
				env.TEST_MODE,
			);

			await app.init();

			return webhookCallback(app.bot, 'cloudflare-mod')(request);
		} else {
			// else api request
			return apiIndex.fetch(request, env, ctx);
		}
	},

	async scheduled(event, env, ctx) {
		switch (event.cron) {
			case '*/10 * * * *':
				// check is there something to publish
				await ctx.waitUntil(
					handleScheduled(env.TG_TOKEN, env.TEST_MODE, new PrismaD1(env.DB)),
				);

				break;
			case '0 */22 * * *':
				await ctx.waitUntil(setWebhook(env));

				break;
		}
	},
};
