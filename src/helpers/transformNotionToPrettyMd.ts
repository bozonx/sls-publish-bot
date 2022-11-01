import {markdownv2 as mdFormat} from 'telegram-format';
import _ from 'lodash';
import {
  BlockObjectResponse,
  TextRichTextItemResponse
} from '@notionhq/client/build/src/api-endpoints';
import {NOTION_BLOCK_TYPES, NOTION_RICH_TEXT_TYPES} from '../types/notion';


export function transformNotionToTelegramPostMd(notionBlocks: BlockObjectResponse[]): string {
  let result = '';
  let numberListCounter = 0;
  let bulletedListCounter = 0;

  for (const block of notionBlocks) {
    if (block.has_children) {
      // TODO: recurse
    }

    if (block.type !== NOTION_BLOCK_TYPES.numbered_list_item) {
      // if the end of ol block
      if (numberListCounter > 0) {
        result += '\n';
      }

      numberListCounter = 0;
    }

    if (block.type !== NOTION_BLOCK_TYPES.bulleted_list_item) {
      // if the end of ul block
      if (bulletedListCounter > 0) {
        result += '\n';
      }

      bulletedListCounter = 0;
    }

    switch (block.type) {
      case NOTION_BLOCK_TYPES.heading_1:
        result += '# ' + richTextToSimpleTextList((block as any)?.heading_1?.rich_text) + '\n\n';

        break;
      case NOTION_BLOCK_TYPES.heading_2:
        result += '## ' + richTextToSimpleTextList((block as any)?.heading_2?.rich_text) + '\n\n';

        break;
      case NOTION_BLOCK_TYPES.heading_3:
        result += '### ' + richTextToSimpleTextList((block as any)?.heading_3?.rich_text) + '\n\n';

        break;
      case NOTION_BLOCK_TYPES.paragraph:
        if ((block as any)?.paragraph?.rich_text.length) {
          result += parseRichTextList((block as any)?.paragraph?.rich_text) + '\n\n';
        }
        else {
          result += '\n';
        }

        break;
      case NOTION_BLOCK_TYPES.bulleted_list_item:
        bulletedListCounter++;
        result += `- ` + parseRichTextList((block as any)?.bulleted_list_item?.rich_text) + '\n';

        break;
      case NOTION_BLOCK_TYPES.numbered_list_item:
        numberListCounter++;
        result += `${numberListCounter}. ` + parseRichTextList((block as any)?.numbered_list_item?.rich_text) + '\n';

        break;
      case NOTION_BLOCK_TYPES.quote:
        result += `> ` + parseRichTextList((block as any)?.quote?.rich_text).replace(/\n/g, '\n> ') + '\n\n';

        break;
      case NOTION_BLOCK_TYPES.code:
        // TODO: проверить требования по экранированию
        result += '\n' + mdFormat.monospaceBlock(richTextToSimpleTextList((block as any)?.code?.rich_text), (block as any)?.code?.language) + '\n\n';

        break;
      case NOTION_BLOCK_TYPES.divider:
        result += '---\n\n';

        break;
      default:
        // TODO: ругаться
        break;
    }
  }

  return _.trim(result);
}


function parseRichTextList(richText?: TextRichTextItemResponse[]): string {
  if (!richText) return '';
  else if (!richText.length) return '';

  let result = '';

  for (const item of richText) {
    result += parseRichText(item)
  }

  return result;
}

function richTextToSimpleTextList(richText?: TextRichTextItemResponse[]): string {
  if (!richText) return '';
  else if (!richText.length) return '';
  let result = '';

  for (const item of richText) {
    result += item.plain_text
  }

  return result;
}

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
