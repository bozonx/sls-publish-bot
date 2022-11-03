import _ from 'lodash';
import {markdownv2 as mdFormat} from 'telegram-format';
import {NOTION_BLOCK_TYPES} from '../types/notion';
import {ROOT_LEVEL_BLOCKS} from '../notionRequests/pageContent';
import {NOTION_BLOCKS} from '../types/types';
import {richTextToMd, richTextToMdCodeBlock, richTextToSimpleTextList} from './transformHelpers';


export function transformNotionToTelegramPostMd(notionBlocks: NOTION_BLOCKS): string {
  let result = '';
  let numberListCounter = 0;
  let bulletedListCounter = 0;

  for (const block of notionBlocks[ROOT_LEVEL_BLOCKS]) {
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

    if ([
      NOTION_BLOCK_TYPES.heading_1,
      NOTION_BLOCK_TYPES.heading_2,
      NOTION_BLOCK_TYPES.heading_3,
    ].includes(block.type)) {
      result += mdFormat.bold(
        richTextToSimpleTextList((block as any)?.heading_1?.rich_text
        )) + '\n\n';
    }
    else if (block.type === NOTION_BLOCK_TYPES.paragraph) {
      if ((block as any)?.paragraph?.rich_text.length) {
        result += richTextToMd((block as any)?.paragraph?.rich_text) + '\n\n';
      }
      else {
        // empty row
        result += '\n';
      }
    }
    else if (block.type === NOTION_BLOCK_TYPES.bulleted_list_item) {
      bulletedListCounter++;
      result += `\\* `
        + richTextToMd((block as any)?.bulleted_list_item?.rich_text)
        + '\n';
    }
    else if (block.type === NOTION_BLOCK_TYPES.numbered_list_item) {
      numberListCounter++;
      result += `${numberListCounter}\\. `
        + richTextToMd((block as any)?.numbered_list_item?.rich_text)
        + '\n';
    }
    else if (block.type === NOTION_BLOCK_TYPES.quote) {
      result += `\\| `
        + richTextToMd((block as any)?.quote?.rich_text)
          .replace(/\n/g, '\n\\| ')
        + '\n\n';
    }
    else if (block.type === NOTION_BLOCK_TYPES.code) {
      result += '\n'
        + richTextToMdCodeBlock((block as any)?.code?.rich_text, (block as any)?.code?.language)
        + '\n\n';
    }
    else if (block.type === NOTION_BLOCK_TYPES.divider) {
      result += '---\n\n';
    }
    else {
      throw new Error(`Unknown block type: ${block.type}`);
    }
  }

  return _.trim(result);
}
