import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { jwt } from 'hono/jwt';
import crypto from 'node:crypto';
import { createJwtToken } from './helpers.js';
import apiTgBot from './apiTgBot.js';
import apiUser from './apiUser.js';
import apiWorkspace from './apiWorkspace.js';
import apiBlog from './apiBlog.js';
import apiInbox from './apiInbox.js';

const app = new Hono().basePath('/api');

app.use(
	'*',
	cors({
		origin: '*',
		// TODO: use it
		// origin: process.env.CORS_ORIGIN,
	}),
);

app.use('/auth/*', (c, next) => {
	// TODO: надо возвращать json
	return jwt({
		secret: c.env.JWT_SECRET,
		// cookie: JWT_COOKIE_NAME,
	})(c, next);
});

app.route('/bot', apiTgBot);
app.route('/auth/users', apiUser);
app.route('/auth/workspaces', apiWorkspace);
app.route('/auth/blogs', apiBlog);
app.route('/auth/inbox', apiInbox);

app.post('/tg-auth-from-web', async (c) => {
	const payload = await c.req.json();

	console.log(111111, payload);

	await createJwtToken(c, payload.id);

	/*
		{
			auth_date: 1724501227
			first_name: "Ivan K"
			hash: "..."
			id: 4...
			photo_url: "https://t.me/i/userpic/320/kHPdhAKMs-CYl6rq35rkIbwJ6PFPmDQDyhTWU9uFM3c.jpg"
			username: "ivan_k_freedom"
		}
	*/

	// TODO: check hash

	// const { hash } = c.req.query();
	//
	// console.log(111, hash);
	//
	// // const payload = JSON.parse(Buffer.from(queryParams.payload, 'base64').toString());
	//
	// const secretKey = crypto.createHash('sha256').update(c.env.TG_TOKEN).digest();
	// const checkHash = crypto.createHmac('sha256', secretKey).update(payload).digest('hex');
	//
	// if (hash !== checkHash) {
	// 	res.status(400).send('Invalid hash');
	// 	return;
	// }
	// const user = payload.user;

	return c.json({ message: 'success' });
});

app.post('/dev-login', async (c) => {
	if (!c.env.DEV_TG_USER_ID) {
		c.status(403);

		return c.json({ message: 'Not allowed in production' });
	}

	await createJwtToken(c, c.env.DEV_TG_USER_ID);

	return c.json({ message: 'success' });
});

export default app;
// app.get('/auth/page', async (c) => {
// 	const payload = c.get('jwtPayload');
//
// 	console.log(1111, payload);
//
// 	return c.json(payload);
// });
