import _ from 'lodash';
import dayjs from 'dayjs';
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
	// TODO: если мд то очистить
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
	if (state[PUB_KEYS.date])
		res += `${t(c, 'stateDate')}: ${dayjs(state[PUB_KEYS.date]).format('DD.MM.YYYY')}\n`;

	if (state[PUB_KEYS.hour]) {
		const hour =
			state.hour < 10 ? `0${state[PUB_KEYS.hour]}` : state[PUB_KEYS.hour];

		res += `${t(c, 'stateTime')}: ${hour}:00 (${t(c, 'msk')})\n`;
	}

	if (state[PUB_KEYS.template])
		res += `${t(c, 'stateTemplate')}: ${t(c, 'template-' + state[PUB_KEYS.template])}\n`;
	if (typeof state[PUB_KEYS.preview] !== 'undefined')
		// res += `${t(c, 'stateUrlPreview')}: ${state.preview ? '✅' : '❌'}\n`;
		res += `${t(c, 'stateUrlPreview')}: ${state[PUB_KEYS.preview] ? '✓' : '𐄂'}\n`;

	if (state[PUB_KEYS.publisher])
		res += `${t(c, 'statePublisher')}: ${state[PUB_KEYS.publisher]}\n`;

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

export async function loadFromCache(c, key) {
	const currentUserId = c.ctx[CTX_KEYS.me[USER_KEYS.id]];
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
	const currentUserId = c.ctx[CTX_KEYS.me[USER_KEYS.id]];
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

export function nowPlusDay(plusday) {
	const date = dayjs().add(plusday, 'day');

	// TODO: MOSCOW

	return date.format('YYYY-MM-DD');
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

// export function generateTagsButtons(tags) {
// 	const idPrefix = 'TAG-';
// 	const menu = [];
//
// 	for (const tag of tags) {
// 		// TODO: split to rows
// 		menu.push([{ id: idPrefix + tag, label: tag, payload: tag }]);
// 	}
//
// 	return menu;
// }

// export function isAdminUser(c, userId) {
// 	if (!userId || !['string', 'number'].includes(typeof userId))
// 		throw new Error(`ERROR: isAdminUser. Wrong userId - ${typeof userId}`);
//
// 	const found = c.ctx[CTX_KEYS.users]?.find(
// 		(i) => i[USER_KEYS.isAdmin] && Number(i[USER_KEYS.id]) === Number(userId),
// 	);
//
// 	return Boolean(found);
// }

// export function isRegisteredUser(c, userId) {
// 	if (!userId || !['string', 'number'].includes(typeof userId))
// 		throw new Error(`ERROR: isRegisteredUser. Wrong userId - ${typeof userId}`);
//
// 	const found = c.ctx[CTX_KEYS.users]?.find(
// 		(i) => Number(i[USER_KEYS.id]) === Number(userId),
// 	);
//
// 	return Boolean(found);
// }

// export function hasPubHaveMedia(pubState = {}) {
// 	const mediaFields = [PUB_KEYS.photo, PUB_KEYS.video];
//
// 	return Boolean(
// 		Object.keys(pubState).find((i) => pubState[i] && mediaFields.includes(i)),
// 	);
// }

// export async function prepareSession(c) {
// 	const cfgJson = await c.config.KV.get(KV_CONFIG);
//
// 	if (cfgJson) {
// 		c.session.config = JSON.parse(cfgJson);
// 	}
// }

// export async function createInitialConfig(c) {
// 	c.session.config = await c.config.KV.put(
// 		KV_CONFIG,
// 		JSON.stringify(APP_INITIAL_CONFIG),
// 	);
// }

// export function keysToCammelCase(obj) {
// 	const res = {};
//
// 	for (const index of Object.keys(obj)) {
// 		res[_.camelCase(index)] = obj[index];
// 	}
//
// 	return res;
// }

// export function normalizeNumbers(obj) {
// 	const res = {};
//
// 	for (const index of Object.keys(obj)) {
// 		res[index] = Number.isNaN(Number(obj[index])) ? obj[index] : Number(obj[index]);
// 	}
//
// 	return res;
// }
