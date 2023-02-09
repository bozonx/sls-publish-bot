import _ from 'lodash'
import {html as htmlFormat} from 'telegram-format'
import {NOTION_BLOCK_TYPES} from '../types/notion.js'
import {NotionBlocks} from '../types/notion.js'
import {
  richTextToHtml,
  richTextToHtmlCodeBlock,
  richTextToSimpleTextList
} from './convertHelpers.js'


export function convertNotionToTgHtml(notionBlocks: NotionBlocks): string {
  let result = ''
  let numberListCounter = 0
  let bulletedListCounter = 0

  for (const block of notionBlocks) {
    let children: string = ''
    // skip images
    if (block.type === NOTION_BLOCK_TYPES.image) continue

    if ((block as any).children) {
      children = convertNotionToTgHtml((block as any).children)
    }

    if (block.type !== NOTION_BLOCK_TYPES.bulleted_list_item) {
      // if the end of ul block - put line break
      if (bulletedListCounter > 0) result += '\n'

      bulletedListCounter = 0
    }

    if (block.type !== NOTION_BLOCK_TYPES.numbered_list_item) {
      // if the end of ol block - put line break
      if (numberListCounter > 0) result += '\n';

      numberListCounter = 0;
    }


    switch (block.type) {
      case NOTION_BLOCK_TYPES.heading_1:
        result += htmlFormat.bold(
          richTextToSimpleTextList((block as any)?.heading_1?.rich_text
          )) + '\n\n';
        break;
      case NOTION_BLOCK_TYPES.heading_2:
        result += htmlFormat.bold(
          richTextToSimpleTextList((block as any)?.heading_2?.rich_text
          )) + '\n\n';
        break;
      case NOTION_BLOCK_TYPES.heading_3:
        result += htmlFormat.bold(
          richTextToSimpleTextList((block as any)?.heading_3?.rich_text
          )) + '\n\n';
        break;
      case NOTION_BLOCK_TYPES.paragraph:
        if ((block as any)?.paragraph?.rich_text.length) {
          result += richTextToHtml((block as any)?.paragraph?.rich_text)
            + children
            + '\n\n';
        }
        else {
          // empty row
          result += '\n'
        }

        break;
      case NOTION_BLOCK_TYPES.bulleted_list_item:
        bulletedListCounter++;
        result += `* `
          + richTextToHtml((block as any)?.bulleted_list_item?.rich_text)
          + ((children)
            ? '\n  ' + children.replace(/\n/g, '\n  ')
            : '')
          + '\n'

        break;
      case NOTION_BLOCK_TYPES.numbered_list_item:
        numberListCounter++
        result += `${numberListCounter}. `
          + richTextToHtml((block as any)?.numbered_list_item?.rich_text)
          + ((children)
            ? '\n  ' + children.replace(/\n/g, '\n  ')
            : '')
          + '\n'

        break;
      case NOTION_BLOCK_TYPES.quote:
        result += `| `
          + richTextToHtml((block as any)?.quote?.rich_text)
            .replace(/\n/g, '\n| ')
          + children
          + '\n\n';

        break
      case NOTION_BLOCK_TYPES.code:
        result += '\n'
          + richTextToHtmlCodeBlock((block as any)?.code?.rich_text, (block as any)?.code?.language)
          + children
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
