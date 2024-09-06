import { remark } from 'remark';
import remarkRehype from 'remark-rehype';
import html from 'rehype-stringify';
import { parse } from './htmlToTgEntities/html.js';

// got text and entities from tg message and make full correct entities
export function prepareTgInputToTgEntities(srcText, srcEntities) {
	const preparedMdV1 = initialTgEntitiesToMd(srcText, srcEntities);
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
		.processSync(preparedMdV1)
		.toString();

	const [text, entities] = parse(htmlText, 'html');

	return [
		text,
		entities.map((i) => {
			if (i.type === 'textUrl') i.type = 'text_link';

			return { ...i };
		}),
	];
}

function initialTgEntitiesToMd(text, entities) {
	let resHtml = '';
	let prevOffset = 0;

	for (const { offset, length, type } of entities) {
		resHtml += text.substring(prevOffset, offset);

		const textPart = text.substring(offset, offset + length);

		prevOffset = offset + length;

		if (type === 'bold') {
			resHtml += `**${textPart}**`;
		} else if (type === 'code') {
			resHtml += `\`${textPart}\``;
		} else if (type === 'pre') {
			resHtml += '```\n' + textPart + '\n```';
		} else {
			resHtml += textPart;
		}
	}

	resHtml += text.substring(prevOffset, text.length);

	return resHtml;
}

// const testText =
// 	'text bold *italic* [link](https://ya.ru) inline fixed-width code ff\n' +
// 	'\n' +
// 	'> Block quotation started\n' +
// 	'\n' +
// 	'some code\n' +
// 	'\n' +
// 	'end';
// const testEntities = [
// 	{ offset: 5, length: 4, type: 'bold' },
// 	{ offset: 26, length: 13, type: 'url' },
// 	{ offset: 41, length: 23, type: 'code' },
// 	{ offset: 96, length: 9, type: 'pre' },
// ];
// console.log(11111, prepareTgInputToTgEntities(testText, testEntities));
