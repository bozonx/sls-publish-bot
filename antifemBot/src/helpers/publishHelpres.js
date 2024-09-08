import { toMarkdownV2, escapers } from '@telegraf/entity';
import { prepareTgInputToTgEntities } from './prepareTgInputToTgEntities.js';
import { t, makeStatePreview, makeUserNameFromMsg } from './helpers.js';
import { applyStringTemplate, omitUndefined } from './lib.js';
import { convertDateTimeToTsMinutes } from './dateTimeHelpers.js';
import {
	CTX_KEYS,
	APP_CFG_KEYS,
	PUB_KEYS,
	MEDIA_TYPES,
	USER_KEYS,
	EDIT_ITEM_NAME,
	DB_TABLE_NAMES,
	PUB_SCHEDULED_KEYS,
	DEFAULT_SOCIAL_MEDIA,
	MENU_ITEM_LABEL_LENGTH,
} from '../constants.js';

export function convertTgEntitiesToTgMdV2(text, entities) {
	return toMarkdownV2({ text, entities });
}

export function escapeMdV2(text) {
	return escapers.MarkdownV2(text);
}

export function makeHashTags(tags) {
	if (!tags) return '';

	return tags.map((item) => `\\#${item}`).join(' ');
}

export function applyTemplate(c, textMdV2, pubState) {
	const template =
		c.ctx[CTX_KEYS.config][APP_CFG_KEYS.templates][pubState[PUB_KEYS.template]];

	if (!template) return textMdV2;

	const tmplData = {
		CONTENT: textMdV2,
		AUTHOR: pubState[PUB_KEYS.author] && escapeMdV2(pubState[PUB_KEYS.author]),
		TAGS: escapeMdV2(makeHashTags(pubState[PUB_KEYS.tags])),
	};

	const finalText = template
		.map((i) => applyStringTemplate(i, tmplData))
		.filter((i) => i.trim())
		.join('')
		.trim();

	return finalText;
}

export function makeStateFromMessage(c, isTextInMdV1) {
	//
	// console.log(22223333, c.msg);

	let state = {
		[PUB_KEYS.forwardedFrom]:
			c.msg.forward_sender_name ||
			makeUserNameFromMsg(c.msg.forward_from) ||
			null,
	};

	if (c.msg.video) {
		state = {
			...state,
			[PUB_KEYS.media]: [
				{ type: MEDIA_TYPES.video, data: c.msg.video.file_id },
			],
			[PUB_KEYS.text]: c.msg.caption,
			[PUB_KEYS.entities]: c.msg.caption_entities,
		};
	} else if (c.msg.photo) {
		state = {
			...state,
			[PUB_KEYS.media]: [
				{
					type: MEDIA_TYPES.photo,
					// the last item is biggest variant, others are thumbnails
					data: c.msg.photo.at(-1).file_id,
				},
			],
			[PUB_KEYS.text]: c.msg.caption,
			[PUB_KEYS.entities]: c.msg.caption_entities,
		};
	} else if (c.msg.text) {
		state = {
			...state,
			[PUB_KEYS.text]: c.msg.text,
			[PUB_KEYS.entities]: c.msg.entities,
		};
	} else {
		// returning undefined means wrong type of post
		return;
	}

	if (isTextInMdV1) {
		const [text, entities] = prepareTgInputToTgEntities(
			state.text,
			state.entities,
		);

		state.text = text;
		state.entities = entities;
	}
	// remove undefined to not overwrite media or text in case it don't need
	return omitUndefined(state);
}

export async function doFullFinalPublicationProcess(c, item) {
	const msg = await printFinalPost(
		c,
		c.ctx[CTX_KEYS.DESTINATION_CHANNEL_ID],
		item,
	);

	await deleteScheduledPost(c, item[PUB_KEYS.dbRecord][PUB_SCHEDULED_KEYS.id]);

	return msg;
}

export async function deleteScheduledPost(c, itemId) {
	return await c.ctx[CTX_KEYS.DB_CRUD].deleteItem(
		DB_TABLE_NAMES.PubScheduled,
		itemId,
	);
}

// It is used in save button handlers
export async function saveEditedScheduledPost(router) {
	const c = router.c;

	router.state[EDIT_ITEM_NAME] = router.state.pub;

	const pubState = router.state[EDIT_ITEM_NAME];

	delete router.state.pub;

	const dbItem = convertPubStateToDbScheduled({
		...pubState,
		dbRecord: {
			...pubState.dbRecord,
			name: makeScheduledItemName(pubState[PUB_KEYS.text]),
			[PUB_SCHEDULED_KEYS.updatedByUserId]: router.me[USER_KEYS.id],
			[PUB_SCHEDULED_KEYS.pubTimestampMinutes]: convertDateTimeToTsMinutes(
				pubState[PUB_KEYS.date],
				pubState[PUB_KEYS.time],
				c.ctx[CTX_KEYS.PUBLICATION_TIME_ZONE],
			),
		},
	});
	// save to db
	await c.ctx[CTX_KEYS.DB_CRUD].updateItem(DB_TABLE_NAMES.PubScheduled, dbItem);
	await router.reply(t(c, 'editedSavedSuccessfully'));

	return router.go('scheduled-item');
}

