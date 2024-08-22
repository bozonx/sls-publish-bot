import { Hono } from 'hono';
import { setWebhook } from './helpers.js';

const app = new Hono();

// manually set tg webhook
app.get('/setwh', async (c) => {
	const res = await setWebhook(c.env);
	const jsonBody = await res.json();

	return c.json(jsonBody);
});

export default app;

// async fetch(request, env, ctx) {
// 	if (request.method === 'GET') {
// 		if (parseUrl(request.url).pathname === SET_WEBHOOK_URL) {
// 		}
// 	} else if (request.method === 'POST') {
// 		if (parseUrl(request.url).pathname === TG_BOT_URL) {
// 			const app = new App(env.TG_TOKEN);
//
// 			await app.init();
//
// 			// const cb = webhookCallback(app.bot, 'cloudflare');
//
// 			// await cb({ request, respondWith: request.fetcher.respondWith });
// 			return webhookCallback(app.bot, 'cloudflare-mod')(request);
// 		}
// 	}
//
// 	return new Response('OK');
// },
