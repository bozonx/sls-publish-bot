import _ from 'lodash';
import {parseMarkdown, NodeElement} from 'better-telegraph'
import TgChat from '../apiTg/TgChat.js';
import {makeTagsString} from '../lib/common.js';
import {registerTgTaskOnlyText} from './registerTgPost.js';
import {NotionBlocks} from '../types/notion.js';
import {convertCommonMdToTgHtml} from '../helpers/convertCommonMdToTgHtml.js';
import {convertNotionToTelegraph} from '../helpers/convertNotionToTelegraph.js';
import {trimPageBlocks} from '../helpers/convertHelpers.js';


export async function makeFinalArticleNodes(
  blogName: string,
  tgChat: TgChat,
  articleBlocks: NotionBlocks,
): Promise<NodeElement[]> {
  const footerStr = tgChat.app.blogs[blogName].sn.telegram?.articleFooter
  const trimmedArticle = trimPageBlocks(articleBlocks)
  const telegraPhContent = await convertNotionToTelegraph(
    trimmedArticle,
    (url: string) => tgChat.app.telegraPh.uploadImage(url)
  )
  // add footer
  if (footerStr) {
    const convertedFooter = parseMarkdown(footerStr) as any[]

    if (convertedFooter[convertedFooter.length - 1] === '\n') {
      convertedFooter?.pop()
    }

    telegraPhContent.push({
      tag: 'p',
      children: [
        '\n',
        ...convertedFooter,
      ],
    })
  }

  return telegraPhContent
}

function makeArticleTgPostHtml(
  articleTitle: string,
  articleUrl: string,
  articleAnnouncement?: string,
  tgTags?: string[],
  postTmpl?: string,
): string {
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

  return convertCommonMdToTgHtml(postStr) || ''
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

  // create article on telegra.ph
  const articleUrl = await tgChat.app.telegraPh.create(blogName, articleTitle, telegraphNodes)
  const postHtml = makeArticleTgPostHtml(
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
