import {markdownv2 as mdFormat} from 'telegram-format';
import {RichTextItemResponse, TextRichTextItemResponse} from '@notionhq/client/build/src/api-endpoints.js';
import {NOTION_RICH_TEXT_TYPES, NotionAnnotation} from '../types/notion.js';
import {html as htmlFormat} from 'telegram-format/dist/source/html.js';
import {TelegraphNode} from '../apiTelegraPh/telegraphCli/types.js';
import {pre} from 'telegraf/format';


/**
 * Make simple text without formatting from Rich text items
 */
export function richTextToSimpleTextList(richText?: TextRichTextItemResponse[]): string {
  if (!richText) return '';
  else if (!richText.length) return '';

  return richText.map((item) => item.plain_text).join('');
}

/**
 * Convert rich text to markdown v2
 */
export function richTextToMd(richText?: TextRichTextItemResponse[]): string {
  if (!richText) return '';
  else if (!richText.length) return '';

  return richText.map((item: TextRichTextItemResponse) => {
    switch (item.type) {
      case NOTION_RICH_TEXT_TYPES.text:
        return toMarkDown(item.text.content, item.annotations, item.href);
      default:
        return item.plain_text;
    }
  }).join('');
}

export function richTextToHtml(richText?: TextRichTextItemResponse[]): string {
  if (!richText) return '';
  else if (!richText.length) return '';

  return richText.map((item: TextRichTextItemResponse) => {
    switch (item.type) {
      case NOTION_RICH_TEXT_TYPES.text:
        return toHtml(item.text.content, item.annotations, item.href);
      default:
        return item.plain_text;
    }
  }).join('');
}

export function richTextToTelegraphNodes(
  richText?: TextRichTextItemResponse[]
): (TelegraphNode | string)[] {
  if (!richText) return [];
  else if (!richText.length) return [];

  return richText.map((item: TextRichTextItemResponse) => {
    switch (item.type) {
      case NOTION_RICH_TEXT_TYPES.text:
        return toTelegraPh(item.text.content, item.annotations, item.href);
      default:
        return item.plain_text;
    }
  });
}


export function richTextToMdCodeBlock(
  richText: TextRichTextItemResponse[],
  language: string
): string {
  // TODO: проверить требования по экранированию
  // TODO: что если пусто
  return mdFormat.monospaceBlock(richTextToSimpleTextList(richText), language);
}

export function richTextToHtmlCodeBlock(
  richText: TextRichTextItemResponse[],
  language: string
): string {
  // TODO: проверить требования по экранированию
  // TODO: review - может надо использовать pre
  // TODO: как передать язык программирования???
  // TODO: проверить требования по экранированию
  // TODO: что если пусто
  return richTextToSimpleTextList(richText), language;
}


function toMarkDown(
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
    return htmlFormat.strikethrough(preparedText);
  }
  else if (annotations.underline) {
    return htmlFormat.underline(preparedText);
  }
  else if (annotations.code) {
    return htmlFormat.monospace(preparedText);
  }
  else {
    // no formatting
    return preparedText;
  }
}

function toTelegraPh(
  text: string,
  annotations: NotionAnnotation,
  link?: string | null
): TelegraphNode | string {
  // TODO: need escape???
  let preparedText: TelegraphNode | string = text;

  if (link) {
    preparedText = {
      tag: 'a',
      attrs: {href: link},
      children: [text],
    };
  }

  // TODO: а если несколько сразу ???

  if (annotations.bold) {
    return {
      tag: 'strong',
      children: [preparedText],
    };
  }
  else if (annotations.italic) {
    return {
      tag: 'i',
      children: [preparedText],
    };
  }
  // else if (annotations.underline) {
  //   return {
  //     tag: 'em',
  //     children: [preparedText],
  //   };
  // }
  else if (annotations.code) {
    return {
      tag: 'code',
      children: [preparedText],
    };
  }
  else {
    // no formatting
    return preparedText;
  }
}
