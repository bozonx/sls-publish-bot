import _ from 'lodash';
import {markdownv2 as mdFormat} from 'telegram-format';
import TgChat from '../apiTg/TgChat.js';
import {makeTelegraPhUrl} from '../helpers/helpers.js';
import {transformNotionToTelegraph} from '../helpers/transformNotionToTelegraph.js';
import {makeTagsString} from '../lib/common.js';
import {makePublishTaskTgOnlyText} from './registerTgPost.js';
import {NotionBlocks} from '../types/notion.js';
import {TelegraphNode} from '../apiTelegraPh/telegraphCli/types.js';


function makeTelegraphArticle(
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
        // TODO: преобразовать ссылки
        footer,
      ],
    })
  }

  return telegraPhContent
}

async function publishArticleToTelegraph(
  blogName: string,
  tgChat: TgChat,
  articleBlocks: NotionBlocks,
  articleTitle: string,
): Promise<string> {
  const telegraphNodes = makeTelegraphArticle(blogName, tgChat, articleBlocks)

  // create article on telegra.ph
  const tgPath = await tgChat.app.telegraPh.create(blogName, articleTitle, telegraphNodes)
  const articleUrl = makeTelegraPhUrl(tgPath)

  return articleUrl
}

function makeArticleTgPost(): string {
  let postStr: string

  if (announcement) {
    postStr = _.template(announcement)({
      TITLE: articleTitle,
      ARTICLE_URL: articleUrl,
    });

    if (tgTags && tgTags.length) {
      postStr += '\n\n' + mdFormat.escape(makeTagsString(tgTags));
    }
  }
  else {
    postStr = _.template(postTmpl)({
      TITLE: articleTitle,
      ARTICLE_URL: articleUrl,
      TAGS: mdFormat.escape(makeTagsString(tgTags)),
    });
  }
}

export async function makePublishTaskTgArticle(
  blogName: string,
  tgChat: TgChat,
  isoDate: string,
  time: string,
  articleBlocks: NotionBlocks,
  articleTitle: string,
  tgTags?: string[],
  announcement?: string,
) {
  const articleUrl = publishArticleToTelegraph(blogName, tgChat, articleBlocks, articleTitle)

  await makePublishTaskTgOnlyText(
    blogName,
    tgChat,
    isoDate,
    time,
    postStr,
    true
  );
}
