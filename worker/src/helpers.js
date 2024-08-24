import { camelCase } from 'lodash';
import { TG_BOT_URL } from './constants.js';

export async function setWebhook(env) {
	const url = `https://api.telegram.org/bot${env.TG_TOKEN}/setWebhook?url=https://${env.WORKER_HOST}${TG_BOT_URL}`;

	return fetch(url);
}

export function keysToCammelCase(obj) {
	const res = {};

	for (const index of Object.keys(obj)) {
		res[camelCase(index)] = obj[index];
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
