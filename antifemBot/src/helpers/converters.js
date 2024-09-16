import { toHTML, escapers } from '@telegraf/entity';
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
	const res = {};
	const tree = rehype()
		.data('settings', {
			fragment: true,
		})
		.parse(html);

	function recursive(node) {
		if (node.type === 'element' && node.tagName === 'a') {
			const url = node.properties.href?.trim();

			if (url) res[url] = true;
		}

		if (node.children) {
			for (const child of node.children) recursive(child);
		}
	}

	recursive(tree);

	return Object.keys(res);
}

// console.log(
// 	1111,
// 	getLinksFromHtml(
// 		'<p><a href="https://ya.ru">ddd</a></p> dfsdf <a href="https://example.com">tttt</a>',
// 	),
// );
