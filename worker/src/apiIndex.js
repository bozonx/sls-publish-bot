import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { jwt, decode, sign, verify } from 'hono/jwt';
import { setCookie } from 'hono/cookie';
import { sessionMiddleware, CookieStore } from 'hono-sessions';
import { CloudflareD1Store } from 'hono-sessions/cloudflare-d1-store';
import { JWT_COOKIE_NAME } from './constants.js';
import apiTgBot from './apiTgBot.js';
import apiUser from './apiUser.js';
import apiWorkspace from './apiWorkspace.js';
import apiBlog from './apiBlog.js';
import apiInbox from './apiInbox.js';

const app = new Hono().basePath('/api');
let store;

app.use('*', (c, next) => {
	if (!store) store = new CloudflareD1Store('session');

	store.db = c.env.DB;

	return sessionMiddleware({
		store,
		encryptionKey: 'Cw7j^#Yj7%tVocy2Pp7GCw7j^#Yj7%tVocy2Pp7G',
		expireAfterSeconds: 900, // Expire session after 15 minutes of inactivity
		cookieOptions: {
			sameSite: 'Lax', // Recommended for basic CSRF protection in modern browsers
			path: '/', // Required for this library to work properly
			httpOnly: true, // Recommended to avoid XSS attacks
		},
	})(c, next);
});

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

	// TODO: check tgUserId

	const jwtToken = await sign({ sub: tgUserId }, c.env.JWT_SECRET);

	setCookie(c, JWT_COOKIE_NAME, jwtToken);

	console.log(234, jwtToken);

	return c.json({ message: 'success' });
});

// // authenficate from UI which is run under TgWebApp
// app.post('/auth-via-bot', async (c) => {
// 	c.status(200);
//
// 	return c.json({});
// });

export default app;
