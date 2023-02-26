import {Element, Text} from 'hast'
import {TextRichTextItemResponse} from '@notionhq/client/build/src/api-endpoints.js';
import {NOTION_RICH_TEXT_TYPES, NotionAnnotation} from '../types/notion.js';
import {html as htmlFormat} from 'telegram-format/dist/source/html.js';


export function richTextToHastElements(
  richText?: TextRichTextItemResponse[]
): (Element | Text)[] {
  if (!richText) return []
  else if (!richText.length) return []

  const result: (Element | Text)[] = []

  richText.forEach((item: TextRichTextItemResponse) => {
    if (item.type === NOTION_RICH_TEXT_TYPES.text) {
      if (
        !item.href
        && !item.annotations.bold
        && !item.annotations.italic
        && !item.annotations.strikethrough
        && !item.annotations.underline
        && !item.annotations.code
      ) {
        // means just simple text - change new lines to <br />
        splitNewLines(item.plain_text).forEach((el) => result.push(el))

        return
      }

      result.push(toHastElement(item.text.content, item.annotations, item.href))
    }
    else {
      splitNewLines(item.plain_text).forEach((el) => result.push(el))
    }
  })

  return result
}


function toHastElement(
  text: string,
  annotations: NotionAnnotation,
  link?: string | null
): Element | Text {
  let preparedText: Element | Text = { type: 'text', value: htmlFormat.escape(text) }

  if (link) {
    preparedText = {
      type: 'element',
      tagName: 'a',
      properties: { href: link },
      children: [preparedText],
    }
  }

  for (const index of Object.keys(annotations)) {
    const decorationName = index as keyof NotionAnnotation

    if (annotations[decorationName] !== true) continue

    if (decorationName === 'bold') {
      preparedText = {
        type: 'element',
        tagName: 'b',
        children: [preparedText],
      }
    }
    else if (decorationName === 'italic') {
      preparedText = {
        type: 'element',
        tagName: 'i',
        children: [preparedText],
      }
    }
    else if (decorationName === 'strikethrough') {
      preparedText = {
        type: 'element',
        tagName: 's',
        children: [preparedText],
      }
    }
    else if (decorationName === 'underline') {
      preparedText = {
        type: 'element',
        tagName: 'u',
        children: [preparedText],
      }
    }
    else if (decorationName === 'code') {
      preparedText = {
        type: 'element',
        tagName: 'code',
        children: [preparedText],
      }
    }
    // else no formatting
  }

  return preparedText
}


function splitNewLines(text: string): (Element | Text)[] {
  const result: (Element | Text)[] = []

  if (text.match(/\n/)) {
    const splat = text.split('\n')

    for (const index in splat) {
      result.push({ type: 'text', value: splat[index] })

      if (Number(index) !== splat.length - 1) {
        result.push({ type: 'element', tagName: 'br', children: [] })
      }
    }
  }
  else {
    result.push({ type: 'text', value: text })
  }

  return result
}
