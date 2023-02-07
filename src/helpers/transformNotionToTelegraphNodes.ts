import TgChat from '../apiTg/TgChat.js';
import {NotionBlocks} from '../types/notion.js';
import {TelegraphNode} from '../apiTelegraPh/telegraphCli/types.js';
import {transformNotionToTelegraph} from './transformNotionToTelegraph.js';


// TODO: review by hard
export function transformNotionToTelegraphNodes(
  blogName: string,
  tgChat: TgChat,
  articleBlocks: NotionBlocks,
): TelegraphNode[] {
  const postTmpl = tgChat.app.blogs[blogName].sn.telegram?.articlePostTmpl
  const footer = tgChat.app.blogs[blogName].sn.telegram?.articleFooter

  if (!postTmpl) throw new Error(`Telegram config doesn't have article post template`)

  const telegraPhContent = transformNotionToTelegraph(articleBlocks)
  // add footer
  if (footer) {
    telegraPhContent.push({
      tag: 'p',
      children: [
        '\n',
        // TODO: преобразовать ссылки в node
        footer,
      ],
    })
  }

  return telegraPhContent
}