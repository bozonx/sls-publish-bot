import dayjs from 'dayjs';
import locales from './botLocales.js';
import { TG_BOT_URL, KV_TAGS, APP_INITIAL_CONFIG } from './constants.js';

export async function setWebhook(env) {
	const url = `https://api.telegram.org/bot${env.TG_TOKEN}/setWebhook?url=https://${env.WORKER_HOST}${TG_BOT_URL}`;

	return fetch(url);
}

export function t(c, msg) {
	// let lang = ctx.session?.userData?.lang || ctx.from.language_code;
	//
	// if (!(lang in locales)) lang = 'en';

	const lang = 'ru';

	const res = locales[lang][msg];

	return res || msg;
}

export function makePayloadPreview(c, payload = {}) {
	let postType = 'text';

	if (payload.photo) postType = 'photo';
	else if (payload.video) postType = 'video';

	let res = `${t(c, 'postType')}: ${postType}\n`;

	if (payload.author) res += `${t(c, 'author')}: ${payload.author}\n`;
	if (payload.tags) res += `${t(c, 'tags')}: ${payload.tags.join(', ')}\n`;
	if (payload.date)
		res += `${t(c, 'date')}: ${dayjs(payload.date).format('DD.MM.YYYY')}\n`;

	if (payload.hour) {
		const hour = payload.hour < 10 ? `0{payload.hour}` : payload.hour;

		res += `${t(c, 'time')}: ${hour}:00 (${t(c, 'msk')})\n`;
	}

	if (payload.template)
		res += `${t(c, 'template')}: ${t(c, 'template-' + payload.template)}\n`;

	if (typeof payload.preview !== 'undefined')
		res += `${t(c, 'urlPreview')}: ${payload.preview ? '✅' : '❌'}\n`;

	return res.trim();
}

export async function loadTags(c) {
	let tagsStr;

	try {
		tagsStr = await c.config.KV.get(KV_TAGS);
	} catch (e) {
		return;
	}

	return tagsStr ? JSON.parse(tagsStr) : [];
}

export function generateTagsButtons(c, tags, cb) {
	const menu = [];

	for (const tagIndex in tags) {
		// TODO: split to rows
		menu.push([[tags[tagIndex], cb]]);
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
				.replace(
					/[\#\!\~\`\@\$\%\^\№\:\"\'\;\&\?\*\.\,\(\)\[\]\{\}\=\+\<\>\/\\\|]/g,
					'',
				),
		// .replace(/[^\w\d\_]/g, '');
		// .replace(new RegExp('[^\\w\\d_]', 'ug'), '');
	);
}

export function nowPlusDay(plusday) {
	const date = dayjs().add(plusday, 'day');

	// TODO: MOSCOW

	return date.format('YYYY-MM-DD');
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
