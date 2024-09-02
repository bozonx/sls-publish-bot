import _ from 'lodash';
import { toMarkdownV2 } from '@telegraf/entity';
import { CTX_KEYS, APP_CFG_KEYS, PUB_KEYS, MEDIA_TYPES } from './constants.js';

export function convertTgEntitiesToTgMdV2(text, entities) {
	return toMarkdownV2({ text, entities });
}


// TODO: move to publish helpers
export function makeContentState(c) {
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


// TODO: move to publish helpers
export function makeContentState(c) {
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
		// 		[PUB_KEYS.entit
		// TODO: remove
		export function generatePostText(c, pubState) {
			const template =
				c.ctx[CTX_KEYS.config][APP_CFG_KEYS.templates][pubState[PUB_KEYS.template]];
			const contentMdV2 = pubState[PUB_KEYS.text]
				? convertTgEntitiesToTgMdV2(
					pubState[PUB_KEYS.text],
					pubState[PUB_KEYS.entities],
				).trim()
				: '';

			const tmplData = {
				CONTENT: contentMdV2,
				AUTHOR: pubState[PUB_KEYS.author] || '',
				TAGS: makeHashTags(pubState[PUB_KEYS.tags]),
			};

			const text = template
				.map((i) => _.template(i)(tmplData))
				.filter((i) => i.trim())
				.join('\n\n');

			return text;
		}

		// TODO: remove
		export async function publishFinalPost(
			c,
			chatId,
			text,
			usePreview = true,
			replyToMsgId,
		) {
			return c.api.sendMessage(chatId, text, {
				link_preview_options: {
					is_disabled: !usePreview,
					// TODO: add certain url
				},
				parse_mode: 'MarkdownV2',
				reply_parameters: { message_id: replyToMsgId },
				// reply_to_message: replyToMsg,
			});
		}

		export async function printFinalPost(c, chatId, pubState, replyToMsgId) {
			let textMdV2;

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
						parse_mode: 'MarkdownV2',
						reply_parameters: replyToMsgId && { message_id: replyToMsgId },
					});
				} else if (type === MEDIA_TYPES.video) {
					return c.api.sendVideo(chatId, data.file_id, {
						caption: fullPostTextMdV2,
						parse_mode: 'MarkdownV2',
						reply_parameters: replyToMsgId && { message_id: replyToMsgId },
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
					parse_mode: 'MarkdownV2',
					reply_parameters: replyToMsgId && { message_id: replyToMsgId },
					// reply_to_message: replyToMsg,
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
