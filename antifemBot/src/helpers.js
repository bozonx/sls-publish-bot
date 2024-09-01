import _ from 'lodash';
import dayjs from 'dayjs';
import { InlineKeyboard } from 'grammy';
import locales from './i18n.js';
import {
	TG_BOT_URL,
	CTX_KEYS,
	CACHE_PREFIX,
	USER_KEYS,
	USER_SENT_TO_ADMIN_MSG_DELIMITER,
	QUERY_MARKER,
	PUB_KEYS,
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
	let postType = 'text';
	let mediaCount = 0;
	// TODO: если мд то очистить
	let textLength = state[PUB_KEYS.text]?.length || 0;

	if (state[PUB_KEYS.photo]) {
		postType = PUB_KEYS.photo;
		mediaCount = state[PUB_KEYS.photo].length;
	} else if (state[PUB_KEYS.video]) {
		postType = PUB_KEYS.video;
		mediaCount = state[PUB_KEYS.video].length;
	}

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

	return typeof parsed === 'undefined' ? defaultValue : parsed;
}

export async function saveToKv(c, key, value) {
	const valueStr = JSON.stringify(value);

	try {
		return c.ctx[CTX_KEYS.KV].put(key, valueStr);
	} catch (e) {
		throw new Error(`ERROR: Can't save value ${valueStr} of "${key}": ${e}`);
	}
}

export async function loadFromCache(c, key) {
	const fullKey = `${CACHE_PREFIX}|${c.msg.chat.id}|${key}`;
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
	const fullKey = `${CACHE_PREFIX}|${c.msg.chat.id}|${key}`;
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

export function isAdminUser(c, userId) {
	if (!userId || !['string', 'number'].includes(typeof userId))
		throw new Error(`ERROR: isAdminUser. Wrong userId - ${typeof userId}`);

	const found = c.ctx[CTX_KEYS.users]?.find(
		(i) => i[USER_KEYS.isAdmin] && Number(i[USER_KEYS.id]) === Number(userId),
	);

	return Boolean(found);
}

export function isRegisteredUser(c, userId) {
	if (!userId || !['string', 'number'].includes(typeof userId))
		throw new Error(`ERROR: isRegisteredUser. Wrong userId - ${typeof userId}`);

	const found = c.ctx[CTX_KEYS.users]?.find(
		(i) => Number(i[USER_KEYS.id]) === Number(userId),
	);

	return Boolean(found);
}

export function makeUnregisteredMsg(c) {
	const dataStr = JSON.stringify({
		[USER_KEYS.id]: c.msg.from.id,
		// TODO: add last name
		[USER_KEYS.name]: c.msg.from.first_name || c.msg.from.username,
	});

	return `${t(c, 'youAreNotRegistered')}.\n${USER_SENT_TO_ADMIN_MSG_DELIMITER}\n${dataStr}`;
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

export function generateTagsButtons(tags, cb) {
	const idPrefix = 'TAG-';
	const menu = [];

	for (const tag of tags) {
		// TODO: split to rows
		menu.push([{ id: idPrefix + tag, label: tag, payload: tag, cb }]);
	}

	return menu;
}

export function nowPlusDay(plusday) {
	const date = dayjs().add(plusday, 'day');

	// TODO: MOSCOW

	return date.format('YYYY-MM-DD');
}

export function makeContentState(c) {
	let state = { entities: c.msg.entities };

	// console.log(2222, c.msg);

	// TODO: captions parse to md with entities
	// TODO: media group

	// TODO: add STATE_KEYS

	if (c.msg.video) {
		state = {
			...state,
			text: c.msg.caption,
			video: c.msg.video,
		};
	} else if (c.msg.photo) {
		state = {
			...state,
			text: c.msg.caption,
			photo: c.msg.photo,
		};
	} else if (c.msg.text) {
		state = {
			...state,
			text: c.msg.text,
		};
	} else {
		return;
	}

	return state;
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
