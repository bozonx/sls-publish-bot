import _ from 'lodash';
import { sign } from 'hono/jwt';
import { setCookie } from 'hono/cookie';
import { TG_BOT_URL, JWT_COOKIE_NAME, AUTH_COOKIE_BASE_PARAMS } from './constants.js';

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

export async function setCookieJwtToken(c, payloadObj) {
	const maxAgeSeconds = c.env.AUTH_MAX_AGE_DAYS * 24 * 60 * 60;

	console.log(6666, maxAgeSeconds);

	// TODO: тут происходит ошика на продакшене
	const jwtToken = await sign(
		{
			...payloadObj,
			// exp: Math.floor(Date.now() / 1000) + maxAgeSeconds,
		},
		c.env.JWT_SECRET,
	);

	console.log(7777, jwtToken);

	setCookie(c, JWT_COOKIE_NAME, jwtToken, {
		...AUTH_COOKIE_BASE_PARAMS,
		maxAge: maxAgeSeconds,
		// domain: 'localhost',
	});

	console.log(8888888);

	return jwtToken;
}