export async function createScheduledPublication(c, pubState) {
	const dbItem = convertPubStateToDbScheduled({
		...pubState,
		dbRecord: {
			...pubState[PUB_KEYS.dbRecord],
			name: makeScheduledItemName(pubState[PUB_KEYS.text]),
			socialMedia: DEFAULT_SOCIAL_MEDIA,
			[PUB_SCHEDULED_KEYS.createdByUserId]: c.ctx[CTX_KEYS.me][USER_KEYS.id],
			[PUB_SCHEDULED_KEYS.pubTimestampMinutes]: convertDateTimeToTsMinutes(
				pubState[PUB_KEYS.date],
				pubState[PUB_KEYS.time],
				c.ctx[CTX_KEYS.PUBLICATION_TIME_ZONE],
			),
		},
	});

	return await c.ctx[CTX_KEYS.DB_CRUD].createItem(
		DB_TABLE_NAMES.PubScheduled,
		dbItem,
	);
}

export function makeScheduledItemName(text) {
	return (
		text
			?.trim()
			.substring(0, MENU_ITEM_LABEL_LENGTH)
			.trim()
			.replace(/\n/g, ' ')
			.replace(/[\s]{2,}/g, ' ') || undefined
	);
}

export function convertPubStateToDbScheduled(pubState) {
	const { dbRecord, ...payloadJson } = pubState;

	return {
		...dbRecord,
		payloadJson: JSON.stringify(payloadJson),
	};
}

export function convertDbScheduledToPubState(dbItem) {
	const { payloadJson, ...dbRecord } = dbItem;

	return {
		dbRecord,
		...JSON.parse(payloadJson),
	};
}

export async function printPubToAdminChannel(router, dbRecord) {
	const c = router.c;
	const item = convertDbScheduledToPubState(dbRecord);
	// publication
	const { message_id } = await router.printFinalPost(
		c.ctx[CTX_KEYS.CHAT_OF_ADMINS_ID],
		item,
	);
	// const createdByUser = typeof  await router.db.getItem(DB_TABLE_NAMES.User, PUB_KEYS.createdBy)
	// info post
	const infoMsgPostParams = {
		[PUB_KEYS.date]: item[PUB_KEYS.date],
		[PUB_KEYS.time]: item[PUB_KEYS.time],
		[PUB_KEYS.dbRecord]: {
			[PUB_SCHEDULED_KEYS.createdByUserId]:
				item[PUB_KEYS.dbRecord]?.[PUB_SCHEDULED_KEYS.createdByUserId],
			[PUB_SCHEDULED_KEYS.updatedByUserId]:
				item[PUB_KEYS.dbRecord]?.[PUB_SCHEDULED_KEYS.updatedByUserId],
		},
	};

	await c.api.sendMessage(
		c.ctx[CTX_KEYS.CHAT_OF_ADMINS_ID],
		t(c, 'infoMsgToAdminChannel') +
			`\n\n${await makeStatePreview(c, infoMsgPostParams)}`,
		{ reply_parameters: { message_id } },
	);
}

export async function printFinalPost(c, chatId, pubState, replyToMsgId) {
	const msgParams = {
		reply_parameters: replyToMsgId && { message_id: replyToMsgId },
		parse_mode: 'MarkdownV2',
	};
	const fullPostTextMdV2 = prepareMdV2MsgTextToPublish(c, pubState);

	if (pubState[PUB_KEYS.media]?.length === 1) {
		// one photo or video
		const { type, data } = pubState[PUB_KEYS.media][0];

		if (type === MEDIA_TYPES.photo) {
			return c.api.sendPhoto(chatId, data, {
				...msgParams,
				caption: fullPostTextMdV2,
			});
		} else if (type === MEDIA_TYPES.video) {
			return c.api.sendVideo(chatId, data, {
				...msgParams,
				caption: fullPostTextMdV2,
			});
		} else {
			throw new Error(`Unsupported type`);
		}
	} else if (pubState[PUB_KEYS.media]?.length > 1) {
		throw new Error(`Media group is not supported`);
	}
	// else no media means text message
	return c.api.sendMessage(chatId, fullPostTextMdV2, {
		...msgParams,
		link_preview_options: {
			is_disabled: !pubState[PUB_KEYS.preview],
		},
	});
}

function prepareMdV2MsgTextToPublish(c, pubState) {
	let contentMdV2;
	// it have entities then transform text to MD v2
	if (pubState[PUB_KEYS.entities]) {
		contentMdV2 = convertTgEntitiesToTgMdV2(
			pubState[PUB_KEYS.text],
			pubState[PUB_KEYS.entities],
		);
	} else {
		// escape clean text
		contentMdV2 = escapeMdV2(pubState[PUB_KEYS.text]);
	}

	return applyTemplate(c, contentMdV2, pubState);
}
