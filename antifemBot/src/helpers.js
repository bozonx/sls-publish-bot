import dayjs from 'dayjs';
import locales from './i18n.js';
import {
	TG_BOT_URL,
	CTX_KEYS,
	CACHE_PREFIX,
	USER_KEYS,
	USER_SENT_TO_ADMIN_MSG_DELIMITER,
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
	let textLength = state.text?.length || 0;

	if (state.photo) {
		postType = 'photo';
		mediaCount = state.photo.length;
	} else if (state.video) {
		postType = 'video';
		mediaCount = state.video.length;
	}

	let res = `${t(c, 'statePostType')}: ${postType}\n`;

	if (textLength) res += `${t(c, 'stateTextLength')}: ${textLength}\n`;
	if (mediaCount) res += `${t(c, 'stateMediaCount')}: ${mediaCount}\n`;
	if (state.author) res += `${t(c, 'stateAuthor')}: ${state.author}\n`;
	if (state.tags) res += `${t(c, 'stateTags')}: ${state.tags.join(', ')}\n`;
	if (state.date)
		res += `${t(c, 'stateDate')}: ${dayjs(state.date).format('DD.MM.YYYY')}\n`;

	if (state.hour) {
		const hour = state.hour < 10 ? `0${state.hour}` : state.hour;

		res += `${t(c, 'stateTime')}: ${hour}:00 (${t(c, 'msk')})\n`;
	}

	if (state.template)
		res += `${t(c, 'stateTemplate')}: ${t(c, 'template-' + state.template)}\n`;

	if (typeof state.preview !== 'undefined')
		res += `${t(c, 'stateUrlPreview')}: ${state.preview ? '✅' : '❌'}\n`;

	return res.trim();
}

export async function loadFromKv(c, key, defaultValue) {
	let tagsStr;

	try {
		tagsStr = await c.ctx[CTX_KEYS.KV].get(key);
	} catch (e) {
		throw new Error(`ERROR: Can't load value of "${key}": ${e}`);
	}

	return tagsStr ? JSON.parse(tagsStr) : defaultValue;
}

export async function saveToKv(c, key, value) {
	const valueStr = JSON.stringify(value);

	try {
		await c.ctx[CTX_KEYS.KV].put(key, valueStr);
	} catch (e) {
		throw new Error(`ERROR: Can't save value ${valueStr} of "${key}": ${e}`);
	}
}

export function loadFromCache(c, key) {
	const fullKey = `${CACHE_PREFIX}|${c.msg.chat.id}|${key}`;

	return c.ctx[CTX_KEYS.KV].get(fullKey);
}

// on expire the key-value pair will be deleted
export function saveToCache(c, key, value, expireFromNowSec) {
	const fullKey = `${CACHE_PREFIX}|${c.msg.chat.id}|${key}`;

	return c.ctx[CTX_KEYS.KV].put(fullKey, value, {
		expirationTtl: expireFromNowSec,
	});
}

export function isAdminUser(c, userId) {
	if (!userId && !['string', 'number'].includes(typeof userId))
		throw new Error(`ERROR: isAdminUser. Wrong userId - ${typeof userId}`);

	const found = c.ctx[CTX_KEYS.USERS]?.find(
		(i) => i[USER_KEYS.IS_ADMIN] && Number(i[USER_KEYS.ID]) === Number(userId),
	);

	return Boolean(found);
}

export function isRegisteredUser(c, userId) {
	if (!userId && !['string', 'number'].includes(typeof userId))
		throw new Error(`ERROR: isRegisteredUser. Wrong userId - ${typeof userId}`);

	const found = c.ctx[CTX_KEYS.USERS]?.find(
		(i) => Number(i[USER_KEYS.ID]) === Number(userId),
	);

	return Boolean(found);
}

export function makeUnregisteredMsg(c) {
	const dataStr = JSON.stringify({
		[USER_KEYS.ID]: c.msg.from.id,
		[USER_KEYS.NAME]: c.msg.from.first_name || c.msg.from.username,
	});

	return `${t(c, 'youAreNotRegistered')}.\n${USER_SENT_TO_ADMIN_MSG_DELIMITER}\n${dataStr}`;
}

export function parseTagsFromInput(rawStr = '') {
	return rawStr
		.split(',')
		.map(
			(i) =>
				i
					.trim()
					.toLowerCase()
					.replace(/[\-\s]/g, '_')
					.replace(/[^\p{L}\p{N}_]/gu, ''),
			// .replace(
			// 	/[\#\!\~\`\@\$\%\^\№\:\"\'\;\&\?\*\.\,\(\)\[\]\{\}\=\+\<\>\/\\\|]/g,
			// 	'',
			// ),
			// .replace(new RegExp('[^\\w\\d_]', 'ug'), '');
		)
		.filter(Boolean);
}

// remove undefined and false items in menu
export function defineMenu(menu = []) {
	const res = [];

	for (const row of menu) {
		if (row) res.push(row.filter(Boolean));

		// if (!row) continue;
		//
		// const rowArr = [];
		//
		// for (const btn of row) {
		// 	if (!btn) continue;
		//
		// 	rowArr.push(btn);
		// }
		//
		// res.push(rowArr);
	}

	return res;
}

export function generateTagsButtons(tags, cb, idPrefix) {
	const menu = [];

	for (const tag of tags) {
		// TODO: split to rows
		menu.push([{ id: idPrefix + tag, label: tag, cb }]);
	}

	return menu;
}

export function nowPlusDay(plusday) {
	const date = dayjs().add(plusday, 'day');

	// TODO: MOSCOW

	return date.format('YYYY-MM-DD');
}

export function makeContentState(c) {
	let state;

	// console.log(2222, c.msg);

	// TODO: captions parse to md with entities
	// TODO: media group

	if (c.msg.video) {
		state = {
			text: c.msg.caption,
			video: c.msg.video,
		};
	} else if (c.msg.photo) {
		state = {
			text: c.msg.caption,
			photo: c.msg.photo,
		};
	} else if (c.msg.text) {
		state = {
			text: c.msg.text,
		};
	} else {
		return;
	}

	return state;
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
