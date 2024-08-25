import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { sessionMiddleware, CookieStore } from 'hono-sessions';
import { CloudflareD1Store } from 'hono-sessions/cloudflare-d1-store';
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

app.route('/bot', apiTgBot);
app.route('/users', apiUser);
app.route('/workspaces', apiWorkspace);
app.route('/blogs', apiBlog);
app.route('/inbox', apiInbox);

export default app;
