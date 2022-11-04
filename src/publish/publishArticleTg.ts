import {markdownv2 as mdFormat} from 'telegram-format';
import ContentItem from '../types/ContentItem';
import RawPageContent from '../types/PageContent';
import TgChat from '../apiTg/TgChat';
import {publishPreparedPostTg} from './publishHelpers';
import _ from 'lodash';
import {makeTagsString, makeTelegraPhUrl} from '../helpers/helpers';
import {transformNotionToTelegraph} from '../helpers/transformNotionToTelegraph';


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

  const telegraPhContent = transformNotionToTelegraph(parsedPage.textBlocks);
  const tgPath = await tgChat.app.telegraPh.create(blogName, parsedPage.title, telegraPhContent);
  const articleUrl = makeTelegraPhUrl(tgPath);

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
