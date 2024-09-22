import 'dotenv/config';
import { serve } from '@hono/node-server';
import apiIndex from './api/apiIndex.js';
import { BotIndex } from './BotIndex.js';
import { KVStub } from './tgManageBot/io/KVstub.js';

(async () => {
	const KV = KVStub();
	const app = new BotIndex(
		process.env.TG_TOKEN,
		process.env.WEB_APP_URL,
		KV,
		// do not need to specify any prisma adapter for sqlite
		undefined,
		process.env.BOT_SESSION_TTL_DAYS,
		true,
		true,
	);

	await app.init();

	app.botStart();

	serve({
		fetch: (request, env, c) => {
			return apiIndex.fetch(
				request,
				{
					...env,
					CORS_ORIGIN: process.env.CORS_ORIGIN,
					AUTH_MAX_AGE_DAYS: process.env.AUTH_MAX_AGE_DAYS,
					JWT_SECRET: process.env.JWT_SECRET,
					DEV_TG_USER_ID: process.env.DEV_TG_USER_ID,
				},
				c,
			);
		},
		port: 8787,
		env: {},
	});
})();
