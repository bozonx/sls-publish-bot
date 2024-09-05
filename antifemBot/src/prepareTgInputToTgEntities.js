import { remark } from 'remark';
import remarkRehype from 'remark-rehype';
import html from 'rehype-stringify';
import { parse } from './htmlToTgEntities/html.js';

/*
from tg
	entities: [
		{ offset: 5, length: 4, type: 'bold' },
		{ offset: 10, length: 6, type: 'italic' },
		{ offset: 17, length: 4, type: 'text_link', url: 'https://ya.ru/' },
		{ offset: 23, length: 5, type: 'blockquote' }
	],
 */

// got text and entities from tg message and make full correct entities
export function prepareTgInputToTgEntities(srcText, srcEntities) {
	const htmlText = remark()
		.use(remarkRehype, {
			handlers: {
				code: (state, node) => {
					return {
						type: 'element',
						tagName: 'pre',
						children: [{ type: 'text', value: node.value }],
					};
				},
				strong: (state, node) => {
					return {
						type: 'element',
						tagName: 'b',
						children: node.children,
					};
				},
			},
		})
		.use(html)
		.processSync(textMdV1)
		.toString();

	const [text, entities] = parse(htmlText, 'html');

	console.log(66666, textMdV1, htmlText);

	return [
		text,
		entities.map((i) => {
			if (i.type === 'textUrl') i.type = 'text_link';

			return { ...i };
		}),
	];
}

// console.log(
// 	1111,
// 	convertMdV1ToTgTextAndEntities(
// 		'text **bold** *italic* [link](https://ya.ru) `inline fixed-width code`\n\n>Block quotation started\n\n```\nsome code\n```',
// 	),
// );
