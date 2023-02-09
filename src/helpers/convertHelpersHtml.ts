import {NOTION_RICH_TEXT_TYPES, NotionAnnotation} from '../types/notion.js';
import {html as htmlFormat} from 'telegram-format/dist/source/html.js';
import {TextRichTextItemResponse} from '@notionhq/client/build/src/api-endpoints.js';
import {richTextToSimpleTextList} from './convertHelpers.js';


export function richTextToHtml(richText?: TextRichTextItemResponse[]): string {
  // TODO: review
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

  return htmlFormat.monospaceBlock(richTextToSimpleTextList(richText), language)
}

function toHtml(
  text: string,
  annotations: NotionAnnotation,
  link?: string | null
): string {
  let preparedText = htmlFormat.escape(text);

  if (link) {
    preparedText = htmlFormat.url(preparedText, link);
  }

  // TODO: а если несколько сразу ???

  if (annotations.bold) {
    return htmlFormat.bold(preparedText);
  }
  else if (annotations.italic) {
    return htmlFormat.italic(preparedText);
  }
  else if (annotations.strikethrough) {
    // TODO: должно быть s, strike, del
    return htmlFormat.strikethrough(preparedText);
  }
  else if (annotations.underline) {
    // TODO: u, ins
    return htmlFormat.underline(preparedText);
  }
  else if (annotations.code) {
    // TODO: должно быть code
    return htmlFormat.monospace(preparedText);
  }
  else {
    // no formatting
    return preparedText;
  }
}