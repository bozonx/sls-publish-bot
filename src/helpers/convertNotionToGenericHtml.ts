import _ from 'lodash';
import {NOTION_BLOCK_TYPES} from '../types/notion.js';
import {NotionBlocks} from '../types/notion.js';
import {
  richTextToHtml,
  richTextToHtmlCodeBlock,
  richTextToSimpleTextList, richTextToTelegraphNodes
} from './convertHelpers.js';


export function convertNotionToGenericHtml(blocks: NotionBlocks): string {
  const result: string[] = []
  let ulElIndex = -1
  let olElIndex = -1

  for (const block of blocks) {
    let children: string = ''
    // TODO: что делать с картинкой ???
    // skip images
    if (block.type === NOTION_BLOCK_TYPES.image) continue;

    if ((block as any).children) {
      children = convertNotionToGenericHtml((block as any).children)
    }

    if (block.type !== NOTION_BLOCK_TYPES.bulleted_list_item) {
      ulElIndex = -1;
    }

    if (block.type !== NOTION_BLOCK_TYPES.numbered_list_item) {
      olElIndex = -1;
    }

    switch (block.type) {
      case NOTION_BLOCK_TYPES.heading_1:
        result.push(
          '<h1>'
          + richTextToSimpleTextList((block as any)?.heading_1?.rich_text)
          + '</h1>'
        )

        break
      case NOTION_BLOCK_TYPES.heading_2:
        result.push(
          '<h2>'
          + richTextToSimpleTextList((block as any)?.heading_2?.rich_text)
          + '</h2>'
        )

        break
      case NOTION_BLOCK_TYPES.heading_3:
        result.push(
          '<h3>'
          + richTextToSimpleTextList((block as any)?.heading_3?.rich_text)
          + '</h3>'
        )

        break
      case NOTION_BLOCK_TYPES.paragraph:
        if ((block as any)?.paragraph?.rich_text.length) {
          result.push(
            '<p>'
            + richTextToHtml((block as any)?.paragraph?.rich_text)
            + children
            + '</p>'
          )
        }
        else {
          // empty row
          result.push('<p>\n</p>')
        }

        break
      case NOTION_BLOCK_TYPES.bulleted_list_item:
        const liItem = '<li>'
          + richTextToTelegraphNodes((block as any)?.bulleted_list_item?.rich_text)
          + children
          + '</li>'

        if (ulElIndex === -1) {
          // create new UL
          result.push(`<ul>${liItem}</ul>`)

          ulElIndex = result.length - 1
        } else {
          // TODO: нужно добавить li элемент
          //result[ulElIndex].children?.push(liItem);
        }

        break
      case NOTION_BLOCK_TYPES.numbered_list_item:
        const liItemNum = '<li>'
          + richTextToTelegraphNodes((block as any)?.numbered_list_item?.rich_text)
          + children
          + '</li>'

        if (olElIndex === -1) {
          // create new OL
          result.push(`<ol>${liItemNum}</ol>`)

          olElIndex = result.length - 1
        } else {
          // TODO: нужно добавить li элемент
          //result[olElIndex].children?.push(liItemNum)
        }

        break;
      case NOTION_BLOCK_TYPES.quote:
        result.push(
          `<blockquote>`
          // TODO: проверит переносы строк
          + richTextToHtml((block as any)?.quote?.rich_text)
            //.replace(/\n/g, '\n\\| ')
          + '</blockquote>'
        )

        break
      case NOTION_BLOCK_TYPES.code:
        result.push(
          '<pre>'
          + richTextToHtmlCodeBlock((block as any)?.code?.rich_text, (block as any)?.code?.language)
          + '</pre>'
        )

        break
      case NOTION_BLOCK_TYPES.divider:
        result.push(
          '<hr />'
        )

        break
      default:
        throw new Error(`Unknown block type: ${block.type}`)
    }

  }

  return _.trim(result.join('\n'))
}
