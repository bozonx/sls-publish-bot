import {NOTION_RICH_TEXT_TYPES, NotionAnnotation} from '../types/notion.js';
import {html as htmlFormat} from 'telegram-format/dist/source/html.js';
import {TextRichTextItemResponse} from '@notionhq/client/build/src/api-endpoints.js';
import {richTextToPlainText} from './convertHelpers.js';


export function richTextToHtml(richText?: TextRichTextItemResponse[]): string {
  if (!richText) return ''
  else if (!richText.length) return ''

  return richText.map((item: TextRichTextItemResponse) => {
    switch (item.type) {
      case NOTION_RICH_TEXT_TYPES.text:
        return toHtml(item.text.content, item.annotations, item.href)
      default:
        return item.plain_text
    }
  }).join('')
}

export function richTextToHtmlCodeBlock(
  richText: TextRichTextItemResponse[],
  language: string
): string {
  if (!richText.length) return ''

  return htmlFormat.monospaceBlock(richTextToPlainText(richText), language)
}

function toHtml(
  text: string,
  annotations: NotionAnnotation,
  link?: string | null
): string {
  let preparedText = htmlFormat.escape(text)

  if (link) {
    preparedText = htmlFormat.url(preparedText, link)
  }

  for (const index of Object.keys(annotations)) {
    const decorationName = index as keyof NotionAnnotation

    if (annotations[decorationName] !== true) continue

    if (decorationName === 'bold') {
      preparedText = htmlFormat.bold(preparedText)
    }
    else if (decorationName === 'italic') {
      preparedText = htmlFormat.italic(preparedText)
    }
    else if (decorationName === 'strikethrough') {
      // TODO: должно быть s, strike, del
      preparedText = htmlFormat.strikethrough(preparedText)
    }
    else if (decorationName === 'underline') {
      // TODO: u, ins
      preparedText = htmlFormat.underline(preparedText)
    }
    else if (decorationName === 'code') {
      // TODO: должно быть code
      preparedText = htmlFormat.monospace(preparedText)
    }
    // else no formatting
  }

  return preparedText
}
