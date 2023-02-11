import {SupportedTgEntityType, TgEntity} from '../types/TgEntity.js'
import {MdastNode, MdastRoot} from 'hast-util-to-mdast/lib';
import {convertMdastToHtml} from './convertCommonMdToTgHtml.js';


/**
 * Convert text from telegram input to Mdast tree
 * Trim it by yourself
 */
export function convertTgInputToMdast(rawText: string, entities?: TgEntity[]): MdastRoot {
  if (!entities || !entities.length) return {
    type: 'root',
    children: [{ type: 'text', value: rawText }]
  }

  const result: MdastNode[] = []
  // set the first text part
  if (entities[0].offset !== 0) {
    result.push({
      value: rawText.slice(0, entities[0].offset),
      type: 'text',
    })
  }

  // TODO: ещё есть большой code

  for (const i in entities) {
    const current = entities[i]
    // skip the empty
    if (!current) continue

    const theNext = entities[Number(i) + 1]
    //let theNextType: SupportedTgEntityType | undefined
    const value = rawText.slice(current.offset, current.offset + current.length)

    // // Remove the next if it has the same position
    // if (current.offset === theNext?.offset && current.length === theNext?.length) {
    //   // @ts-ignore
    //   entities[Number(i) + 1] = undefined
    //   theNextType = theNext.type as any
    // }

    // TODO: use theNextType

    if (current.type === 'spoiler') {
      result.push({ type: 'text', value })
    }
    else if (current.type === 'url') {
      result.push({ type: 'link', url: value, children: [{ type: 'text', value }] })
    }
    else if (current.type === 'text_link') {
      result.push({
        type: 'link',
        url: current.url || '',
        children: [{ type: 'text', value }]
      })
    }
    else if (current.type === 'bold') {
      result.push({
        type: 'strong',
        children: [{ type: 'text', value }]
      })
    }
    else if (current.type === 'italic') {
      result.push({
        type: 'emphasis',
        children: [{ type: 'text', value }]
      })
    }
    else if (current.type === 'strikethrough') {
      result.push({
        type: 'delete',
        children: [{ type: 'text', value }]
      })
    }
    else if (current.type === 'underline') {
      // TODO: не поддерживается почему-то
      result.push({
        type: 'text',
        value
      })
    }
    else if (current.type === 'code') {
      result.push({
        type: 'inlineCode',
        value,
      })
    }
    else {
      result.push({ type: 'text', value })
    }

    if (!theNext) continue
    // add simple text after it
    if (current.offset + current.length < theNext.offset) {
      result.push({
        type: 'text',
        value: rawText.slice(
          current.offset + current.length,
          theNext.offset
        ),
      })
    }
  }

  const theLast = entities[entities.length - 1]
  // add the last line
  if (theLast.offset + theLast.length < rawText.length) {
    result.push({
      type: 'text',
      value: rawText.slice(
        theLast.offset + theLast.length,
        theLast.offset + theLast.length + rawText.length
      )
    })
  }

  return {
    type: 'root',
    children: result as any
  }
}

// function makeInlineEl() {
//
// }

// TODO: проверить вложенность b в i

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
const test2 = 'norm bold it italic underiline striketrough code url'
const entities2 = [
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
const test3 = 'norm bold it italic underiline striketrough code url'
const entities3 = [
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

const mdast = convertTgInputToMdast(test3, entities3 as any)

console.log(111, mdast)
console.log(222, convertMdastToHtml(mdast))
