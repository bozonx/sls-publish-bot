import { Hono } from 'hono';
import { setWebhook } from './helpers.js';
import { getBase, createBase } from './crudLogic.js';
import { API_CALL_LOCAL_CODE } from './constants.js';

const app = new Hono();

// manually set tg webhook
app.get('/setwh', async (c) => {
	const res = await setWebhook(c.env);
	const jsonBody = await res.json();

	return c.json(jsonBody);
});

app.get('/users/by-tg-id/:tgid', async (c) => {
	const { code } = c.req.query();

	if (code !== API_CALL_LOCAL_CODE) {
		c.status(403);

		return c.json({ message: 'Secured' });
	}

	const res = await getBase(c, 'user', { tgUserId: c.req.param().tgid });

	if ('id' in res) return c.json({ id: res.id });
	else return c.json(res);
});

app.post('/users', async (c) => {
	const { code } = c.req.query();

	if (code !== API_CALL_LOCAL_CODE) {
		c.status(403);

		return c.json({ message: 'Secured' });
	}

	return c.json(await createBase(c, 'user', await c.req.json()));
});

app.post('/inbox', async (c) => {
	const { code } = c.req.query();

	if (code !== API_CALL_LOCAL_CODE) {
		c.status(403);

		return c.json({ message: 'Secured' });
	}

	return c.json(await createBase(c, 'inbox', await c.req.json()));
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
