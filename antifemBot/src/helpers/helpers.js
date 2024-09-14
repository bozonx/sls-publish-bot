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
	POST_KEYS,
	DEFAULT_SOCIAL_MEDIA,
} from '../constants.js';
import {
	makeHumanRuDate,
	makeHumanRuDateCompact,
	getTimeStr,
	makeIsoLocaleDate,
	isoDateToLongLocaleRuDate,
} from './dateTimeHelpers.js';
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
		typeof state[PUB_KEYS.dbRecord]?.[POST_KEYS.createdByUserId] === 'number' &&
		(await c.ctx[CTX_KEYS.DB_CRUD].getItem(
			DB_TABLE_NAMES.User,
			state[PUB_KEYS.dbRecord][POST_KEYS.createdByUserId],
			{ [USER_KEYS.name]: true },
		));
	const updatedByUser =
		typeof state[PUB_KEYS.dbRecord]?.[POST_KEYS.updatedByUserId] === 'number' &&
		(await c.ctx[CTX_KEYS.DB_CRUD].getItem(
			DB_TABLE_NAMES.User,
			state[PUB_KEYS.dbRecord][POST_KEYS.updatedByUserId],
			{ [USER_KEYS.name]: true },
		));

	if (state.media?.length === 1) postType = state.media[0].type;
	else if (state.media?.length > 1) postType = 'media group';

	let res = '';

	if (state[PUB_KEYS.text]) res += `${t(c, 'statePostType')}: ${postType}\n`;
	if (textLength) res += `${t(c, 'stateTextLength')}: ${textLength}\n`;
	// print media count only if there are several media files
	if (mediaCount > 1) res += `${t(c, 'stateMediaCount')}: ${mediaCount}\n`;
	if (state[PUB_KEYS.tags])
		res += `${t(c, 'stateTags')}: ${state[PUB_KEYS.tags].join(', ')}\n`;
	if (!mediaCount && state[PUB_KEYS.previewLink])
		res += `${t(c, 'stateUrlPreview')}: ${state[PUB_KEYS.previewLink]}\n`;
	// res += `${t(c, 'stateUrlPreview')}: ${state[PUB_KEYS.preview] ? '✓' : '𐄂'}\n`;
	if (state[PUB_KEYS.template])
		res += `${t(c, 'stateTemplate')}: ${t(c, 'template-' + state[PUB_KEYS.template])}\n`;
	if (state[PUB_KEYS.author])
		res += `${t(c, 'stateAuthor')}: ${state[PUB_KEYS.author]}\n`;

	if (state[PUB_KEYS.date])
		res += `${t(c, 'stateDate')}: ${makeHumanRuDate(c, state[PUB_KEYS.date], c.ctx[CTX_KEYS.PUBLICATION_TIME_ZONE])}\n`;
	if (state[PUB_KEYS.time]) {
		res += `${t(c, 'stateTime')}: ${state[PUB_KEYS.time]} (${t(c, 'msk')})\n`;
	}

	if (createdByUser)
		res += `${t(c, 'stateCreator')}: ${createdByUser[USER_KEYS.name]}\n`;
	if (updatedByUser)
		res += `${t(c, 'stateUpdator')}: ${updatedByUser[USER_KEYS.name]}\n`;

	return res.trim();
}

export async function makeListOfScheduledForDescr(c) {
	let res = t(c, 'waitForPublicationsListInDescr') + ':\n\n';

	const items = await c.ctx[CTX_KEYS.DB_CRUD].getAll(
		DB_TABLE_NAMES.Post,
		{
			[POST_KEYS.id]: true,
			[POST_KEYS.name]: true,
			[POST_KEYS.pubTimestampMinutes]: true,
		},
		{
			[POST_KEYS.pubMsgId]: null,
			NOT: {
				[POST_KEYS.pubTimestampMinutes]: null,
			},
		},
		[{ [POST_KEYS.pubTimestampMinutes]: 'asc' }],
	);

	for (const item of items) {
		res += makePostItemLabel(c, item) + '\n';
	}

	return res.trim();
}

