import {NOTION_RICH_TEXT_TYPES, NotionAnnotation} from '../types/notion.js';
import {markdownv2 as mdFormat} from 'telegram-format/dist/source/markdownv2.js';
import {TextRichTextItemResponse} from '@notionhq/client/build/src/api-endpoints.js';
import {richTextToPlainText} from './convertHelpers.js';


/**
 * Convert rich text to markdown v2
 */
export function richTextToMdV2(richText?: TextRichTextItemResponse[]): string {
  if (!richText) return ''
  else if (!richText.length) return ''

  return richText.map((item: TextRichTextItemResponse) => {
    switch (item.type) {
      case NOTION_RICH_TEXT_TYPES.text:
        return toMarkDownV2(item.text.content, item.annotations, item.href)
      default:
        return item.plain_text
    }
  }).join('')
}

export function richTextToMdV2CodeBlock(
  richText: TextRichTextItemResponse[],
  language: string
): string {
  if (!richText.length) return ''

  return mdFormat.monospaceBlock(richTextToPlainText(richText), language);
}


function toMarkDownV2(
  text: string,
  annotations: NotionAnnotation,
  link?: string | null
): string {
  // escape text for telegram requirements
  let preparedText = mdFormat.escape(text)

  if (link) {
    preparedText = mdFormat.url(preparedText, link)
  }

  for (const index of Object.keys(annotations)) {
    const decorationName = index as keyof NotionAnnotation

    if (annotations[decorationName] !== true) continue

    if (decorationName === 'bold') {
      preparedText = mdFormat.bold(preparedText)
    }
    else if (decorationName === 'italic') {
      preparedText = mdFormat.italic(preparedText)
    }
    else if (decorationName === 'strikethrough') {
      preparedText = mdFormat.strikethrough(preparedText)
    }
    else if (decorationName === 'underline') {
      preparedText = mdFormat.underline(preparedText)
    }
    else if (decorationName === 'code') {
      preparedText = mdFormat.monospace(preparedText)
    }
    // else no formatting
  }

  return preparedText
}
