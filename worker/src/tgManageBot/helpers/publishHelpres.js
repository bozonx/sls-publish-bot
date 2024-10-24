import { convertInputMdV1ToHtml } from './prepareTgInputToTgEntities.js';
import {
	t,
	makeStatePreview,
	makeUserNameFromMsg,
	makeListOfScheduledForDescr,
	getTemplates,
	generatePostName,
} from './helpers.js';
import {
	convertTgEntitiesToTgHtml,
	escapeHtml,
	htmlToCleanText,
} from './converters.js';
import { applyStringTemplate, omitUndefined } from './lib.js';
import { convertDateTimeToTsMinutes } from './dateTimeHelpers.js';
import {
	CTX_KEYS,
	PUB_KEYS,
	MEDIA_TYPES,
	USER_KEYS,
	DB_TABLE_NAMES,
	POST_KEYS,
	SM_KEYS,
	// DEFAULT_SOCIAL_MEDIA,
	POST_NAME_LENGTH,
} from '../constants.js';

export function makeHashTags(tags) {
	if (!tags) return '';

	return tags.map((item) => `#${item}`).join(' ');
}

export function applyTemplate(c, textHtml, pubState) {
	const template = getTemplates()[pubState[PUB_KEYS.template]];

	if (!template) return textHtml;

	let author = '';

	if (pubState[PUB_KEYS.author]) {
		const parts = pubState[PUB_KEYS.author].split('|');
		let url;
		let name;

		if (parts.length > 1 && parts.at(-1).match(/^\s*https?\:\/\//)) {
			url = parts.at(-1).trim();

			const nameParts = [...parts];

			nameParts.pop();

			name = nameParts.join('|').trim();
		} else {
			name = parts.join('|');
		}

		if (url) {
			author = `<a href="${url}">${name}</a>`;
		} else {
			author = escapeHtml(name);
		}
	}

	const tmplData = {
		CONTENT: textHtml,
		AUTHOR: author,
		TAGS: escapeHtml(makeHashTags(pubState[PUB_KEYS.tags])),
	};

	const finalText = template
		.map((i) => applyStringTemplate(i, tmplData))
		.filter((i) => i.trim())
		.join('')
		.trim();

	return finalText;
}

function makeForwardedFrom(c) {
	if (!c.msg?.forward_origin) return null;
	else if (c.msg?.forward_origin.type === 'channel') {
		const username = c.msg.forward_origin.chat.username;
		const title = c.msg.forward_origin.chat.title;

		if (title && !username) return title;
		else if (!title && username) return username;

		return `${title} | https://t.me/${username}/${c.msg.forward_origin.message_id}`;
	}

	return (
		c.msg.forward_sender_name || makeUserNameFromMsg(c.msg.forward_from) || null
	);
}

export function makeStateFromMessage(c, prevPubState = {}, isTextInMdV1) {
	let state = {
		[PUB_KEYS.forwardedFrom]: makeForwardedFrom(c),
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
			[PUB_KEYS.textHtml]: isTextInMdV1
				? convertInputMdV1ToHtml(c.msg.caption, c.msg.caption_entities)
				: convertTgEntitiesToTgHtml(c.msg.caption, c.msg.caption_entities),
			[PUB_KEYS.media_group_id]: c.msg.media_group_id,
		};
	} else if (c.msg.text) {
		state = {
			...state,
			[PUB_KEYS.textHtml]: isTextInMdV1
				? convertInputMdV1ToHtml(c.msg.text, c.msg.entities)
				: convertTgEntitiesToTgHtml(c.msg.text, c.msg.entities),
			[PUB_KEYS.media_group_id]: null,
		};
	} else {
		// returning undefined means wrong type of post
		return;
	}

	// if (isTextInMdV1) {
	// const [text, entities] = prepareTgInputToTgEntities(
	// 	state.text,
	// 	state.entities,
	// );
	//
	// state.text = text;
	// state.entities = entities;
	// }
	// clear entities if it is simple text
	// if (state.text && !state.entities) state.entities = null;

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
		c.ctx[CTX_KEYS.session].sm[SM_KEYS.cfg].DESTINATION_CHANNEL_ID,
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
			[POST_KEYS.publicatedData]: JSON.stringify({ msgId }),
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
	const fromText = generatePostName(
		htmlToCleanText(pubState[PUB_KEYS.textHtml]),
		POST_NAME_LENGTH,
	);

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
		c.ctx[CTX_KEYS.session].sm[SM_KEYS.cfg].CHAT_OF_ADMINS_ID,
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
		c.ctx[CTX_KEYS.session].sm[SM_KEYS.cfg].CHAT_OF_ADMINS_ID,
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
		parse_mode: 'HTML',
	};
	const fullPostTextHtml = applyTemplate(
		c,
		pubState[PUB_KEYS.textHtml],
		pubState,
	);

	if (pubState[PUB_KEYS.media]?.length === 1) {
		// one photo or video
		const { type, data } = pubState[PUB_KEYS.media][0];

		if (type === MEDIA_TYPES.photo) {
			return c.api.sendPhoto(chatId, data, {
				...msgParams,
				caption: fullPostTextHtml,
			});
		} else if (type === MEDIA_TYPES.video) {
			return c.api.sendVideo(chatId, data, {
				...msgParams,
				caption: fullPostTextHtml,
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
					caption: index === 0 ? fullPostTextHtml : undefined,
					...msgParams,
				}),
			),
		);
	}
	// else no media means text message
	return c.api.sendMessage(chatId, fullPostTextHtml, {
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
		parse_mode: 'HTML',
	};
	const fullPostTextHtml = applyTemplate(
		c,
		pubState[PUB_KEYS.textHtml],
		pubState,
	);

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
			caption: fullPostTextHtml,
		});
	} else {
		return c.api.editMessageText(chatId, msgId, fullPostTextHtml, {
			...msgParams,
			link_preview_options: {
				is_disabled: !pubState[PUB_KEYS.previewLink],
				url: pubState[PUB_KEYS.previewLink],
				show_above_text: pubState[PUB_KEYS.previewLinkOnTop],
			},
		});
	}
}

