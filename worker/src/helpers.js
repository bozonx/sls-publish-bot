import _ from 'lodash';
import { sign } from 'hono/jwt';
import { HTTPException } from 'hono/http-exception';
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

	// TODO: тут происходит ошика на продакшене
	const jwtToken = await sign(
		{
			...payloadObj,
			// exp: Math.floor(Date.now() / 1000) + maxAgeSeconds,
		},
		c.env.JWT_SECRET,
	);

	setCookie(c, JWT_COOKIE_NAME, jwtToken, {
		...AUTH_COOKIE_BASE_PARAMS,
		maxAge: maxAgeSeconds,
		// domain: 'publisher.ivank.workers.dev',
	});

	return jwtToken;
}

export function riseError(status, message) {
	return new HTTPException(401, {
		message: message,
		res: {
			body: JSON.stringify({ message }),
			status,
			statusText: 'Unauthorized',
			headers: {
				ContentType: 'aplication/json',
			},
		},
	});
}
