import _ from 'lodash';
import { sign } from 'hono/jwt';
import { setCookie } from 'hono/cookie';
import { TG_BOT_URL, JWT_COOKIE_NAME, AUTH_COOKIE_BASE_PARAMS } from './constants.js';
import { getBase } from './crudLogic.js';

export async function setWebhook(env) {
	const url = `https://api.telegram.org/bot${env.TG_TOKEN}/setWebhook?url=https://${env.WORKER_HOST}${TG_BOT_URL}`;

	return fetch(url);
}

export function keysToCammelCase(obj) {
	const res = {};

	for (const index of Object.keys(obj)) {
		res[_.camelCase(index)] = obj[index];
	}

	return res;
}

export function normalizeNumbers(obj) {
	const res = {};

	for (const index of Object.keys(obj)) {
		res[index] = Number.isNaN(Number(obj[index])) ? obj[index] : Number(obj[index]);
	}

	return res;
}

export async function createJwtToken(c, tgUserId) {
	const res = await getBase(c, 'user', { tgUserId });

	if (!('id' in res)) {
		c.status(404);

		return c.json({ message: `Can't find user` });
	}

	// TODO: add exp 	Expiration Time
	return await sign({ sub: res.id, azp: tgUserId }, c.env.JWT_SECRET);
}

export async function setCookieJwtToken(c, payloadObj) {
	// TODO: add exp 	Expiration Time
	const jwtToken = await sign(payloadObj, c.env.JWT_SECRET);

	setCookie(c, JWT_COOKIE_NAME, jwtToken, {
		...AUTH_COOKIE_BASE_PARAMS,
		// domain: 'localhost',
		// maxAge: 10000,
		// TODO: add
		// expires: new Date(Date.UTC(2000, 11, 24, 10, 30, 59, 900)),
	});

	return jwtToken;
}
