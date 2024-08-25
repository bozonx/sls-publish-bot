import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { jwt, decode, sign, verify } from 'hono/jwt';
import crypto from 'node:crypto';
// import { sessionMiddleware, CookieStore } from 'hono-sessions';
// import { CloudflareD1Store } from 'hono-sessions/cloudflare-d1-store';
import { createJwtToken } from './helpers.js';
import apiTgBot from './apiTgBot.js';
import apiUser from './apiUser.js';
import apiWorkspace from './apiWorkspace.js';
import apiBlog from './apiBlog.js';
import apiInbox from './apiInbox.js';

const app = new Hono().basePath('/api');
let store;

// app.use('*', (c, next) => {
// 	if (!store) store = new CloudflareD1Store('session');
//
// 	store.db = c.env.DB;
//
// 	return sessionMiddleware({
// 		store,
// 		encryptionKey: 'Cw7j^#Yj7%tVocy2Pp7GCw7j^#Yj7%tVocy2Pp7G',
// 		expireAfterSeconds: 900, // Expire session after 15 minutes of inactivity
// 		cookieOptions: {
// 			sameSite: 'Lax', // Recommended for basic CSRF protection in modern browsers
// 			path: '/', // Required for this library to work properly
// 			httpOnly: true, // Recommended to avoid XSS attacks
// 		},
// 	})(c, next);
// });

app.use(
	'*',
	cors({
		origin: '*',
		// TODO: use it
		// origin: process.env.CORS_ORIGIN,
	}),
);

app.use('/auth/*', (c, next) => {
	// if (c.req.path === '/api/login') return;

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

app.get('/auth/page', async (c) => {
	const payload = c.get('jwtPayload');

	console.log(1111, payload);

	return c.json(payload);
});

app.post('/login', async (c) => {
	const { tgUserId } = await c.req.json();

	await createJwtToken(c, tgUserId);

	return c.json({ message: 'success' });
});

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
// // authenficate from UI which is run under TgWebApp
// app.post('/auth-via-bot', async (c) => {
// 	c.status(200);
//
// 	return c.json({});
// });

export default app;
