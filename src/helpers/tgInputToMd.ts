
// TODO: не используется

import {markdownv2 as mdFormat} from 'telegram-format';
import {TgEntity} from '../types/TgEntity.js'


/*
  text: 'norm bold italic underiline strikethrough monospace spoiler  https://google.com url',
  entities: [
    { offset: 5, length: 4, type: 'bold' },
    { offset: 10, length: 6, type: 'italic' },
    { offset: 17, length: 10, type: 'underline' },
    { offset: 28, length: 13, type: 'strikethrough' },
    { offset: 42, length: 9, type: 'code' },
    { offset: 52, length: 7, type: 'spoiler' },
    { offset: 61, length: 18, type: 'url' },
    {
      offset: 80,
      length: 3,
      type: 'text_link',
      url: 'https://google.com/'
    }

 */


/**
 * Convert text from telegram input to MDv2
 * Trim it by yourself
 */
export function tgInputToMd(rawText: string, entities?: TgEntity[]): string {
  const normalized = normalizeTg(rawText, entities)

  return normalized.map((item) => makeMd(item)).join('')
}

//
// function normalizeTg(rawText: string, entities?: TgEntity[]): NormalizedTgItem[] {
//   if (!entities || !entities.length) return [{text: rawText, type: 'text'}]
//
//   const result: NormalizedTgItem[] = []
//   // set the first text part
//   if (entities[0].offset !== 0) {
//     result.push({
//       text: rawText.slice(0, entities[0].offset),
//       type: 'text',
//     })
//   }
//
//   for (const i in entities) {
//     const text = rawText.slice(entities[i].offset, entities[i].offset + entities[i].length)
//
//     if (entities[i].type === 'spoiler') {
//       result.push({ text, type: 'text' })
//     }
//     else if (entities[i].type === 'url') {
//       result.push({ text, type: 'url', url: text })
//     }
//     else if (entities[i].type === 'text_link') {
//       result.push({ text, type: 'url', url: entities[i].url })
//     }
//     else {
//       result.push({ text, type: entities[i].type as SupportedTgEntityType })
//     }
//
//     const theNext = entities[Number(i) + 1]
//
//     if (!theNext) continue
//     // add simple text after it
//     if (entities[i].offset + entities[i].length < theNext.offset) {
//       result.push({
//         text: rawText.slice(
//           entities[i].offset + entities[i].length,
//           theNext.offset
//         ),
//         type: 'text'
//       })
//     }
//   }
//
//   const theLast = entities[entities.length - 1]
//   // add the last line
//   if (theLast.offset + theLast.length < rawText.length) {
//     result.push({
//       text: rawText.slice(
//         theLast.offset + theLast.length,
//         theLast.offset + theLast.length + rawText.length
//       ),
//       type: 'text'
//     })
//   }
//
//   return result
// }

function makeMd(item: NormalizedTgItem): string {
  switch (item.type) {
    case SUPPORTED_TG_ENTITY_TYPES.bold:
      return mdFormat.bold(item.text)
    case SUPPORTED_TG_ENTITY_TYPES.italic:
      return mdFormat.italic(item.text)
    case SUPPORTED_TG_ENTITY_TYPES.underline:
      return mdFormat.underline(item.text)
    case SUPPORTED_TG_ENTITY_TYPES.strikethrough:
      return mdFormat.strikethrough(item.text)
    case SUPPORTED_TG_ENTITY_TYPES.code:
      return mdFormat.monospace(item.text)
    case SUPPORTED_TG_ENTITY_TYPES.url:
      if (item.url) {
        return mdFormat.url(item.text, item.url)
      }
      else {
        return mdFormat.url(item.text, item.text)
      }
    case SUPPORTED_TG_ENTITY_TYPES.text:
      return item.text
    default:
      return ''
  }
}
