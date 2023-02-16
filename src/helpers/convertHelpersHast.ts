import {Element, Text} from 'hast'
import {TextRichTextItemResponse} from '@notionhq/client/build/src/api-endpoints.js';
import {NOTION_RICH_TEXT_TYPES, NotionAnnotation} from '../types/notion.js';
import {html as htmlFormat} from 'telegram-format/dist/source/html.js';


export function richTextToHastElements(
  richText?: TextRichTextItemResponse[]
): (Element | Text)[] {
  if (!richText) return []
  else if (!richText.length) return []

  return richText.map((item: TextRichTextItemResponse) => {
    switch (item.type) {
      case NOTION_RICH_TEXT_TYPES.text:
        return toHastElement(item.text.content, item.annotations, item.href)
      default:
        return { type: 'text', value: item.plain_text }
    }
  });
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
