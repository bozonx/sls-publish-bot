import parseUrl from 'parse-url';
import { webhookCallback } from 'grammy';
import { BotIndex } from './BotIndex.js';
import { PrismaD1 } from '@prisma/adapter-d1';
import { handleScheduled } from './indexShedullerPublisher.js';
import { setWebhook } from './helpers/helpers.js';
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
				env.TEST_MODE ? env.MAIN_ADMIN_TG_USER_ID : env.CHAT_OF_ADMINS_ID,
				env.TEST_MODE ? env.MAIN_ADMIN_TG_USER_ID : env.DESTINATION_CHANNEL_ID,
				env.DESTINATION_CHANNEL_NAME,
				env.PUBLICATION_TIME_ZONE,
				env.PUBLISHING_MINUS_MINUTES,
				env.SESSION_STATE_TTL_DAYS,
				env.KV,
				new PrismaD1(env.DB),
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
		switch (event.cron) {
			case '*/10 * * * *':
				// check is there something to publish
				await ctx.waitUntil(
					handleScheduled(
						env.TG_TOKEN,
						env.TEST_MODE
							? env.MAIN_ADMIN_TG_USER_ID
							: env.DESTINATION_CHANNEL_ID,
						env.PUBLISHING_MINUS_MINUTES,
						env.KV,
						new PrismaD1(env.DB),
					),
				);

				break;
			case '0 */22 * * *':
				await ctx.waitUntil(setWebhook(env));

				break;
		}
	},
};
