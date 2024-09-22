import { InlineKeyboard } from 'grammy';
import locales from '../i18n.js';
import {
	makeHumanRuDate,
	makeHumanRuDateCompact,
	getTimeStr,
	makeIsoLocaleDate,
	isoDateToLongLocaleRuDate,
} from './dateTimeHelpers.js';
import { updatePost, applyTemplate } from './publishHelpres.js';
import { htmlToCleanText } from './converters.js';
import { makeStringArrayUnique } from './lib.js';
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
	// DEFAULT_SOCIAL_MEDIA,
	MAX_MEDIA_COUNT,
	MAX_CAPTION_LENGTH,
	MAX_TEXT_POST_LENGTH,
	EDIT_ITEM_NAME,
} from '../constants.js';

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

export function exscidedPostTextLimit(fullPostLength, mediaCount = 0) {
	if (mediaCount) return fullPostLength > MAX_CAPTION_LENGTH;

	return fullPostLength > MAX_TEXT_POST_LENGTH;
}

export function calculateTextLengths(c, pubState) {
	const contentLength = htmlToCleanText(pubState[PUB_KEYS.textHtml])?.length;
	const fullPostLength =
		pubState[PUB_KEYS.template] &&
		htmlToCleanText(applyTemplate(c, pubState[PUB_KEYS.textHtml], pubState))
			?.length;

	return [contentLength, fullPostLength];
}

export async function makeStatePreview(c, state = {}) {
	const mediaCount = state[PUB_KEYS.media]?.length || 0;
	const mediaLimitWarn = mediaCount > MAX_MEDIA_COUNT ? ' ‼️' : '';
	const [contentLength, fullPostLength] = calculateTextLengths(c, state);
	// const contentLength = htmlToCleanText(state[PUB_KEYS.textHtml])?.length;
	// const fullPostLength =
	// 	state[PUB_KEYS.template] &&
	// 	htmlToCleanText(applyTemplate(c, state[PUB_KEYS.textHtml], state))?.length;
	const contentLimitWarn = exscidedPostTextLimit(contentLength, mediaCount)
		? ' ‼️'
		: '';
	const fullTextLimitWarn = exscidedPostTextLimit(fullPostLength, mediaCount)
		? ' ‼️'
		: '';
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
	if (contentLength)
		res += `${t(c, 'stateContentLength')}: ${contentLength}${contentLimitWarn}\n`;
	if (fullPostLength)
		res += `${t(c, 'stateFullPostLength')}: ${fullPostLength}${fullTextLimitWarn}\n`;
	// print media count only if there are several media files
	if (mediaCount > 1)
		res += `${t(c, 'stateMediaCount')}: ${mediaCount}${mediaLimitWarn}\n`;
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

	if (createdByUser) {
		res += `${t(c, 'stateCreator')}: ${createdByUser[USER_KEYS.name]}\n`;
		if (
			updatedByUser &&
			updatedByUser[USER_KEYS.id] !== createdByUser[USER_KEYS.id]
		)
			res += `${t(c, 'stateUpdator')}: ${updatedByUser[USER_KEYS.name]}\n`;
		if (
			state[PUB_KEYS.forcePublishedByUserName] &&
			state[PUB_KEYS.forcePublishedByUserName] !== createdByUser[USER_KEYS.name]
		)
			res += `${t(c, 'stateForcePublishedBy')}: ${state[PUB_KEYS.forcePublishedByUserName]}\n`;
		if (
			state[PUB_KEYS.chandedTimeByUserName] &&
			state[PUB_KEYS.chandedTimeByUserName] !== createdByUser[USER_KEYS.name]
		)
			res += `${t(c, 'stateChangedTimeBy')}: ${state[PUB_KEYS.chandedTimeByUserName]}\n`;
	}

	return res.trim();
}

export async function makeListOfScheduledForDescr(c) {
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

	if (!items.length) return t(c, 'noAwaitPublicationsInDescr');

	let res = t(c, 'waitForPublicationsListInDescr') + ':\n\n';

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

// export function makeInitialAdminUser(MAIN_ADMIN_TG_USER_ID) {
// 	return {
// 		[USER_KEYS.tgUserId]: String(MAIN_ADMIN_TG_USER_ID),
// 		[USER_KEYS.tgChatId]: String(MAIN_ADMIN_TG_USER_ID),
// 		[USER_KEYS.name]: 'Owner',
// 		[USER_KEYS.cfg]: JSON.stringify({
// 			[USER_CFG_KEYS.authorName]: 'Owner Author',
// 			[USER_CFG_KEYS.permissions]: {
// 				[USER_PERMISSIONS_KEYS.admin]: true,
// 			},
// 		}),
// 	};
// }

export function makeNewTgUser(c) {
	return {
		[USER_KEYS.tgUserId]: String(c.msg.from.id),
		[USER_KEYS.tgChatId]: String(c.msg.chat.id),
		[USER_KEYS.name]: makeUserNameFromMsg(c.msg.from) || String(c.msg.from.id),
		// TODO: может взять его ???
		[USER_KEYS.lang]: 'ru',
		[USER_KEYS.cfg]: '{}',
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
				// TODO: no DEFAULT_SOCIAL_MEDIA
				// [TAG_KEYS.socialMedia]: DEFAULT_SOCIAL_MEDIA,
			}),
		),
	);

	return newTags;
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

export async function handleEditedPostSave(router) {
	const c = router.c;

	if (router.state.saveIt) {
		let dbItem;
		const pub = router.state.pub;

		if (
			router.state[EDIT_ITEM_NAME][PUB_KEYS.date] &&
			(pub[PUB_KEYS.date] !== router.state[EDIT_ITEM_NAME][PUB_KEYS.date] ||
				pub[PUB_KEYS.time] !== router.state[EDIT_ITEM_NAME][PUB_KEYS.time])
		) {
			pub[PUB_KEYS.chandedTimeByUserName] = router.me[USER_KEYS.name];
		} else {
			dbItem = {
				[POST_KEYS.updatedByUserId]: router.me[USER_KEYS.id],
			};
		}

		router.state[EDIT_ITEM_NAME] = pub;

		await updatePost(c, pub, dbItem);
		await router.reply(t(c, 'editedSavedSuccessfully'));
	}

	delete router.state.pub;
	delete router.state.saveIt;
	delete router.state.editReturnUrl;

	return router.state[EDIT_ITEM_NAME];
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
