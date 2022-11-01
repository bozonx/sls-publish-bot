import RawPageContent from '../types/PageContent';
import ContentItem, {PUBLICATION_TYPES, SN_TYPES} from '../types/ContentItem';
import {FULL_DATE_FORMAT} from '../types/constants';
import TgChat from '../apiTg/TgChat';
import {publishTgPost} from '../apiTg/publishTgPost';
import moment from 'moment';
import {TASK_TYPES} from '../types/TaskItem';
import {transformNotionToTelegramPostMd} from '../helpers/transformNotionToTelegramPostMd';


// TODO: review, refactor


export async function publishFork(
  contentItem: ContentItem,
  parsedPage: RawPageContent,
  blogName: string,
  tgChat: TgChat
) {
  // post like
  if ([
    PUBLICATION_TYPES.post1000,
    PUBLICATION_TYPES.post2000,
    PUBLICATION_TYPES.mem,
  ].includes(contentItem.type)) {
    let msgId: number;

    console.log(22222222, parsedPage.textBlocks)

    // TODO: почему только в телеграм????

    try {
      await tgChat.app.tg.bot.telegram.sendMessage(
        tgChat.app.config.logChannelId,
        tgChat.app.i18n.message.prePublishInfo
        + tgChat.app.config.blogs[blogName].dispname + ', '
        + moment(contentItem.date).format(FULL_DATE_FORMAT) + ' '
        + contentItem.time,
      )

      msgId = await publishTgPost(
        tgChat.app.config.logChannelId,
        transformNotionToTelegramPostMd(parsedPage.textBlocks),
        blogName,
        tgChat
      );
    }
    catch (e) {
      await tgChat.app.channelLog.error(`Can't publish post to log channel`);

      throw e;
    }

    const chatId = tgChat.app.config.blogs[blogName].sn.telegram?.channelId;

    if (!chatId) {
      throw new Error(`Telegram chat id doesn't set`);
    }

    tgChat.app.tasks.addTask({

      // TODO: use post's time

      startTime: '2022-10-30T14:10:00+03:00',
      type: TASK_TYPES.postponePost,
      chatId,
      blogUname: blogName,
      sn: SN_TYPES.telegram,
      forwardMessageId: msgId,
    });
  }
  // photos like
  else if ([
    PUBLICATION_TYPES.photos,
    PUBLICATION_TYPES.narrative,
  ].includes(contentItem.type)) {
    // TODO: add
  }
  // article
  else if (contentItem.type === PUBLICATION_TYPES.article) {
    // TODO: add
  }
  // TODO: add announcement
  // TODO: add poll
  // TODO: add reels
  // TODO: add video
}
