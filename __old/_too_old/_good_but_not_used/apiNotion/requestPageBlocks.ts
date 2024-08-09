import {NotionBlocks} from '../../../../../../../../mnt/disk2/workspace/sls-publish-bot/__old/src/types/notion';
import NotionApi from '../../../../../../../../mnt/disk2/workspace/sls-publish-bot/__old/src/apiNotion/NotionApi';


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
