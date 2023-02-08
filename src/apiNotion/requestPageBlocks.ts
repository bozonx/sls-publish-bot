import {NotionBlocks} from '../types/notion.js';
import NotionApi from './NotionApi.js';


export async function requestPageBlocks(
  pageId: string,
  notionApi: NotionApi
): Promise<NotionBlocks> {
  // Loads children blocks of page
  const topChildren = await notionApi.api.blocks.children.list({
    block_id: pageId,
  });

  const blocks: NotionBlocks = await recursiveLoadBlocks(
    notionApi,
    topChildren.results as NotionBlocks
  )

  // console.log(22222, blocks)
  // console.log(33333, JSON.stringify(blocks))

  // TODO: почему это объект ??? {'0': [...]}

  return blocks
}


async function recursiveLoadBlocks(
  notionApi: NotionApi,
  blocks: NotionBlocks
): Promise<NotionBlocks> {
  const result: NotionBlocks = []

  for (const block of blocks) {
    if (!block.has_children) {
      result.push(block)

      continue
    }

    const children = (await notionApi.api.blocks.children.list({
      block_id: block.id,
    })).results as NotionBlocks

    result.push({
      ...block,
      children: await recursiveLoadBlocks(notionApi, children),
    } as any)
  }

  return result
}
