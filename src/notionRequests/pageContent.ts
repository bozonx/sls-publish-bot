import {BlockObjectResponse} from '@notionhq/client/build/src/api-endpoints';
import TgChat from '../apiTg/TgChat';
import {NOTION_BLOCKS} from '../types/types';


export const ROOT_LEVEL_BLOCKS = '0';



// type PageContentResult = [
//   // Result of top objects
//   BlockObjectResponse[],
//   // results of children by parent id
//   Record<string, BlockObjectResponse[]>
// ]


/*
  {
    object: 'block',
    id: '2465ac4b-72d5-4032-927d-5664bb2ee592',
    parent: {
      type: 'database_id',
      database_id: 'f03e1717-ca62-4cd5-81c6-674551d53749'
    },
    created_time: '2022-10-29T09:57:00.000Z',
    last_edited_time: '2022-10-29T18:03:00.000Z',
    created_by: { object: 'user', id: 'dd4d9b08-24f5-4a24-9b36-19a42b496f44' },
    last_edited_by: { object: 'user', id: 'dd4d9b08-24f5-4a24-9b36-19a42b496f44' },
    has_children: true,
    archived: false,
    type: 'child_page',
    child_page: { title: 'заголовокккк' }
  }
 */

export async function loadPageContent(
  pageId: string,
  tgChat: TgChat
): Promise<NOTION_BLOCKS> {
  const blocks: NOTION_BLOCKS = {};

  // It needs to check children
  // const resultPageRootBlock = await this.tgChat.app.notion.api.blocks.retrieve({
  //   block_id: pageId,
  // });

  // Loads children of page
  const topChildren = await tgChat.app.notion.api.blocks.children.list({
    block_id: pageId,
  });

  console.log(1111111, topChildren)

  // TODO: load children

  blocks[ROOT_LEVEL_BLOCKS] = topChildren.results as BlockObjectResponse[];


  return blocks;

  /*
    next_cursor: null,
    has_more: false,
    type: 'block',

   */
  //console.log(222222, JSON.stringify(resultCh.results))


  //throw new Error(`111`)


  // try {
  //   return [(resultPage as any).properties, resultCh.results as any];
  // }
  // catch (e) {
  //   this.tgChat.log.error(`Can't load page (${pageId}) data: ${e}`);
  //
  //   // TODO: what to do in error case ????
  //   // TODO: нужно ли ждать отправки лога ????
  //
  //   throw e;
  // }
}
