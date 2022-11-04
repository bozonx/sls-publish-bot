import {markdownv2 as mdFormat} from 'telegram-format';
import ContentItem from '../types/ContentItem';
import RawPageContent from '../types/PageContent';
import TgChat from '../apiTg/TgChat';
import {publishPreparedPostTg} from './publishHelpers';
import _ from 'lodash';
import {makeTagsString} from '../helpers/helpers';


export async function publishArticleTg(
  contentItem: ContentItem,
  parsedPage: RawPageContent,
  blogName: string,
  tgChat: TgChat,
  correctedTime?: string,
) {
  const resolvedTime = (correctedTime) ? correctedTime : contentItem.time;
  const tmpl = tgChat.app.config.blogs[blogName].sn.telegram?.articlePostTmpl

  if (!tmpl) throw new Error(`Telegram config doesn't have article post template`);


  // TODO: сделать статью

  //console.log(3333, transformNotionToTelegramPostMd(parsedPage.textBlocks))



  // TODO: add
  const articleUrl = '!!!!URL';

  const postStr = _.template(tmpl)({
    TITLE: parsedPage.title,
    ARTICLE_URL: articleUrl,
    TAGS: mdFormat.escape(makeTagsString(parsedPage.tgTags)),
  });

  await publishPreparedPostTg(
    contentItem.date,
    resolvedTime,
    postStr,
    blogName,
    tgChat,
    true
  );
}
