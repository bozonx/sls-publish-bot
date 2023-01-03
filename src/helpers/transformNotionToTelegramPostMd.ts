import _ from 'lodash';
import {markdownv2 as mdFormat} from 'telegram-format';
import {NOTION_BLOCK_TYPES} from '../types/notion.js';
import {ROOT_LEVEL_BLOCKS} from '../notionRequests/pageBlocks.js';
import {NotionBlocks} from '../types/notion.js';
import {richTextToMd, richTextToMdCodeBlock, richTextToSimpleTextList} from './transformHelpers.js';


export function transformNotionToTelegramPostMd(notionBlocks: NotionBlocks): string {
  let result = '';
  let numberListCounter = 0;
  let bulletedListCounter = 0;

  for (const block of notionBlocks[ROOT_LEVEL_BLOCKS]) {
    // skip images
    if (block.type === NOTION_BLOCK_TYPES.image) continue;

    if (block.has_children) {
      // TODO: recurse
    }

    if (block.type !== NOTION_BLOCK_TYPES.bulleted_list_item) {
      // if the end of ul block - put line break
      if (bulletedListCounter > 0) result += '\n';

      bulletedListCounter = 0;
    }

    if (block.type !== NOTION_BLOCK_TYPES.numbered_list_item) {
      // if the end of ol block - put line break
      if (numberListCounter > 0) result += '\n';

      numberListCounter = 0;
    }


    switch (block.type) {
      case NOTION_BLOCK_TYPES.heading_1:
        result += mdFormat.bold(
          richTextToSimpleTextList((block as any)?.heading_1?.rich_text
          )) + '\n\n';
        break;
      case NOTION_BLOCK_TYPES.heading_2:
        result += mdFormat.bold(
          richTextToSimpleTextList((block as any)?.heading_2?.rich_text
          )) + '\n\n';
        break;
      case NOTION_BLOCK_TYPES.heading_3:
        result += mdFormat.bold(
          richTextToSimpleTextList((block as any)?.heading_3?.rich_text
          )) + '\n\n';
        break;
      case NOTION_BLOCK_TYPES.paragraph:
        if ((block as any)?.paragraph?.rich_text.length) {
          result += richTextToMd((block as any)?.paragraph?.rich_text) + '\n\n';
        }
        else {
          // empty row
          result += '\n';
        }

        break;
      case NOTION_BLOCK_TYPES.bulleted_list_item:
        bulletedListCounter++;
        result += `\\* `
          + richTextToMd((block as any)?.bulleted_list_item?.rich_text)
          + '\n';

        break;
      case NOTION_BLOCK_TYPES.numbered_list_item:
        numberListCounter++;
        result += `${numberListCounter}\\. `
          + richTextToMd((block as any)?.numbered_list_item?.rich_text)
          + '\n';

        break;
      case NOTION_BLOCK_TYPES.quote:
        result += `\\| `
          + richTextToMd((block as any)?.quote?.rich_text)
            .replace(/\n/g, '\n\\| ')
          + '\n\n';

        break;
      case NOTION_BLOCK_TYPES.code:
        result += '\n'
          + richTextToMdCodeBlock((block as any)?.code?.rich_text, (block as any)?.code?.language)
          + '\n\n';

        break;
      case NOTION_BLOCK_TYPES.divider:
        result += '\\-\\-\\-\n\n';

        break;
      default:
        throw new Error(`Unknown block type: ${block.type}`);
    }

  }

  return _.trim(result);
}
