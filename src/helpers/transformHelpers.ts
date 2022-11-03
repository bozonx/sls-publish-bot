import {markdownv2 as mdFormat} from 'telegram-format';
import {TextRichTextItemResponse} from '@notionhq/client/build/src/api-endpoints';
import {NOTION_RICH_TEXT_TYPES} from '../types/notion';


/**
 * Make simple text without formatting from Rich text items
 */
export function richTextToSimpleTextList(richText?: TextRichTextItemResponse[]): string {
  if (!richText) return '';
  else if (!richText.length) return '';

  return richText.map((item) => item.plain_text).join();
}

/**
 * Convert rich text to markdown v2
 */
export function richTextToMd(richText?: TextRichTextItemResponse[]): string {
  if (!richText) return '';
  else if (!richText.length) return '';

  return richText.map((item) => parseRichText(item)).join();
}

export function richTextToMdCodeBlock(richText?: TextRichTextItemResponse[], language: string): string {
  // TODO: проверить требования по экранированию
  return mdFormat.monospaceBlock(richTextToSimpleTextList(richText), language);
}


// TODO: review
function parseRichText(rtItem: TextRichTextItemResponse): string {
  switch (rtItem.type) {
    case NOTION_RICH_TEXT_TYPES.text:
      return toMarkDown(rtItem.text.content, rtItem.annotations, rtItem.href);
    default:
      return rtItem.plain_text;
  }
}

function toMarkDown(text: string, annotations: Record<string, any>, link?: string | null): string {
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
