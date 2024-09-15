import { toMarkdownV2, escapers } from '@telegraf/entity';
import { prepareTgInputToTgEntities } from './prepareTgInputToTgEntities.js';
import {
	t,
	makeStatePreview,
	makeUserNameFromMsg,
	makeListOfScheduledForDescr,
} from './helpers.js';
import { applyStringTemplate, omitUndefined } from './lib.js';
import { convertDateTimeToTsMinutes } from './dateTimeHelpers.js';
import {
	CTX_KEYS,
	APP_CFG_KEYS,
	PUB_KEYS,
	MEDIA_TYPES,
	USER_KEYS,
	DB_TABLE_NAMES,
	POST_KEYS,
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

	return tags.map((item) => `#${item}`).join(' ');
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

export function makeStateFromMessage(c, prevPubState = {}, isTextInMdV1) {
	let state = {
		[PUB_KEYS.forwardedFrom]:
			c.msg.forward_sender_name ||
			makeUserNameFromMsg(c.msg.forward_from) ||
			// TODO: add channel
			null,
	};

	if (c.msg.video || c.msg.photo) {
		let mediaItem;
		let prevMedia = [];

		if (c.msg.video)
			mediaItem = { type: MEDIA_TYPES.video, data: c.msg.video.file_id };
		else if (c.msg.photo) {
			mediaItem = {
				type: MEDIA_TYPES.photo,
				// the last item is biggest variant, others are thumbnails
				data: c.msg.photo.at(-1).file_id,
			};
		}

		// add other media to media group
		if (
			c.msg.media_group_id &&
			c.msg.media_group_id === prevPubState[PUB_KEYS.media_group_id]
		) {
			prevMedia = prevPubState[PUB_KEYS.media] || [];
		}

		state = {
			...state,
			[PUB_KEYS.media]: [...prevMedia, mediaItem],
			[PUB_KEYS.text]: c.msg.caption,
			[PUB_KEYS.entities]: c.msg.caption_entities,
			[PUB_KEYS.media_group_id]: c.msg.media_group_id,
		};
	} else if (c.msg.text) {
		state = {
			...state,
			[PUB_KEYS.text]: c.msg.text,
			[PUB_KEYS.entities]: c.msg.entities,
			[PUB_KEYS.media_group_id]: null,
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
	// clear entities if it is simple text
	if (state.text && !state.entities) state.entities = null;

	// remove undefined to not overwrite media or text in case it don't need
	return omitUndefined(state);
}

export async function doFullFinalPublicationProcess(
	c,
	pubState,
	forcePublishedByUserName,
) {
	const result = await printFinalPost(
		c,
		c.ctx[CTX_KEYS.DESTINATION_CHANNEL_ID],
		pubState,
	);
	const msgId = Array.isArray(result)
		? result[0]?.message_id
		: result?.message_id;

	return await updatePost(
		c,
		omitUndefined({
			...pubState,
			[PUB_KEYS.date]: null,
			[PUB_KEYS.time]: null,
			[PUB_KEYS.forcePublishedByUserName]: forcePublishedByUserName,
		}),
		{
			[POST_KEYS.pubMsgId]: String(msgId),
			// save current date ad published date
			[POST_KEYS.pubTimestampMinutes]: Math.floor(
				new Date().getTime() / 1000 / 60,
			),
		},
	);
}

export function convertPubStateToDbPost(pubState) {
	const { dbRecord, ...payloadJson } = pubState;

	return {
		...dbRecord,
		payloadJson: JSON.stringify(payloadJson),
	};
}

export function convertDbPostToPubState(dbItem) {
	const { payloadJson, ...dbRecord } = dbItem;

	return {
		dbRecord,
		...JSON.parse(payloadJson),
	};
}

export function makeScheduledItemName(pubState) {
	const fromText = pubState[PUB_KEYS.text]
		?.trim()
		.substring(0, MENU_ITEM_LABEL_LENGTH)
		.trim()
		// remove line breark
		.replace(/\n/g, ' ')
		// remove no words and numeric chars
		// .replace(/[^\p{L}\p{N}_\-\s.,]/gu, ' ')
		.replace(/[^\p{L}\p{N}\s]/gu, ' ')
		// remove space douplicates
		.replace(/[\s]{2,}/g, ' ');

	if (fromText) return fromText;
	else if (pubState[PUB_KEYS.tags]?.length) {
		return pubState[PUB_KEYS.tags].map((i) => `#${i}`).join(' ');
	} else if (pubState[PUB_KEYS.media]?.length) {
		return 'Media';
	}

	return '';
}

export async function printPubToAdminChannel(c, dbRecord) {
	const item = convertDbPostToPubState(dbRecord);
	// publication
	const printRes = await printFinalPost(
		c,
		c.ctx[CTX_KEYS.CHAT_OF_ADMINS_ID],
		item,
	);
	const msgId = Array.isArray(printRes)
		? printRes[0]?.message_id
		: printRes?.message_id;
	const msg = dbRecord[POST_KEYS.pubTimestampMinutes]
		? t(c, 'scheduledInfoMsgToAdminChannel')
		: t(c, 'conservedInfoMsgToAdminChannel');
	// info post
	const infoMsgPostParams = {
		[PUB_KEYS.date]:
			dbRecord[POST_KEYS.pubTimestampMinutes] && item[PUB_KEYS.date],
		[PUB_KEYS.time]:
			dbRecord[POST_KEYS.pubTimestampMinutes] && item[PUB_KEYS.time],
		[PUB_KEYS.dbRecord]: {
			[POST_KEYS.createdByUserId]:
				item[PUB_KEYS.dbRecord]?.[POST_KEYS.createdByUserId],
			[POST_KEYS.updatedByUserId]:
				item[PUB_KEYS.dbRecord]?.[POST_KEYS.updatedByUserId],
		},
	};

	await c.api.sendMessage(
		c.ctx[CTX_KEYS.CHAT_OF_ADMINS_ID],
		msg +
			`\n\n${await makeStatePreview(c, infoMsgPostParams)}` +
			'\n\n----------\n\n' +
			(await makeListOfScheduledForDescr(c)),
		{ reply_parameters: { message_id: msgId } },
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
		return c.api.sendMediaGroup(
			chatId,
			pubState[PUB_KEYS.media].map((item, index) =>
				omitUndefined({
					type: item.type,
					media: item.data,
					caption: index === 0 ? fullPostTextMdV2 : undefined,
					...msgParams,
				}),
			),
		);
	}
	// else no media means text message
	return c.api.sendMessage(chatId, fullPostTextMdV2, {
		...msgParams,
		link_preview_options: {
			is_disabled: !pubState[PUB_KEYS.previewLink],
			url: pubState[PUB_KEYS.previewLink],
			show_above_text: pubState[PUB_KEYS.previewLinkOnTop],
		},
	});
}

export async function updateFinalPost(c, chatId, msgId, pubState) {
	const msgParams = {
		parse_mode: 'MarkdownV2',
	};
	const fullPostTextMdV2 = prepareMdV2MsgTextToPublish(c, pubState);

	if (pubState[PUB_KEYS.media]?.length === 1) {
		// one photo or video
		const { type, data } = pubState[PUB_KEYS.media][0];

		if ([MEDIA_TYPES.photo, MEDIA_TYPES.video].includes(type)) {
			await c.api.editMessageMedia(chatId, msgId, { type, media: data });
		} else {
			throw new Error(`Unsupported type`);
		}
	} else if (pubState[PUB_KEYS.media]?.length > 1) {
		await c.reply(
			`Editing of media group is not supported. Only text was changed`,
		);
	}

	if (pubState[PUB_KEYS.media]?.length) {
		return c.api.editMessageCaption(chatId, msgId, {
			...msgParams,
			caption: fullPostTextMdV2,
		});
	} else {
		return c.api.editMessageText(chatId, msgId, fullPostTextMdV2, {
			...msgParams,
			link_preview_options: {
				is_disabled: !pubState[PUB_KEYS.previewLink],
				url: pubState[PUB_KEYS.previewLink],
				show_above_text: pubState[PUB_KEYS.previewLinkOnTop],
			},
		});
	}
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
		contentMdV2 = escapeMdV2(pubState[PUB_KEYS.text] || '');
	}

	return applyTemplate(c, contentMdV2, pubState);
}

export async function createPost(c, pubState, conserved = false) {
	const dbItem = convertPubStateToDbPost({
		...pubState,
		dbRecord: {
			...pubState[PUB_KEYS.dbRecord],
			name: makeScheduledItemName(pubState),
			socialMedia: DEFAULT_SOCIAL_MEDIA,
			[POST_KEYS.createdByUserId]: c.ctx[CTX_KEYS.me][USER_KEYS.id],
			[POST_KEYS.pubTimestampMinutes]: conserved
				? null
				: convertDateTimeToTsMinutes(
						pubState[PUB_KEYS.date],
						pubState[PUB_KEYS.time],
						c.ctx[CTX_KEYS.PUBLICATION_TIME_ZONE],
					),
		},
	});

	return await c.ctx[CTX_KEYS.DB_CRUD].createItem(DB_TABLE_NAMES.Post, dbItem);
}

export async function updatePost(c, pubState, dbOverwrite) {
	const dbItem = convertPubStateToDbPost({
		...pubState,
		dbRecord: {
			...pubState.dbRecord,
			name: makeScheduledItemName(pubState),
			[POST_KEYS.pubTimestampMinutes]: pubState[PUB_KEYS.date]
				? convertDateTimeToTsMinutes(
						pubState[PUB_KEYS.date],
						pubState[PUB_KEYS.time],
						c.ctx[CTX_KEYS.PUBLICATION_TIME_ZONE],
					)
				: null,
			...dbOverwrite,
		},
	});
	// save to db
	return c.ctx[CTX_KEYS.DB_CRUD].updateItem(DB_TABLE_NAMES.Post, dbItem);
}

export async function deletePost(c, itemId) {
	return await c.ctx[CTX_KEYS.DB_CRUD].deleteItem(DB_TABLE_NAMES.Post, itemId);
}
