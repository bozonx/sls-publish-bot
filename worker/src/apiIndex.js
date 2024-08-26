import { Hono } from 'hono';
import { cors } from 'hono/cors';
import apiTgBot from './apiTgBot.js';
import apiUser from './apiUser.js';
import apiWorkspace from './apiWorkspace.js';
import apiBlog from './apiBlog.js';
import apiInbox from './apiInbox.js';
import { authMiddleware } from './authMiddleware.js';
import { getBase } from './crudLogic.js';
import { setCookieJwtToken } from './helpers.js';

const app = new Hono().basePath('/api');

app.use('*', (c, next) => {
	if (c.req.path.indexOf('/api/auth') === 0 || ['/api/tg-auth-from-web', '/api/dev-login'].includes(c.req.path)) {
		// requests with cookies
		return cors({
			origin: c.env.CORS_ORIGIN,
			credentials: true,
		})(c, next);
	} else {
		// all other requests without cookies
		return cors({ origin: '*' })(c, next);
	}
});

app.use('/auth/*', authMiddleware());

app.route('/bot', apiTgBot);
app.route('/auth/users', apiUser);
app.route('/auth/workspaces', apiWorkspace);
app.route('/auth/blogs', apiBlog);
app.route('/auth/inbox', apiInbox);

app.post('/tg-auth-from-web', async (c) => {
	const payload = await c.req.json();

	console.log(111111, payload);

	await createJwtTokenByTgUserId(c, payload.id);

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

	await createJwtTokenByTgUserId(c, c.env.DEV_TG_USER_ID);

	return c.json({ message: 'success' });
});

export default app;

async function createJwtTokenByTgUserId(c, tgUserId) {
	const res = await getBase(c, 'user', { tgUserId });

	if (!('id' in res)) {
		c.status(404);

		return c.json({ message: `Can't find user` });
	}

	return setCookieJwtToken(c, { sub: res.id, azp: tgUserId });
}
