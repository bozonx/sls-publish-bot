import { toMarkdownV2, toHTML, escapers } from '@telegraf/entity';
import { toString } from 'hast-util-to-string';
import { rehype } from 'rehype';

// export function convertTgEntitiesToTgMdV2(text, entities) {
// 	return toMarkdownV2({ text, entities });
// }

export function convertTgEntitiesToTgHtml(text, entities) {
	return toHTML({ text, entities });
}

export function escapeMdV2(text) {
	return escapers.MarkdownV2(text);
}

export function escapeHtml(text) {
	return escapers.HTML(text);
}

export function htmlToCleanText(html) {
	const tree = rehype().parse(html);

	return toString(tree);
}

export function getLinksFromHtml(html) {
	const res = [];

	// TODO: deduplicate

	return res;
}

// console.log(1111, htmlToCleanText('<p><b>sdfsdf </b>dssdf</p>'));
//
// export function getLinkIds(entities = []) {
// 	const linkIds = {};
//
// 	for (const index in entities) {
// 		if (['text_link', 'url'].includes(entities[index].type))
// 			linkIds[entities[index].url] = index;
// 	}
//
// 	return Object.values(linkIds);
// }
