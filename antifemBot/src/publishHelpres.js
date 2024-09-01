import _ from 'lodash';
import { toMarkdownV2 } from '@telegraf/entity';
// import telegramifyMarkdown from 'telegramify-markdown';
import { CTX_KEYS, APP_CFG_KEYS, STATE_KEYS } from './constants.js';

export function convertMarkDownV1ToTgMdV2(markdownV1) {
	return markdownV1;
	// return telegramifyMarkdown(markdownV1).replace(/\\([\{\}])/g, '$1');
}

export function convertTgEntitiesToTgMdV2(text, entities) {
	return toMarkdownV2({ text, entities });
}

export function generatePostText(c, pubState) {
	const template =
		c.ctx[CTX_KEYS.CONFIG][APP_CFG_KEYS.TEMPLATES][
			pubState[STATE_KEYS.template]
		];
	const contentMdV2 = pubState[STATE_KEYS.text]
		? convertTgEntitiesToTgMdV2(
				pubState[STATE_KEYS.text],
				pubState[STATE_KEYS.entities],
			).trim()
		: '';

	const tmplData = {
		CONTENT: contentMdV2,
		AUTHOR: pubState[STATE_KEYS.author] || '',
		TAGS: makeHashTags(pubState[STATE_KEYS.tags]),
	};

	const text = template
		.map((i) => {
			const tgMdV2Str = convertMarkDownV1ToTgMdV2(i);

			return _.template(tgMdV2Str)(tmplData);
		})
		.filter((i) => i.trim())
		.join('\n\n');

	return text;
}

export async function publishFinalPost(c, chatId, text, usePreview) {
	await c.api.sendMessage(chatId, text, {
		link_preview_options: {
			is_disabled: !usePreview,
		},
		parse_mode: 'MarkdownV2',
		// reply_markup: {
		// },
	});
}

export function makeHashTags(tags) {
	if (!tags) return '';

	return tags.map((item) => `\\#${item}`).join(' ');
}
