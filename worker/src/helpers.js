import _ from 'lodash';
import { sign } from 'hono/jwt';
import { setCookie } from 'hono/cookie';
import { TG_BOT_URL, JWT_COOKIE_NAME } from './constants.js';

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
	const jwtToken = await sign({ sub: tgUserId }, c.env.JWT_SECRET);

	// TODO: check tgUserId

	setCookie(c, JWT_COOKIE_NAME, jwtToken);

	return jwtToken;
}
