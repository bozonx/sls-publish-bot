import {toHast} from 'mdast-util-to-hast'
import {html as htmlFormat} from 'telegram-format';
import {NormalizedTgItem, SUPPORTED_TG_ENTITY_TYPES, SupportedTgEntityType, TgEntity} from '../src/types/TgEntity'


/**
 * Convert text from telegram input to HTML
 * Trim it by yourself
 */
export function convertTgInputToHtml(rawText: string, entities?: TgEntity[]): string {
  const normalized = normalizeTg(rawText, entities)

  return normalized.map((item) => makeHtml(item)).join('')
}


function normalizeTg(rawText: string, entities?: TgEntity[]): NormalizedTgItem[] {
  if (!entities || !entities.length) return [{text: rawText, type: 'text'}]

  const result: NormalizedTgItem[] = []
  // set the first text part
  if (entities[0].offset !== 0) {
    result.push({
      text: rawText.slice(0, entities[0].offset),
      type: 'text',
    })
  }

  for (const i in entities) {
    const text = rawText.slice(entities[i].offset, entities[i].offset + entities[i].length)

    if (entities[i].type === 'spoiler') {
      result.push({ text, type: 'text' })
    }
    else if (entities[i].type === 'url') {
      result.push({ text, type: 'url', url: text })
    }
    else if (entities[i].type === 'text_link') {
      result.push({ text, type: 'url', url: entities[i].url })
    }
    else {
      result.push({ text, type: entities[i].type as SupportedTgEntityType })
    }

    const theNext = entities[Number(i) + 1]

    if (!theNext) continue
    // add simple text after it
    if (entities[i].offset + entities[i].length < theNext.offset) {
      result.push({
        text: rawText.slice(
          entities[i].offset + entities[i].length,
          theNext.offset
        ),
        type: 'text'
      })
    }
  }

  const theLast = entities[entities.length - 1]
  // add the last line
  if (theLast.offset + theLast.length < rawText.length) {
    result.push({
      text: rawText.slice(
        theLast.offset + theLast.length,
        theLast.offset + theLast.length + rawText.length
      ),
      type: 'text'
    })
  }

  return result
}

function makeHtml(item: NormalizedTgItem): string {
  switch (item.type) {
    case SUPPORTED_TG_ENTITY_TYPES.bold:
      return htmlFormat.bold(item.text)
    case SUPPORTED_TG_ENTITY_TYPES.italic:
      return htmlFormat.italic(item.text)
    case SUPPORTED_TG_ENTITY_TYPES.underline:
      return htmlFormat.underline(item.text)
    case SUPPORTED_TG_ENTITY_TYPES.strikethrough:
      return htmlFormat.strikethrough(item.text)
    case SUPPORTED_TG_ENTITY_TYPES.code:
      return htmlFormat.monospace(item.text)
    case SUPPORTED_TG_ENTITY_TYPES.url:
      if (item.url) {
        return htmlFormat.url(item.text, item.url)
      }
      else {
        return htmlFormat.url(item.text, item.text)
      }
    case SUPPORTED_TG_ENTITY_TYPES.text:
      return item.text
    default:
      return ''
  }
}



//const test1 = '\n\nnorm *bold _italic2_*\n _italic_ __underiline__ ~strikethrough~ `monospace`  [https://google.com](https://google.com) [url](https://google.com/) norm'
const test1 = 'norm bold italic underiline strikethrough monospace spoiler  https://google.com url'
const entities1 = [
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
]

console.log(111, convertTgInputToHtml(test1, entities1 as any))




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
  ]

  text: 'norm bold it italic underiline striketrough code url',
  entities: [
    { offset: 5, length: 5, type: 'bold' },
    { offset: 10, length: 2, type: 'bold' },
    { offset: 10, length: 2, type: 'italic' },
    { offset: 13, length: 6, type: 'italic' },
    { offset: 20, length: 10, type: 'underline' },
    { offset: 31, length: 12, type: 'strikethrough' },
    { offset: 44, length: 4, type: 'code' },
    {
      offset: 49,
      length: 3,
      type: 'text_link',
      url: 'https://google.com/'
    }
  ]

 */

// TODO: не поддерживается вложенный i в b
// yarn ts-node --esm ./src/helpers/convertTgInputToHtml.ts

// console.log(111,
//   convertTgInputToHtml(
//     'norm bold it italic underiline striketrough code url',
//       [
//       { offset: 5, length: 5, type: 'bold' },
//       { offset: 10, length: 2, type: 'bold' },
//       { offset: 10, length: 2, type: 'italic' },
//       { offset: 13, length: 6, type: 'italic' },
//       { offset: 20, length: 10, type: 'underline' },
//       { offset: 31, length: 12, type: 'strikethrough' },
//       { offset: 44, length: 4, type: 'code' },
//       {
//         offset: 49,
//         length: 3,
//         type: 'text_link',
//         url: 'https://google.com/'
//       }
//     ]
//   )
// )
