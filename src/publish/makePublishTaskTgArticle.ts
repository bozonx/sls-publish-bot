import _ from 'lodash';
import TgChat from '../apiTg/TgChat.js';
import {makeTagsString} from '../lib/common.js';
import {registerTgTaskOnlyText} from './registerTgPost.js';
import {NotionBlocks} from '../types/notion.js';
import {transformNotionToTelegraphNodes} from '../helpers/transformNotionToTelegraphNodes.js';


// TODO: в итоге то должен быть html !!!
function makeArticleTgPostHtml(
  articleTitle: string,
  articleUrl: string,
  articleAnnouncement?: string,
  tgTags?: string[],
  postTmpl?: string,
): string {
  let postStr: string
  //const tags = mdFormat.escape(makeTagsString(tgTags))
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

  // TODO: convert common md to html
  return postStr
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
  const telegraphNodes = transformNotionToTelegraphNodes(blogName, tgChat, articleBlocks)
  // create article on telegra.ph
  const articleUrl = await tgChat.app.telegraPh.create(blogName, articleTitle, telegraphNodes)
  const postHtml = makeArticleTgPostHtml(
    articleTitle,
    articleUrl,
    articleAnnouncement,
    tgTags,
    tgChat.app.blogs[blogName].sn.telegram?.articlePostTmpl
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
