import dayjs from 'dayjs';
import locales from './i18n.js';
import {
	TG_BOT_URL,
	CTX_KEYS,
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

	let res = `${t(c, 'postType')}: ${postType}\n`;

	if (textLength) res += `${t(c, 'textLength')}: ${textLength}\n`;
	if (mediaCount) res += `${t(c, 'mediaCount')}: ${mediaCount}\n`;
	if (state.author) res += `${t(c, 'author')}: ${state.author}\n`;
	if (state.tags) res += `${t(c, 'tags')}: ${state.tags.join(', ')}\n`;
	if (state.date)
		res += `${t(c, 'date')}: ${dayjs(state.date).format('DD.MM.YYYY')}\n`;

	if (state.hour) {
		const hour = state.hour < 10 ? `0${state.hour}` : state.hour;

		res += `${t(c, 'time')}: ${hour}:00 (${t(c, 'msk')})\n`;
	}

	if (state.template)
		res += `${t(c, 'template')}: ${t(c, 'template-' + state.template)}\n`;

	if (typeof state.preview !== 'undefined')
		res += `${t(c, 'urlPreview')}: ${state.preview ? '✅' : '❌'}\n`;

	return res.trim();
}

export async function loadDataFromKv(c, key, defaultValue) {
	let tagsStr;

	try {
		tagsStr = await c.ctx[CTX_KEYS.KV].get(key);
	} catch (e) {
		throw new Error(`ERROR: Can't load value of "${key}": ${e}`);
	}

	return tagsStr ? JSON.parse(tagsStr) : defaultValue;
}

export async function saveDataToKv(c, key, value) {
	try {
		await c.ctx[CTX_KEYS.KV].put(key, JSON.stringify(value));
	} catch (e) {
		throw new Error(`ERROR: Can't save value of "${key}": ${e}`);
	}
}

export function generateTagsButtons(tags, cb, idPrefix) {
	const menu = [];

	for (const tag of tags) {
		// TODO: split to rows
		menu.push([{ id: idPrefix + tag, label: tag, cb }]);
	}

	return menu;
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
			// TODO: better to remove all not letters
			// .replace(new RegExp('[^\\w\\d_]', 'ug'), '');
		)
		.filter((i) => i);
}

export function nowPlusDay(plusday) {
	const date = dayjs().add(plusday, 'day');

	// TODO: MOSCOW

	return date.format('YYYY-MM-DD');
}

export function isAdminUser(c, userId) {
	const users = c.ctx[CTX_KEYS.USERS];
	const found = users?.find(
		(i) => i[USER_KEYS.IS_ADMIN] && i[USER_KEYS.ID] === userId,
	);

	return Boolean(found);
}

export function isRegisteredUser(c, userId) {
	const users = c.ctx[CTX_KEYS.USERS];
	const found = users?.find((i) => i[USER_KEYS.ID] === userId);

	return Boolean(found);
}

export function makeUnregisteredMsg(c) {
	const dataStr = JSON.stringify({
		[USER_KEYS.ID]: c.msg.from.id,
		[USER_KEYS.NAME]: c.msg.from.first_name || c.msg.from.username,
	});

	return `${t(c, 'youAreNotRegistered')}.\n${USER_SENT_TO_ADMIN_MSG_DELIMITER}\n${dataStr}`;
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

// remove undefined and false items
export function defineMenu(menu = []) {
	const res = [];

	for (const row of menu) {
		if (!row) continue;

		const rowArr = [];

		for (const btn of row) {
			if (!btn) continue;

			rowArr.push(btn);
		}

		res.push(rowArr);
	}

	return res;
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