// function prepareMdV2MsgTextToPublish(c, pubState) {
// 	let contentHtml;
// 	// if have entities then transform text to HTML
// 	if (pubState[PUB_KEYS.entities]) {
// 		contentHtml = convertTgEntitiesToTgMdV2(
// 			pubState[PUB_KEYS.text],
// 			pubState[PUB_KEYS.entities],
// 		);
// 	} else {
// 		// escape clean text
// 		contentHtml = escapeMdV2(pubState[PUB_KEYS.text] || '');
// 	}
//
// 	return applyTemplate(c, contentHtml, pubState);
// }

export async function createPost(c, pubState, conserved = false) {
	const dbRecord = { ...pubState[PUB_KEYS.dbRecord] };

	delete dbRecord[POST_KEYS.id];

	const dbItem = convertPubStateToDbPost({
		...pubState,
		dbRecord: {
			...dbRecord,
			name: makeScheduledItemName(pubState),
			[POST_KEYS.createdByUserId]: c.ctx[CTX_KEYS.me][USER_KEYS.id],
			[POST_KEYS.socialMediaId]: c.ctx[CTX_KEYS.session].sm[SM_KEYS.id],
			[POST_KEYS.pubTimestampMinutes]: conserved
				? null
				: convertDateTimeToTsMinutes(
					pubState[PUB_KEYS.date],
					pubState[PUB_KEYS.time],
					c.ctx[CTX_KEYS.session].sm[SM_KEYS.cfg].PUBLICATION_TIME_ZONE,
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
					c.ctx[CTX_KEYS.session].sm[SM_KEYS.cfg].PUBLICATION_TIME_ZONE,
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
