import {NodeElement} from 'better-telegraph';
import {html as htmlFormat} from 'telegram-format/dist/source/html.js';
import {TextRichTextItemResponse} from '@notionhq/client/build/src/api-endpoints.js';
import {NOTION_RICH_TEXT_TYPES, NotionAnnotation} from '../types/notion';


export function richTextToTelegraphNodes(
  richText?: TextRichTextItemResponse[]
): (NodeElement | string)[] {
  if (!richText) return []
  else if (!richText.length) return []

  return richText.map((item: TextRichTextItemResponse) => {
    switch (item.type) {
      case NOTION_RICH_TEXT_TYPES.text:
        return toTelegraPh(item.text.content, item.annotations, item.href)
      default:
        return item.plain_text
    }
  });
}


function toTelegraPh(
  text: string,
  annotations: NotionAnnotation,
  link?: string | null
): NodeElement | string {
  let preparedText: NodeElement | string = htmlFormat.escape(text)

  if (link) {
    preparedText = {
      tag: 'a',
      attrs: {href: link},
      children: [preparedText],
    };
  }

  for (const index of Object.keys(annotations)) {
    const decorationName = index as keyof NotionAnnotation

    if (annotations[decorationName] !== true) continue

    if (decorationName === 'bold') {
      preparedText = {
        tag: 'b',
        children: [preparedText],
      }
    }
    else if (decorationName === 'italic') {
      preparedText = {
        tag: 'i',
        children: [preparedText],
      }
    }
    else if (decorationName === 'strikethrough') {
      preparedText = {
        tag: 's',
        children: [preparedText],
      }
    }
    else if (decorationName === 'underline') {
      preparedText = {
        tag: 'u',
        children: [preparedText],
      }
    }
    else if (decorationName === 'code') {
      preparedText = {
        tag: 'code',
        children: [preparedText],
      }
    }
    // else no formatting
  }

  return preparedText
}
