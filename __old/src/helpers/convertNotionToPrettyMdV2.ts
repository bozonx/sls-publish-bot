import _ from 'lodash';
import {NOTION_BLOCK_TYPES} from '../types/notion';
import {NotionBlocks} from '../types/notion';
import {richTextToPlainText} from './convertHelpers';
import {richTextToMdV2, richTextToMdV2CodeBlock} from './convertHelpersMdV2';
import {makeMdImageString} from './convertHelpers';


export function convertNotionToPrettyMdV2(notionBlocks: NotionBlocks, skipImage = false): string {
  let result = ''
  let numberListCounter = 0
  let bulletedListCounter = 0

  for (const block of notionBlocks) {
    let children: string = ''

    if ((block as any).children) {
      children = convertNotionToPrettyMdV2((block as any).children)
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
      case NOTION_BLOCK_TYPES.image:
        if (skipImage) continue

        result += makeMdImageString(
          // TODO: поидее надо загрузить на telegraph, а то может быть expire
          (block as any)?.image?.file.url,
          (block as any)?.image?.caption?.[0]?.plain_text,
        )

        break
      case NOTION_BLOCK_TYPES.heading_1:
        result += '# '
          + richTextToPlainText((block as any)?.heading_1?.rich_text)
          + '\n\n'
        break
      case NOTION_BLOCK_TYPES.heading_2:
        result += '## '
          + richTextToPlainText((block as any)?.heading_2?.rich_text)
          + '\n\n'
        break
      case NOTION_BLOCK_TYPES.heading_3:
        result += '### '
          + richTextToPlainText((block as any)?.heading_3?.rich_text)
          + '\n\n'
        break
      case NOTION_BLOCK_TYPES.paragraph:
        if ((block as any)?.paragraph?.rich_text.length) {
          result += richTextToMdV2((block as any)?.paragraph?.rich_text)
            + children
            + '\n\n'
        }
        else {
          // empty row
          result += '\n'
        }

        break
      case NOTION_BLOCK_TYPES.bulleted_list_item:
        bulletedListCounter++
        result += `* `
          + richTextToMdV2((block as any)?.bulleted_list_item?.rich_text)
          + ((children)
            ? '\n  ' + children.replace(/\n/g, '\n  ')
            : '')
          + '\n'

        break
      case NOTION_BLOCK_TYPES.numbered_list_item:
        numberListCounter++;
        result += `${numberListCounter}. `
          + richTextToMdV2((block as any)?.numbered_list_item?.rich_text)
          + ((children)
            ? '\n  ' + children.replace(/\n/g, '\n  ')
            : '')
          + '\n'

        break
      case NOTION_BLOCK_TYPES.quote:
        result += `> `
          + richTextToMdV2((block as any)?.quote?.rich_text)
            .replace(/\n/g, '\n> ')
          + '\n\n'

        break
      case NOTION_BLOCK_TYPES.code:
        result += '\n'
          + richTextToMdV2CodeBlock((block as any)?.code?.rich_text, (block as any)?.code?.language)
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
