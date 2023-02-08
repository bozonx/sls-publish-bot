// @ts-ignore
import {BlockObjectResponse} from '@notionhq/client/build/src/api-endpoints';
import {NotionBlocks} from '../types/notion.js';
import NotionApi from './NotionApi.js';
import {ROOT_LEVEL_BLOCKS} from './constants.js';


export async function requestPageBlocks(
  pageId: string,
  notionApi: NotionApi
): Promise<NotionBlocks> {
  // Loads children blocks of page
  const topChildren = await notionApi.api.blocks.children.list({
    block_id: pageId,
  });

  const blocks: BlockObjectResponse[] = await recursiveLoadBlocks(
    notionApi,
    topChildren.results as BlockObjectResponse[]
  )

  // console.log(22222, blocks)
  // console.log(33333, JSON.stringify(blocks))

  // TODO: почему это объект ??? {'0': [...]}

  return {[ROOT_LEVEL_BLOCKS]: blocks}
}


async function recursiveLoadBlocks(
  notionApi: NotionApi,
  blocks: BlockObjectResponse[]
): Promise<BlockObjectResponse[]> {
  const result: BlockObjectResponse[] = []

  for (const block of blocks) {
    if (!block.has_children) {
      result.push(block)

      continue
    }

    const children = (await notionApi.api.blocks.children.list({
      block_id: block.id,
    })).results

    result.push({
      ...block,
      children: await recursiveLoadBlocks(notionApi, children),
    })
  }

  return result
}
