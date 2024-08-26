import { Hono } from 'hono';
import { cors } from 'hono/cors';
import apiTgBot from './apiTgBot.js';
import apiUser from './apiUser.js';
import apiWorkspace from './apiWorkspace.js';
import apiBlog from './apiBlog.js';
import apiInbox from './apiInbox.js';
import { authMiddleware } from './authMiddleware.js';
import { createJwtToken } from './helpers.js';

const app = new Hono().basePath('/api');

app.use('/auth/*', (c, next) =>
	cors({
		origin: c.env.CORS_ORIGIN,
		credentials: true,
	})(c, next),
);
// all other are allowed without credentials
app.use('/', (c, next) =>
	cors({
		origin: '*',
	})(c, next),
);

app.use('/auth/*', authMiddleware());

app.route('/bot', apiTgBot);
app.route('/auth/users', apiUser);
app.route('/auth/workspaces', apiWorkspace);
app.route('/auth/blogs', apiBlog);
app.route('/auth/inbox', apiInbox);

app.post('/tg-auth-from-web', async (c) => {
	const payload = await c.req.json();

	console.log(111111, payload);

	const token = await createJwtToken(c, payload.id);

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

	return c.json({ message: 'success', token });
});

app.post('/dev-login', async (c) => {
	if (!c.env.DEV_TG_USER_ID) {
		c.status(403);

		return c.json({ message: 'Not allowed in production' });
	}

	const token = await createJwtToken(c, c.env.DEV_TG_USER_ID);

	return c.json({ message: 'success', token });
});

export default app;
