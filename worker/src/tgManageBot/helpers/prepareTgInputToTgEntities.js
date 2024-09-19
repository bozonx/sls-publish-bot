import { remark } from 'remark';
import remarkRehype from 'remark-rehype';
import rehypeRewrite from 'rehype-rewrite';
import rehypeStringify from 'rehype-stringify';

export function convertInputMdV1ToHtml(srcText, srcEntities = []) {
	if (!srcText || !srcText.trim()) return srcText;

	const preparedMdV1 = initialTgEntitiesToMd(srcText, srcEntities);
	const htmlText = remark()
		.data('settings', {
			fragment: true,
		})
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
				break: (state, node) => {
					return {
						type: 'text',
						value: '\n',
					};
				},
			},
		})
		// unwrap <p>
		.use(rehypeRewrite, {
			rewrite: (node, index, parent) => {
				if (node.type !== 'element') return;

				if (
					['ul', 'ol', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(
						node.tagName,
					)
				) {
					node.type = 'root';

					delete node.tagName;
				} else if (node.tagName === 'li') {
					node.type = 'root';

					node.children = [
						{
							type: 'text',
							value: '* ',
						},
						...node.children,
					];

					delete node.tagName;
				}
			},
		})
		.use(rehypeStringify)
		.processSync(preparedMdV1)
		.toString();

	return htmlText;
}

function initialTgEntitiesToMd(text, entities) {
	let resHtml = '';
	let prevOffset = 0;

	for (const { offset, length, type } of entities) {
		// prev clean part
		resHtml += text.substring(prevOffset, offset);
		// stylized part
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
	// last clean part
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
// console.log(11111, convertInputMdV1ToHtml(testText, testEntities));
// console.log(11111, convertInputMdV1ToHtml(`ss\n\n* ff\n* rr\n\nyy`));

// // got text and entities from tg message and make full correct entities
// export function prepareTgInputToTgEntities(srcText, srcEntities) {
// 	if (!srcText || !srcEntities) return [srcText, srcEntities];
//
// 	const preparedMdV1 = initialTgEntitiesToMd(srcText, srcEntities);
// 	const htmlText = remark()
// 		.use(remarkRehype, {
// 			handlers: {
// 				code: (state, node) => {
// 					return {
// 						type: 'element',
// 						tagName: 'pre',
// 						children: [{ type: 'text', value: node.value }],
// 					};
// 				},
// 				strong: (state, node) => {
// 					return {
// 						type: 'element',
// 						tagName: 'b',
// 						children: node.children,
// 					};
// 				},
// 			},
// 		})
// 		.use(html)
// 		.processSync(preparedMdV1)
// 		.toString();
//
// 	const [text, entities] = parse(htmlText, 'html');
//
// 	return [
// 		text,
// 		entities.map((i) => {
// 			// fix url element
// 			if (i.type === 'textUrl') i.type = 'text_link';
//
// 			return { ...i };
// 		}),
// 	];
// }
