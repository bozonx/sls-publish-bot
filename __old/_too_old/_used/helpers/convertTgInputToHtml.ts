import {TgEntity} from '../../../../../../../../mnt/disk2/workspace/sls-publish-bot/__old/src/types/TgEntity'
import {EntityMessage} from '../../../../../../../../mnt/disk2/workspace/sls-publish-bot/__old/src/apiTg/EntityMessage';


/**
 * Convert text from telegram input to Mdast tree
 * Trim it by yourself
 */
export function convertTgInputToHtml(rawText: string, entities?: TgEntity[]): string {
  if (!entities?.length) return rawText

  const formatter = new EntityMessage(rawText, entities)

  return formatter.html
}






// \n\nnorm *bold _italic2_*\n _italic_ __underiline__ ~strikethrough~ `monospace`  [https://google.com](https://google.com) [url](https://google.com/) norm
// *bold _it_ ~strikethrough~ [url](https://google.com/)* _ *bold* _i_ ~strikethrough~ [url](https://google.com/)* _ nn
// bold it strikethrough under url (https://google.com/) - it bold strikethrough url (https://google.com/) nn

// const test1 = 'norm bold italic underiline strikethrough monospace spoiler  https://google.com url'
// const entities1 = [
//   { offset: 5, length: 4, type: 'bold' },
//   { offset: 10, length: 6, type: 'italic' },
//   { offset: 17, length: 10, type: 'underline' },
//   { offset: 28, length: 13, type: 'strikethrough' },
//   { offset: 42, length: 9, type: 'code' },
//   { offset: 52, length: 7, type: 'spoiler' },
//   { offset: 61, length: 18, type: 'url' },
//   {
//     offset: 80,
//     length: 3,
//     type: 'text_link',
//     url: 'https://google.com/'
//   }
// ]
// const test2 = 'norm bold it italic underiline striketrough code url'
// const entities2 = [
//   { offset: 5, length: 5, type: 'bold' },
//   { offset: 10, length: 2, type: 'bold' },
//   { offset: 10, length: 2, type: 'italic' },
//   { offset: 13, length: 6, type: 'italic' },
//   { offset: 20, length: 10, type: 'underline' },
//   { offset: 31, length: 12, type: 'strikethrough' },
//   { offset: 44, length: 4, type: 'code' },
//   {
//     offset: 49,
//     length: 3,
//     type: 'text_link',
//     url: 'https://google.com/'
//   }
// ]
// const test3 = 'norm bold it italic'
// const entities3 = [
//   { offset: 5, length: 5, type: 'bold' },
//   { offset: 10, length: 2, type: 'bold' },
//   { offset: 10, length: 2, type: 'italic' },
//   { offset: 13, length: 6, type: 'italic' },
// ] as any
//
//
//
// const test4 =  "bold it strikethrough under url - it bold strikethrough url nn"
// const entities4 =  [
//     {
//       "offset": 0,
//       "length": 5,
//       "type": "bold"
//     },
//     {
//       "offset": 5,
//       "length": 3,
//       "type": "bold"
//     },
//     {
//       "offset": 5,
//       "length": 3,
//       "type": "italic"
//     },
//     // TODO: разные length
//     {
//       "offset": 8,
//       "length": 14,
//       "type": "bold"
//     },
//     {
//       "offset": 8,
//       "length": 13,
//       "type": "italic"
//     },
//     {
//       "offset": 8,
//       "length": 13,
//       "type": "strikethrough"
//     },
//     {
//       "offset": 22,
//       "length": 5,
//       "type": "bold"
//     },
//     {
//       "offset": 22,
//       "length": 5,
//       "type": "underline"
//     },
//     {
//       "offset": 28,
//       "length": 3,
//       "type": "text_link",
//       "url": "https://google.com/"
//     },
//     {
//       "offset": 34,
//       "length": 2,
//       "type": "italic"
//     },
//     {
//       "offset": 37,
//       "length": 5,
//       "type": "italic"
//     },
//     {
//       "offset": 37,
//       "length": 4,
//       "type": "bold"
//     },
//     {
//       "offset": 42,
//       "length": 14,
//       "type": "italic"
//     },
//     {
//       "offset": 42,
//       "length": 13,
//       "type": "strikethrough"
//     },
//     {
//       "offset": 56,
//       "length": 3,
//       "type": "text_link",
//       "url": "https://google.com/"
//     }
//   ]
//
//
// const formatter = new EntityMessage(test4, entities4)
//
// console.log(111, formatter.html)
// console.log(222, formatter.markdown)
