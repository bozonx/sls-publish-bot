import { InlineKeyboard } from 'grammy';
import locales from '../i18n.js';
import {
	TG_BOT_URL,
	CTX_KEYS,
	QUERY_MARKER,
	PUB_KEYS,
	TAG_KEYS,
	USER_KEYS,
	USER_CFG_KEYS,
	USER_PERMISSIONS_KEYS,
	DB_TABLE_NAMES,
	PUB_SCHEDULED_KEYS,
	DEFAULT_SOCIAL_MEDIA,
} from '../constants.js';
import { makeHumanRuDate } from './dateTimeHelpers.js';
import { makeStringArrayUnique } from './lib.js';

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

export async function makeStatePreview(c, state = {}) {
	let mediaCount = state[PUB_KEYS.media]?.length || 0;
	let textLength = state[PUB_KEYS.text]?.length || 0;
	let postType = 'text';
	const createdByUser =
		typeof state[PUB_KEYS.dbRecord]?.[PUB_SCHEDULED_KEYS.createdByUserId] ===
			'number' &&
		(await c.ctx[CTX_KEYS.DB_CRUD].getItem(
			DB_TABLE_NAMES.User,
			state[PUB_KEYS.dbRecord][PUB_SCHEDULED_KEYS.createdByUserId],
			{ [USER_KEYS.name]: true },
		));
	const updatedByUser =
		typeof state[PUB_KEYS.dbRecord]?.[PUB_SCHEDULED_KEYS.updatedByUserId] ===
			'number' &&
		(await c.ctx[CTX_KEYS.DB_CRUD].getItem(
			DB_TABLE_NAMES.User,
			state[PUB_KEYS.dbRecord][PUB_SCHEDULED_KEYS.updatedByUserId],
			{ [USER_KEYS.name]: true },
		));

	if (state.media?.length === 1) postType = state.media[0].type;
	// TODO: add
	// else if (state.media?.length > 1) postType = 'media group';

	let res = '';

	if (state[PUB_KEYS.text]) res += `${t(c, 'statePostType')}: ${postType}\n`;
	if (textLength) res += `${t(c, 'stateTextLength')}: ${textLength}\n`;
	// print media count only if there are several media files
	if (mediaCount > 1) res += `${t(c, 'stateMediaCount')}: ${mediaCount}\n`;
	if (state[PUB_KEYS.tags])
		res += `${t(c, 'stateTags')}: ${state[PUB_KEYS.tags].join(', ')}\n`;
	if (!mediaCount && typeof state[PUB_KEYS.preview] == 'boolean')
		res += `${t(c, 'stateUrlPreview')}: ${state[PUB_KEYS.preview] ? '✓' : '𐄂'}\n`;
	if (state[PUB_KEYS.template])
		res += `${t(c, 'stateTemplate')}: ${t(c, 'template-' + state[PUB_KEYS.template])}\n`;
	if (state[PUB_KEYS.author])
		res += `${t(c, 'stateAuthor')}: ${state[PUB_KEYS.author]}\n`;

	if (state[PUB_KEYS.date])
		res += `${t(c, 'stateDate')}: ${makeHumanRuDate(c, state[PUB_KEYS.date])}\n`;
	if (state[PUB_KEYS.time]) {
		res += `${t(c, 'stateTime')}: ${state[PUB_KEYS.time]} (${t(c, 'msk')})\n`;
	}

	if (createdByUser)
		res += `${t(c, 'stateCreator')}: ${createdByUser[USER_KEYS.name]}\n`;
	if (updatedByUser)
		res += `${t(c, 'stateUpdator')}: ${updatedByUser[USER_KEYS.name]}\n`;

	return res.trim();
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

// export function removeNotLetterAndNotNumbersFromStr(str) {
// 	return str.replace(/[^\p{L}\p{N}_]/gu, '');
// }

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

export function makeUserNameFromMsg(msgFrom) {
	if (!msgFrom) return;

	const fullName = [msgFrom?.first_name, msgFrom?.last_name]
		.map((i) => i?.trim())
		.filter(Boolean)
		.join(' ');

	return fullName || msgFrom?.username;
}

export function makeInitialAdminUser(MAIN_ADMIN_TG_USER_ID) {
	return {
		[USER_KEYS.tgUserId]: String(MAIN_ADMIN_TG_USER_ID),
		[USER_KEYS.tgChatId]: String(MAIN_ADMIN_TG_USER_ID),
		[USER_KEYS.name]: 'Owner',
		[USER_KEYS.cfg]: JSON.stringify({
			[USER_CFG_KEYS.authorName]: 'Owner Author',
			[USER_CFG_KEYS.permissions]: {
				[USER_PERMISSIONS_KEYS.admin]: true,
			},
		}),
	};
}

export function makeInviteUserData(c) {
	const userName = makeUserNameFromMsg(c.msg.from) || String(c.msg.from.id);

	return {
		[USER_KEYS.tgUserId]: String(c.msg.from.id),
		[USER_KEYS.tgChatId]: String(c.msg.chat.id),
		[USER_KEYS.name]: userName,
		[USER_KEYS.cfg]: JSON.stringify({
			[USER_CFG_KEYS.authorName]: userName,
		}),
	};
}

export function isUserAdmin(user) {
	let cfg = user[USER_KEYS.cfg];

	if (typeof cfg === 'string') cfg = JSON.parse(cfg);

	return cfg[USER_CFG_KEYS.permissions][USER_PERMISSIONS_KEYS.admin];
}

export async function handleTagsFromInputAndSave(
	router,
	rawText,
	createdByUser,
) {
	let newTags = makeStringArrayUnique(parseTagsFromInput(rawText));

	const theSameTagsInDb = (
		await router.db.getAll(
			DB_TABLE_NAMES.Tag,
			{ [TAG_KEYS.name]: true },
			{
				[TAG_KEYS.name]: {
					in: newTags,
					// equals: newTags.map((i) => ({ [TAG_KEYS.name]: i })),
				},
			},
		)
	).map((i) => i[TAG_KEYS.name]);

	newTags = newTags.filter((i) => !theSameTagsInDb.includes(i));

	await Promise.all(
		newTags.map((tag) =>
			router.db.createItem(DB_TABLE_NAMES.Tag, {
				[TAG_KEYS.name]: tag,
				[TAG_KEYS.socialMedia]: DEFAULT_SOCIAL_MEDIA,
				[TAG_KEYS.createdByUserId]: createdByUser[USER_KEYS.id],
			}),
		),
	);

	return newTags;
}
