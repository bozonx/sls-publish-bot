import { InlineKeyboard } from 'grammy';
import locales from './i18n.js';
import {
	TG_BOT_URL,
	CTX_KEYS,
	CACHE_PREFIX,
	QUERY_MARKER,
	PUB_KEYS,
	USER_KEYS,
} from './constants.js';
import { makeHumanRuDate } from './dateTimeHelpers.js';

export async function setWebhook({ TG_TOKEN, WORKER_HOST }) {
	const url = `https://api.telegram.org/bot${TG_TOKEN}/setWebhook?url=https://${WORKER_HOST}${TG_BOT_URL}`;

	return fetch(url);
}

export function t(c, msg) {
	// let lang = ctx.session?.userData?.lang || ctx.from.language_code;
	//
	// if (!(lang in locales)) lang = 'en';

	const lang = 'ru';

	return locales[lang][msg] || msg;
}

export function makeStatePreview(c, state = {}) {
	let mediaCount = state[PUB_KEYS.media]?.length || 0;
	let textLength = state[PUB_KEYS.text]?.length || 0;
	let postType = 'text';

	if (state.media?.length === 1) postType = state.media[0].type;
	else if (state.media?.length > 1) postType = 'media group';

	let res = '';

	if (state[PUB_KEYS.text]) res += `${t(c, 'statePostType')}: ${postType}\n`;
	if (textLength) res += `${t(c, 'stateTextLength')}: ${textLength}\n`;
	if (mediaCount) res += `${t(c, 'stateMediaCount')}: ${mediaCount}\n`;
	if (state[PUB_KEYS.author])
		res += `${t(c, 'stateAuthor')}: ${state[PUB_KEYS.author]}\n`;
	if (state[PUB_KEYS.tags])
		res += `${t(c, 'stateTags')}: ${state[PUB_KEYS.tags].join(', ')}\n`;
	if (state[PUB_KEYS.template])
		res += `${t(c, 'stateTemplate')}: ${t(c, 'template-' + state[PUB_KEYS.template])}\n`;
	if (!mediaCount && typeof state[PUB_KEYS.preview] !== 'undefined')
		res += `${t(c, 'stateUrlPreview')}: ${state[PUB_KEYS.preview] ? '✓' : '𐄂'}\n`;

	if (state[PUB_KEYS.date])
		res += `${t(c, 'stateDate')}: ${makeHumanRuDate(c, state[PUB_KEYS.date])}\n`;
	if (state[PUB_KEYS.time]) {
		res += `${t(c, 'stateTime')}: ${state[PUB_KEYS.time]} (${t(c, 'msk')})\n`;
	}

	if (state[PUB_KEYS.publisherName])
		res += `${t(c, 'statePublisher')}: ${state[PUB_KEYS.publisherName]}\n`;

	return res.trim();
}

export async function loadFromKv(c, key, defaultValue) {
	let resStr;

	try {
		resStr = await c.ctx[CTX_KEYS.KV].get(key);
	} catch (e) {
		throw new Error(`ERROR: Can't load value of "${key}": ${e}`);
	}

	const parsed = parseJsonSafelly(resStr);

	// TODO: а оно не null возвращает?

	return typeof parsed === 'undefined' ? defaultValue : parsed;
}

export async function saveToKv(c, key, value) {
	const valueStr = JSON.stringify(value);

	// TODO: если передан undefined то значение очистится???
	try {
		return c.ctx[CTX_KEYS.KV].put(key, valueStr);
	} catch (e) {
		throw new Error(`ERROR: Can't save value ${valueStr} of "${key}": ${e}`);
	}
}

export async function loadFromCache(c, key, specifiedUserId) {
	const currentUserId = specifiedUserId || c.ctx[CTX_KEYS.me][USER_KEYS.id];
	const fullKey = `${CACHE_PREFIX}|${currentUserId}|${key}`;
	let resStr;

	try {
		resStr = await c.ctx[CTX_KEYS.KV].get(fullKey);
	} catch (e) {
		throw new Error(`ERROR: Can't load value from cache "${key}": ${e}`);
	}

	return parseJsonSafelly(resStr);
}

// on expire the key-value pair will be deleted
export async function saveToCache(c, key, value, expireFromNowSec) {
	const currentUserId = c.ctx[CTX_KEYS.me][USER_KEYS.id];
	const fullKey = `${CACHE_PREFIX}|${currentUserId}|${key}`;
	const valueStr = JSON.stringify(value);

	try {
		return c.ctx[CTX_KEYS.KV].put(fullKey, valueStr, {
			expirationTtl: expireFromNowSec,
		});
	} catch (e) {
		throw new Error(
			`ERROR: Can't save cache value ${valueStr} of "${key}": ${e}`,
		);
	}
}

export function parseTagsFromInput(rawStr = '') {
	return rawStr
		.split(',')
		.map((i) =>
			i
				.trim()
				.toLowerCase()
				.replace(/[\-\s]/g, '_')
				.replace(/[^\p{L}\p{N}_]/gu, ''),
		)
		.filter(Boolean);
}

// remove undefined and false items in menu
export function defineMenu(menu = []) {
	const res = [];

	for (const row of menu) {
		if (row) res.push(row.filter(Boolean));
	}

	return res;
}

export function renderMenuKeyboard(menu) {
	if (!menu?.length) return;

	const keyboard = new InlineKeyboard();

	for (const row of menu) {
		for (const { id, label, payload } of row) {
			let query = `${QUERY_MARKER}|${id}`;

			if (payload) query += `|${JSON.stringify(payload)}`;

			keyboard.text(label, query);
		}

		keyboard.row();
	}

	return keyboard;
}

export function parseJsonSafelly(dataStr) {
	if (typeof dataStr !== 'string') return;
	// if empty string means undefined
	else if (!dataStr) return;

	return JSON.parse(dataStr);
}
