import {TextRichTextItemResponse} from '@notionhq/client/build/src/api-endpoints.js';
import {TelegraphNode} from '../../_useless/telegraphCli/types.js';
import {NOTION_RICH_TEXT_TYPES, NotionAnnotation} from '../types/notion.js';


export function richTextToTelegraphNodes(
  richText?: TextRichTextItemResponse[]
): (TelegraphNode | string)[] {
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
  else if (annotations.strikethrough) {
    return {
      tag: 's',
      children: [preparedText],
    };
  }
  else if (annotations.underline) {
    return {
      tag: 'u',
      children: [preparedText],
    };
  }
  else if (annotations.code) {
    return {
      tag: 'code',
      children: [preparedText],
    };
  }
  else {
    // no formatting for other case
    return preparedText;
  }
}
