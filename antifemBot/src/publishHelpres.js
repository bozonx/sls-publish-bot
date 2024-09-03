import _ from 'lodash';
import ShortUniqueId from 'short-unique-id';
import { toMarkdownV2 } from '@telegraf/entity';
import {
	CTX_KEYS,
	APP_CFG_KEYS,
	PUB_KEYS,
	MEDIA_TYPES,
	KV_KEYS,
	USER_KEYS,
} from './constants.js';
import { t, loadFromKv, saveToKv, makeStatePreview } from './helpers.js';

export function convertTgEntitiesToTgMdV2(text, entities) {
	return toMarkdownV2({ text, entities });
}

export function makeStateFromMessage(c) {
	let state = {};

	console.log(2222, c.msg);

	// TODO: media group
	// TODO: add STATE_KEYS

	if (c.msg.video) {
		state = {
			[PUB_KEYS.text]: c.msg.caption,
			[PUB_KEYS.entities]: c.msg.caption_entities,
			[PUB_KEYS.media]: [{ type: MEDIA_TYPES.video, data: c.msg.video }],
		};
	} else if (c.msg.photo) {
		state = {
			[PUB_KEYS.text]: c.msg.caption,
			[PUB_KEYS.entities]: c.msg.caption_entities,
			[PUB_KEYS.media]: [
				{ type: MEDIA_TYPES.photo, data: c.msg.photo[c.msg.photo.length - 1] },
			],
		};
		// } else if (c.msg.document) {
		// 	const doc = c.msg.document;
		// 	let docType;
		//
		// 	// if (doc.mime_type.trim().indexOf('image/') === 0) {
		// 	// 	docType = MEDIA_TYPES.photo;
		// 	// }
		// 	// // TODO: проверить
		// 	// else if (doc.mime_type.trim().indexOf('video/') === 0) {
		// 	// 	docType = MEDIA_TYPES.video;
		// 	// } else {
		// 	// 	return;
		// 	// }
		// 	//
		//
		// 	state = {
		// 		[PUB_KEYS.text]: c.msg.caption,
		// 		[PUB_KEYS.entities]: c.msg.caption_entities,
		// 		[PUB_KEYS.media]: [
		// 			// { type: MEDIA_TYPES.photo, data: { file_id: doc.file_id } },
		// 			{ type: MEDIA_TYPES.photo, data: { file_id: doc.file_id } },
		// 		],
		// 	};
	} else if (c.msg.text) {
		state = {
			[PUB_KEYS.text]: c.msg.text,
			[PUB_KEYS.entities]: c.msg.entities,
		};
	} else {
		return;
	}

	return state;
}

export async function doFullFinalPublicationProcess(c, item) {
	// const allItems = await loadFromKv(c, KV_KEYS.scheduled, []);
	// const item = allItems.find((i) => i.id === itemId);

	const { message_id } = await printFinalPost(
		c,
		c.ctx[CTX_KEYS.DESTINATION_CHANNEL_ID],
		item,
	);

	await deleteScheduledPost(c, item.id);

	return item;
}

export async function deleteScheduledPost(c, itemId) {
	const allItems = await loadFromKv(c, KV_KEYS.scheduled, []);
	const prepared = [...allItems];
	const indexOfItem = prepared.findIndex((i) => i.id === itemId);

	if (indexOfItem < 0) throw new Error(`ERROR: Can't find scheduled item`);
	// remove selected tag
	prepared.splice(indexOfItem, 1);

	await saveToKv(c, KV_KEYS.scheduled, prepared);

	return allItems[indexOfItem];
}

export async function saveEditedScheduledPost(router) {
	const c = router.c;

	router.state.editItem = router.state.pub;

	delete router.state.pub;

	const item = {
		...router.state.editItem,
		[PUB_KEYS.publisherName]: router.me[USER_KEYS.name],
	};
	const allScheduled = await loadFromKv(c, KV_KEYS.scheduled);
	const oldItemIndex = allScheduled.findIndex((i) => i.id === item.id);

	if (oldItemIndex < 0) throw new Error(`ERROR: Can't find item while saving`);

	allScheduled[oldItemIndex] = item;

	await saveToKv(c, KV_KEYS.scheduled, allScheduled);
	await router.reply(t(c, 'editedSavedSuccessfully'));

	return router.go('scheduled-item');
}

export async function schedulePublication(c, pubState) {
	const uid = new ShortUniqueId({ length: 10 });
	const item = {
		id: uid.rnd(),
		...pubState,
		[PUB_KEYS.publisherName]: c.ctx[CTX_KEYS.me][USER_KEYS.name],
	};
	const allScheduled = await loadFromKv(c, KV_KEYS.scheduled);
	const prepared = [...allScheduled, item];

	await saveToKv(c, KV_KEYS.scheduled, prepared);

	return item;
}

