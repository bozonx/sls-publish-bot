import {NOTION_BLOCK_TYPES} from '../types/notion.js';
import {TelegraphNode} from '../../_useless/telegraphCli/types.js';
import {NotionBlocks} from '../types/notion.js';
import {richTextToSimpleTextList} from './convertHelpers.js';
import TgChat from '../apiTg/TgChat.js';
import {richTextToTelegraphNodes} from './convertHelpersTelegraPh.js';


//const aa = 'форматированный текст _ наклонный _ * жирный * __ подчёркнутый __ ~ перечёркнутый ~'


export async function convertNotionToTelegraph(
  tgChat: TgChat,
  blocks: NotionBlocks
): Promise<TelegraphNode[]> {
  const result: TelegraphNode[] = []
  let ulElIndex = -1
  let olElIndex = -1

  for (const block of blocks) {
    let children: TelegraphNode[] = []

    if ((block as any).children) {
      children = await convertNotionToTelegraph(tgChat, (block as any).children)
    }

    if (block.type !== NOTION_BLOCK_TYPES.bulleted_list_item) {
      ulElIndex = -1;
    }

    if (block.type !== NOTION_BLOCK_TYPES.numbered_list_item) {
      olElIndex = -1;
    }

    switch (block.type) {
      case NOTION_BLOCK_TYPES.image:
        const telegraphImgUrl = await tgChat.app.telegraPh.uploadImage((block as any).image.file.url)
        const caption = richTextToTelegraphNodes((block as any).image.caption)

        if (caption.length) {
          result.push({
            tag: 'figure',
            children: [
              {
                tag: 'img',
                attrs: {
                  src: telegraphImgUrl,
                },
              },
              {
                tag: 'figcaption',
                children: caption
              }
            ]
          })
        } else {
          result.push({
            tag: 'img',
            attrs: {
              src: telegraphImgUrl,
              alt: 'alt',
              title: 'title',
            }
          })
        }

        break
      case NOTION_BLOCK_TYPES.heading_1:
        result.push({
          tag: 'h3',
          children: [richTextToSimpleTextList((block as any)?.heading_1?.rich_text)],
        })

        break
      case NOTION_BLOCK_TYPES.heading_2:
        result.push({
          tag: 'h3',
          children: [richTextToSimpleTextList((block as any)?.heading_2?.rich_text)],
        })

        break;
      case NOTION_BLOCK_TYPES.heading_3:
        result.push({
          tag: 'h4',
          children: [richTextToSimpleTextList((block as any)?.heading_3?.rich_text)],
        })

        break;
      case NOTION_BLOCK_TYPES.paragraph:
        if ((block as any)?.paragraph?.rich_text.length) {
          result.push({
            tag: 'p',
            children: [
              ...richTextToTelegraphNodes((block as any)?.paragraph?.rich_text),
              ...children,
            ]
          });
        } else {
          // empty row
          result.push({
            tag: 'p',
            children: ['\n'],
          })
        }
        break;
      case NOTION_BLOCK_TYPES.bulleted_list_item:
        const liItem: TelegraphNode = {
          tag: 'li',
          children: [
            ...richTextToTelegraphNodes((block as any)?.bulleted_list_item?.rich_text),
            ...children,
          ],
        };

        if (ulElIndex === -1) {
          // create new UL
          result.push({
            tag: 'ul',
            children: [liItem],
          });

          ulElIndex = result.length - 1;
        } else {
          result[ulElIndex].children?.push(liItem);
        }

        break;
      case NOTION_BLOCK_TYPES.numbered_list_item:
        const liItemNum: TelegraphNode = {
          tag: 'li',
          children: [
            ...richTextToTelegraphNodes((block as any)?.numbered_list_item?.rich_text),
            ...children,
          ],
        };

        if (olElIndex === -1) {
          // create new OL
          result.push({
            tag: 'ol',
            children: [liItemNum],
          });

          olElIndex = result.length - 1;
        } else {
          result[olElIndex].children?.push(liItemNum);
        }

        break;
      case NOTION_BLOCK_TYPES.quote:
        result.push({
          tag: 'blockquote',
          children: [
            ...richTextToTelegraphNodes((block as any)?.quote?.rich_text),
            ...children,
          ],
        })

        break;
      case NOTION_BLOCK_TYPES.code:
        result.push({
          tag: 'pre',
          attrs: {lang: (block as any)?.code?.language},
          children: [
            richTextToSimpleTextList((block as any)?.code?.rich_text),
            ...children,
          ],
        });

        break;
      case NOTION_BLOCK_TYPES.divider:
        result.push({
          tag: 'hr',
        });

        break;
      default:
        throw new Error(`Unknown block type: ${block.type}`);
    }
  }

  return result
}