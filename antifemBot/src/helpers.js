import dayjs from 'dayjs';
import locales from './botLocales.js';
import { TG_BOT_URL, KV_KEYS, CTX_KEYS, USER_KEYS } from './constants.js';

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

export function makePayloadPreview(c, state = {}) {
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

// TODO: review
export async function loadTags(c) {
	let tagsStr;

	try {
		tagsStr = await c.config.KV.get(KV_KEYS.TAGS);
	} catch (e) {
		return;
	}

	return tagsStr ? JSON.parse(tagsStr) : [];
}

// TODO: review
export function generateTagsButtons(c, tags, cb) {
	const menu = [];

	for (const tagIndex in tags) {
		// TODO: split to rows
		menu.push([[tags[tagIndex], cb(tagIndex)]]);
	}

	return menu;
}

export function parseTagsFromInput(rawStr = '') {
	return rawStr.split(',').map(
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
	);
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

	return `${t(c, 'youAreNotRegistered')}.\n-----\n${dataStr}`;
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