export async function printPubToAdminChannel(router, item) {
	const c = router.c;

	// publication
	const { message_id } = await router.printFinalPost(
		c.ctx[CTX_KEYS.CHAT_OF_ADMINS_ID],
		item,
	);
	// info post
	const infoMsgPostParams = {
		[PUB_KEYS.date]: item[PUB_KEYS.date],
		[PUB_KEYS.time]: item[PUB_KEYS.time],
		[PUB_KEYS.publisherName]: item[PUB_KEYS.publisherName],
	};

	await c.api.sendMessage(
		c.ctx[CTX_KEYS.CHAT_OF_ADMINS_ID],
		t(c, 'infoMsgToAdminChannel') +
			`\n\n${makeStatePreview(c, infoMsgPostParams)}`,
		{ reply_parameters: { message_id } },
	);
}

export async function printFinalPost(c, chatId, pubState, replyToMsgId) {
	let textMdV2;
	const msgParams = {
		parse_mode: 'MarkdownV2',
		reply_parameters: replyToMsgId && { message_id: replyToMsgId },
	};

	if (pubState[PUB_KEYS.entities]) {
		textMdV2 = convertTgEntitiesToTgMdV2(
			pubState[PUB_KEYS.text],
			pubState[PUB_KEYS.entities],
		);
	} else {
		// clean text
		// TODO: экранировать
		textMdV2 = pubState[PUB_KEYS.text];
	}

	// TODO: наверное всегда прикладывать темплейт
	const fullPostTextMdV2 = pubState[PUB_KEYS.template]
		? applyTemplate(
				c,
				textMdV2,
				pubState.template,
				pubState.author,
				pubState.tags,
			)
		: textMdV2;
	// TODO: add from md

	if (pubState[PUB_KEYS.media]?.length === 1) {
		// one photo or video
		const { type, data } = pubState[PUB_KEYS.media][0];

		if (type === MEDIA_TYPES.photo) {
			return c.api.sendPhoto(chatId, data.file_id, {
				caption: fullPostTextMdV2,
				...msgParams,
			});
		} else if (type === MEDIA_TYPES.video) {
			return c.api.sendVideo(chatId, data.file_id, {
				caption: fullPostTextMdV2,
				...msgParams,
			});
		} else {
			// TODO: use file
			throw new Error(`Unsupported type`);
		}
	} else if (!pubState[PUB_KEYS.media]?.length) {
		// text message
		return c.api.sendMessage(chatId, fullPostTextMdV2, {
			link_preview_options: {
				is_disabled: !pubState[PUB_KEYS.preview],
				// TODO: add certain url
			},
			...msgParams,
		});
	}

	throw new Error(`Unsupported type`);
}

export function applyTemplate(c, textMdV2, templateName, author, tags) {
	const template = c.ctx[CTX_KEYS.config][APP_CFG_KEYS.templates][templateName];
	const tmplData = {
		CONTENT: textMdV2,
		AUTHOR: author || '',
		TAGS: makeHashTags(tags),
	};

	const text = template
		.map((i) => _.template(i)(tmplData))
		.filter((i) => i.trim())
		.join('\n\n');

	return text;
}

export function makeHashTags(tags) {
	if (!tags) return '';

	return tags.map((item) => `\\#${item}`).join(' ');
}

//
// // TODO: remove
// export function generatePostText(c, pubState) {
// 	const template =
// 		c.ctx[CTX_KEYS.config][APP_CFG_KEYS.templates][pubState[PUB_KEYS.template]];
// 	const contentMdV2 = pubState[PUB_KEYS.text]
// 		? convertTgEntitiesToTgMdV2(
// 			pubState[PUB_KEYS.text],
// 			pubState[PUB_KEYS.entities],
// 		).trim()
// 		: '';
//
// 	const tmplData = {
// 		CONTENT: contentMdV2,
// 		AUTHOR: pubState[PUB_KEYS.author] || '',
// 		TAGS: makeHashTags(pubState[PUB_KEYS.tags]),
// 	};
//
// 	const text = template
// 		.map((i) => _.template(i)(tmplData))
// 		.filter((i) => i.trim())
// 		.join('\n\n');
//
// 	return text;
// }
//
// // TODO: remove
// export async function publishFinalPost(
// 	c,
// 	chatId,
// 	text,
// 	usePreview = true,
// 	replyToMsgId,
// ) {
// 	return c.api.sendMessage(chatId, text, {
// 		link_preview_options: {
// 			is_disabled: !usePreview,
// 			// TODO: add certain url
// 		},
// 		parse_mode: 'MarkdownV2',
// 		reply_parameters: { message_id: replyToMsgId },
// 		// reply_to_message: replyToMsg,
// 	});
// }
