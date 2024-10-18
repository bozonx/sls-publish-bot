import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { authMiddleware } from './authMiddleware.js';
import { getBase } from './crudLogic.js';
import { setCookieJwtToken, riseError } from './helpers.js';
import apiTgBot from './apiTgBot.js';
import apiUser from './apiUser.js';
import apiWorkspace from './apiWorkspace.js';
import apiBlog from './apiBlog.js';
import apiSocialMedia from './apiSocialMedia.js';
import apiTask from './apiTask.js';
import apiPermission from './apiPermission.js';
import apiChangeLog from './apiChangeLog.js';

const app = new Hono().basePath('/api');

app.use('*', (c, next) => {
	const reqPath = c.req.path;

	if (
		reqPath.indexOf('/api/auth') === 0 ||
		['/api/tg-auth-from-web', '/api/dev-login'].includes(reqPath)
	) {
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
app.route('/auth/social-media', apiSocialMedia);
app.route('/auth/task', apiTask);
app.route('/auth/permission', apiPermission);
app.route('/auth/apiChangeLog', apiChangeLog);

app.post('/tg-auth-from-web', async (c) => {
	const { id: tgUserId } = await c.req.json();

	await createJwtTokenByTgUserId(c, tgUserId);

	// TODO: check hash

	return c.json({ message: 'success' });
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
});

app.post('/dev-login', async (c) => {
	console.log(111, c);

	if (!c.env.DEV_TG_USER_ID) throw riseError(403, `Not allowed in production`);

	await createJwtTokenByTgUserId(c, c.env.DEV_TG_USER_ID);

	return c.json({ message: 'success' });
});

export default app;

async function createJwtTokenByTgUserId(c, tgUserId) {
	// TODO: use select
	const res = await getBase(c, 'User', { tgUserId: String(tgUserId) });

	if (!('id' in res)) {
		throw riseError(404, `Can't find user`);
		// c.status(404);
		// return c.json({ message: `Can't find user` });
	}

	return setCookieJwtToken(c, { sub: res.id, azp: String(tgUserId) });
}
