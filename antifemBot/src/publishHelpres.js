import _ from 'lodash';
import { toMarkdownV2 } from '@telegraf/entity';
import { CTX_KEYS, APP_CFG_KEYS, PUB_KEYS } from './constants.js';

export function convertTgEntitiesToTgMdV2(text, entities) {
	return toMarkdownV2({ text, entities });
}

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

export async function publishFinalPost(c, chatId, text, usePreview = true) {
	await c.api.sendMessage(chatId, text, {
		link_preview_options: {
			is_disabled: !usePreview,
			// TODO: add certain url
		},
		parse_mode: 'MarkdownV2',
	});
}

export function makeHashTags(tags) {
	if (!tags) return '';

	return tags.map((item) => `\\#${item}`).join(' ');
}
