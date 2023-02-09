import {NOTION_RICH_TEXT_TYPES, NotionAnnotation} from '../types/notion.js';
import {markdownv2 as mdFormat} from 'telegram-format/dist/source/markdownv2.js';
import {TextRichTextItemResponse} from '@notionhq/client/build/src/api-endpoints.js';
import {richTextToSimpleTextList} from './convertHelpers.js';


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

  return mdFormat.monospaceBlock(richTextToSimpleTextList(richText), language);
}


function toMarkDownV2(
  text: string,
  annotations: NotionAnnotation,
  link?: string | null
): string {
  // escape text for telegram requirements
  let preparedText = mdFormat.escape(text);

  if (link) {
    preparedText = mdFormat.url(preparedText, link);
  }

  // TODO: а если несколько сразу ???

  if (annotations.bold) {
    return mdFormat.bold(preparedText);
  }
  else if (annotations.italic) {
    return mdFormat.italic(preparedText);
  }
  else if (annotations.strikethrough) {
    return mdFormat.strikethrough(preparedText);
  }
  else if (annotations.underline) {
    return mdFormat.underline(preparedText);
  }
  else if (annotations.code) {
    return mdFormat.monospace(preparedText);
  }
  else {
    // no formatting
    return preparedText;
  }
}