export function makePostItemLabel(c, dbItem, markStaled = true) {
	const itemName = dbItem[POST_KEYS.name] || t(c, 'itemHasNoContent');
	const itemPubMinutes = dbItem[POST_KEYS.pubTimestampMinutes];
	const curTimeMinutes = new Date().getTime() / 1000 / 60;
	// if staled - use stale mark
	let dateTimeLabel;

	if (
		markStaled &&
		itemPubMinutes <= curTimeMinutes - c.ctx[CTX_KEYS.PUBLISHING_MINUS_MINUTES]
	) {
		dateTimeLabel = t(c, 'staleMark');
	} else {
		dateTimeLabel =
			makeHumanRuDateCompact(
				c,
				makeIsoLocaleDate(
					itemPubMinutes * 60 * 1000,
					c.ctx[CTX_KEYS.PUBLICATION_TIME_ZONE],
				),
				c.ctx[CTX_KEYS.PUBLICATION_TIME_ZONE],
			) +
			' ' +
			getTimeStr(
				c.ctx[CTX_KEYS.PUBLICATION_TIME_ZONE],
				itemPubMinutes * 60 * 1000,
			);
	}

	return `${dateTimeLabel} ${itemName}`;
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
	};
}

export function isUserAdmin(user) {
	let cfg = user[USER_KEYS.cfg];

	if (typeof cfg === 'string') cfg = JSON.parse(cfg);

	return cfg[USER_CFG_KEYS.permissions][USER_PERMISSIONS_KEYS.admin];
}

export async function handleTagsFromInputAndSave(router, rawText) {
	let newTags = makeStringArrayUnique(parseTagsFromInput(rawText));

	const theSameTagsInDb = (
		await router.db.getAll(
			DB_TABLE_NAMES.Tag,
			{ [TAG_KEYS.name]: true },
			{
				[TAG_KEYS.name]: {
					in: newTags,
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
			}),
		),
	);

	return newTags;
}

export function getLinkIds(entities = []) {
	const linkIds = {};

	for (const index in entities) {
		if (['text_link', 'url'].includes(entities[index].type))
			linkIds[entities[index].url] = index;
	}

	return Object.values(linkIds);
}

export function makeCurrentDateTimeStr(c) {
	return (
		`${t(c, 'now')}: ` +
		isoDateToLongLocaleRuDate(
			makeIsoLocaleDate(undefined, c.ctx[CTX_KEYS.PUBLICATION_TIME_ZONE]),
		) +
		' ' +
		getTimeStr(c.ctx[CTX_KEYS.PUBLICATION_TIME_ZONE]) +
		` ${t(c, 'msk')}`
	);
}

// export function removeNotLetterAndNotNumbersFromStr(str) {
// 	return str.replace(/[^\p{L}\p{N}_]/gu, '');
// }

// export function makePostListItemLabel(c, dbItem) {
// 	const itemName = dbItem[POST_KEYS.name];
//
// 	if (!itemName) return t(c, 'itemHasNoContent');
//
// 	const itemPubMinutes = dbItem[POST_KEYS.pubTimestampMinutes];
// 	const curTimeMinutes = new Date().getTime() / 1000 / 60;
// 	// if staled - use stale mark
// 	let dateTimeLabel = t(this.router.c, 'staleMark');
//
// 	if (
// 		itemPubMinutes >
// 		curTimeMinutes - c.ctx[CTX_KEYS.PUBLISHING_MINUS_MINUTES]
// 	) {
// 		// means actual - else use date and time
// 		dateTimeLabel =
// 			makeHumanRuDateCompact(
// 				this.c,
// 				makeIsoLocaleDate(
// 					itemPubMinutes * 60 * 1000,
// 					c.ctx[CTX_KEYS.PUBLICATION_TIME_ZONE],
// 				),
// 			) +
// 			' ' +
// 			getTimeStr(
// 				c.ctx[CTX_KEYS.PUBLICATION_TIME_ZONE],
// 				itemPubMinutes * 60 * 1000,
// 			);
// 	}
//
// 	return `${dateTimeLabel} ${itemName}`;
// }
