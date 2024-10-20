import _ from 'lodash';
import {NOTION_BLOCK_TYPES} from '../../../../../../../../mnt/disk2/workspace/sls-publish-bot/__old/src/types/notion';
import {NotionBlocks} from '../../../../../../../../mnt/disk2/workspace/sls-publish-bot/__old/src/types/notion';
import {richTextToPlainText} from '../../src/helpers/convertHelpers';
import {TextRichTextItemResponse} from '@notionhq/client/build/src/api-endpoints.js';


export function convertNotionToInstagramPost(notionBlocks: NotionBlocks): string {
  let result = '';
  let numberListCounter = 0
  let bulletedListCounter = 0

  for (const block of notionBlocks) {
    let children: string = ''

    // skip images
    if (block.type === NOTION_BLOCK_TYPES.image) continue

    if ((block as any).children) {
      children = convertNotionToInstagramPost((block as any).children)
    }

    if (block.type !== NOTION_BLOCK_TYPES.bulleted_list_item) {
      // if the end of ul block - put line break
      if (bulletedListCounter > 0) result += '\n'

      bulletedListCounter = 0
    }

    if (block.type !== NOTION_BLOCK_TYPES.numbered_list_item) {
      // if the end of ol block - put line break
      if (numberListCounter > 0) result += '\n'

      numberListCounter = 0
    }

    switch (block.type) {
      case NOTION_BLOCK_TYPES.heading_1:
        result += richTextToPlainText((block as any)?.heading_1?.rich_text) + '\n\n'

        break
      case NOTION_BLOCK_TYPES.heading_2:
        result += richTextToPlainText((block as any)?.heading_2?.rich_text) + '\n\n'

        break
      case NOTION_BLOCK_TYPES.heading_3:
        result += richTextToPlainText((block as any)?.heading_3?.rich_text) + '\n\n'

        break
      case NOTION_BLOCK_TYPES.paragraph:
        if ((block as any)?.paragraph?.rich_text.length) {
          result += richTextToInstaTextList((block as any)?.paragraph?.rich_text)
            + children
            + '\n\n'
        }
        else {
          // empty row
          result += '\n'
        }

        break;
      case NOTION_BLOCK_TYPES.bulleted_list_item:
        bulletedListCounter++
        result += `* `
          + richTextToInstaTextList((block as any)?.bulleted_list_item?.rich_text)
          + ((children)
            ? '\n  ' + children.replace(/\n/g, '\n  ')
            : '')
          + '\n'

        break
      case NOTION_BLOCK_TYPES.numbered_list_item:
        numberListCounter++;
        result += `${numberListCounter}. `
          + richTextToInstaTextList((block as any)?.numbered_list_item?.rich_text)
          + ((children)
            ? '\n  ' + children.replace(/\n/g, '\n  ')
            : '')
          + '\n'

        break
      case NOTION_BLOCK_TYPES.quote:
        result += `| `
          + richTextToInstaTextList((block as any)?.quote?.rich_text)
            .replace(/\n/g, '\n| ')
          + '\n\n'

        break
      case NOTION_BLOCK_TYPES.code:
        result += richTextToInstaTextList((block as any)?.code?.rich_text)
          + '\n\n'

        break
      case NOTION_BLOCK_TYPES.divider:
        result += '---\n\n'

        break
      default:
        throw new Error(`Unknown block type: ${block.type}`)
    }

  }

  return _.trim(result)
}

/**
 * Make simple text without formatting from Rich text items
 */
function richTextToInstaTextList(richText?: TextRichTextItemResponse[]): string {
  if (!richText) return '';
  else if (!richText.length) return '';

  return richText.map((item) => {
    return item.plain_text;

    // switch (item.type) {
    //   case NOTION_RICH_TEXT_TYPES.text:
    //     if (item.annotations.bold) {
    //       return sansSerif(item.plain_text, { fontStyle: 'bold' });
    //     }
    //     else if (item.annotations.italic) {
    //       return sansSerif(item.plain_text, { fontStyle: 'italic' });
    //     }
    //     else {
    //       // no formatting
    //       return item.plain_text;
    //     }
    //     //return toMarkDown(item.text.content, item.annotations, item.href);
    //   default:
    //     return item.plain_text;
    // }
  }).join('');
}
