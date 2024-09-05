import ShortUniqueId from 'short-unique-id';
import { toMarkdownV2, escapers } from '@telegraf/entity';
import { prepareTgInputToTgEntities } from './prepareTgInputToTgEntities.js';
import {
	CTX_KEYS,
	APP_CFG_KEYS,
	PUB_KEYS,
	MEDIA_TYPES,
	KV_KEYS,
	USER_KEYS,
	EDIT_ITEM_NAME,
} from './constants.js';
import { t, loadFromKv, saveToKv, makeStatePreview } from './helpers.js';
import { applyStringTemplate } from './lib.js';

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

export function applyTemplate(c, textMdV2, templateName, author, tags) {
	const template = c.ctx[CTX_KEYS.config][APP_CFG_KEYS.templates][templateName];
	const tmplData = {
		CONTENT: textMdV2,
		AUTHOR: author || '',
		TAGS: makeHashTags(tags),
	};

	const text = template
		.map((i) => applyStringTemplate(i, tmplData))
		.filter((i) => i.trim())
		.join('\n\n');

	return text;
}

export function makeStateFromMessage(c, isTextInMdV1) {
	let state = {};

	console.log(22223333, c.msg);

	if (c.msg.video) {
		state = {
			[PUB_KEYS.media]: [
				{ type: MEDIA_TYPES.video, data: c.msg.video.file_id },
			],
		};

		if (c.msg.caption) {
			state[PUB_KEYS.text] = c.msg.caption;
			state[PUB_KEYS.entities] = c.msg.caption_entities;
		}
	} else if (c.msg.photo) {
		state = {
			[PUB_KEYS.media]: [
				{
					type: MEDIA_TYPES.photo,
					// the last item is biggest variant, others are thumbnails
					data: c.msg.photo[c.msg.photo.length - 1].file_id,
				},
			],
		};

		if (c.msg.caption) {
			state[PUB_KEYS.text] = c.msg.caption;
			state[PUB_KEYS.entities] = c.msg.caption_entities;
		}
	} else if (c.msg.text) {
		state = {
			[PUB_KEYS.text]: c.msg.text,
			[PUB_KEYS.entities]: c.msg.entities,
		};
	} else {
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

	return state;
}

export async function doFullFinalPublicationProcess(c, item) {
	const msg = await printFinalPost(
		c,
		c.ctx[CTX_KEYS.DESTINATION_CHANNEL_ID],
		item,
	);

	await deleteScheduledPost(c, item.id);

	return msg;
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

// It is used in save button handlers
export async function saveEditedScheduledPost(router) {
	const c = router.c;

	router.state[EDIT_ITEM_NAME] = router.state.pub;

	delete router.state.pub;

	const item = {
		...router.state[EDIT_ITEM_NAME],
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

export async function createScheduledPublication(c, pubState) {
	const uid = new ShortUniqueId({ length: 10 });
	const item = {
		...pubState,
		id: uid.rnd(),
		[PUB_KEYS.publisherName]: c.ctx[CTX_KEYS.me][USER_KEYS.name],
	};
	const allScheduled = (await loadFromKv(c, KV_KEYS.scheduled)) || [];
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
		// TODO: remake
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
	// no media means text message
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

	if (pubState[PUB_KEYS.template]) {
		return applyTemplate(
			c,
			contentMdV2,
			pubState[PUB_KEYS.template],
			pubState[PUB_KEYS.author],
			pubState[PUB_KEYS.tags],
		);
	} else {
		return contentMdV2;
	}
}
