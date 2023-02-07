import _ from 'lodash';
import {parseMarkdown} from 'better-telegraph'
import TgChat from '../apiTg/TgChat.js';
import {makeTagsString} from '../lib/common.js';
import {registerTgTaskOnlyText} from './registerTgPost.js';
import {NotionBlocks} from '../types/notion.js';
import {transformCommonMdToTgHtml} from '../helpers/transformCommonMdToTgHtml.js';
import {TelegraphNode} from '../apiTelegraPh/telegraphCli/types.js';
import {transformNotionToTelegraph} from '../helpers/transformNotionToTelegraph.js';


export async function makeFinalArticleNodes(
  blogName: string,
  tgChat: TgChat,
  articleBlocks: NotionBlocks,
): Promise<TelegraphNode[]> {
  const footerStr = tgChat.app.blogs[blogName].sn.telegram?.articleFooter
  const telegraPhContent = await transformNotionToTelegraph(tgChat, articleBlocks)
  // add footer
  if (footerStr) {
    telegraPhContent.push({
      tag: 'p',
      children: [
        '\n',
        ...parseMarkdown(footerStr),
      ],
    })
  }

  return telegraPhContent
}

async function makeArticleTgPostHtml(
  articleTitle: string,
  articleUrl: string,
  articleAnnouncement?: string,
  tgTags?: string[],
  postTmpl?: string,
): Promise<string> {
  let postStr: string
  const tags = makeTagsString(tgTags)

  if (articleAnnouncement) {
    postStr = _.template(articleAnnouncement)({
      TITLE: articleTitle,
      ARTICLE_URL: articleUrl,
    })

    if (tgTags && tgTags.length) {
      postStr += '\n\n' + tags
    }
  }
  else {
    postStr = _.template(postTmpl)({
      TITLE: articleTitle,
      ARTICLE_URL: articleUrl,
      TAGS: tags,
    });
  }

  return await transformCommonMdToTgHtml(postStr) || ''
}

export async function makePublishTaskTgArticle(
  blogName: string,
  tgChat: TgChat,
  isoDate: string,
  time: string,
  articleBlocks: NotionBlocks,
  articleTitle: string,
  tgTags?: string[],
  articleAnnouncement?: string
) {
  const postTmpl = tgChat.app.blogs[blogName].sn.telegram?.articlePostTmpl

  if (!postTmpl) throw new Error(`Telegram config doesn't have article post template`)

  const telegraphNodes = await makeFinalArticleNodes(blogName, tgChat, articleBlocks)

  console.log(111111, telegraphNodes)

  //return

  // create article on telegra.ph
  const articleUrl = await tgChat.app.telegraPh.create(blogName, articleTitle, telegraphNodes)
  const postHtml = await makeArticleTgPostHtml(
    articleTitle,
    articleUrl,
    articleAnnouncement,
    tgTags,
    postTmpl
  )

  await registerTgTaskOnlyText(
    blogName,
    tgChat,
    isoDate,
    time,
    postHtml,
    true
  )
}
