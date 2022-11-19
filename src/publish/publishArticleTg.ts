import _ from 'lodash';
import {markdownv2 as mdFormat} from 'telegram-format';
import TgChat from '../apiTg/TgChat';
import {makeTelegraPhUrl} from '../helpers/helpers';
import {transformNotionToTelegraph} from '../helpers/transformNotionToTelegraph';
import {makeTagsString} from '../lib/common';
import {makePublishTaskTgOnlyText} from './makePublishTaskTg';
import {NotionBlocks} from '../types/notion';


export async function publishArticleTg(
  blogName: string,
  tgChat: TgChat,
  isoDate: string,
  time: string,
  articleBlocks: NotionBlocks,
  articleTitle: string,
  tgTags: string[],
  announcement?: string,
) {
  const postTmpl = tgChat.app.config.blogs[blogName].sn.telegram?.articlePostTmpl;
  const footer = tgChat.app.config.blogs[blogName].sn.telegram?.articleFooter;

  if (!postTmpl) throw new Error(`Telegram config doesn't have article post template`);

  const telegraPhContent = transformNotionToTelegraph(articleBlocks);
  // add footer
  if (footer) {
    telegraPhContent.push({
      tag: 'p',
      children: [
        '\n',
        ...footer,
      ],
    });
  }

  // create article on telegra.ph
  const tgPath = await tgChat.app.telegraPh.create(blogName, articleTitle, telegraPhContent);
  const articleUrl = makeTelegraPhUrl(tgPath);
  let postStr: string;

  if (announcement) {
    postStr = _.template(announcement)({
      TITLE: articleTitle,
      ARTICLE_URL: articleUrl,
    });

    if (tgTags.length) {
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

  await makePublishTaskTgOnlyText(
    isoDate,
    time,
    postStr,
    blogName,
    tgChat,
    true
  );
}
