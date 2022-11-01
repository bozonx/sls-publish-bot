import moment from 'moment/moment';
import {FULL_DATE_FORMAT} from '../types/constants';
import {publishTgPost} from '../apiTg/publishTgPost';
import {transformNotionToTelegramPostMd} from '../helpers/transformNotionToTelegramPostMd';
import {TASK_TYPES} from '../types/TaskItem';
import ContentItem, {SN_TYPES} from '../types/ContentItem';
import RawPageContent from '../types/PageContent';
import TgChat from '../apiTg/TgChat';


export async function publishPostLikeToTelegram(
  contentItem: ContentItem,
  parsedPage: RawPageContent,
  blogName: string,
  tgChat: TgChat
) {
  let msgId: number;

  console.log(22222222, parsedPage.textBlocks)

  // TODO: почему только в телеграм????

  // Print to log channel
  try {
    msgId = await publishTgPost(
      tgChat.app.config.logChannelId,
      transformNotionToTelegramPostMd(parsedPage.textBlocks),
      blogName,
      tgChat
    );

    // TODO: лучше сделать его ответом на пост
    // TODO: может лучше использовать channelLog.log
    await tgChat.app.tg.bot.telegram.sendMessage(
      tgChat.app.config.logChannelId,
      tgChat.app.i18n.message.prePublishInfo
      + tgChat.app.config.blogs[blogName].dispname + ', '
      + moment(contentItem.date).format(FULL_DATE_FORMAT) + ' '
      + contentItem.time,
    )
  }
  catch (e) {
    await tgChat.app.channelLog.error(`Can't publish post to log channel`);

    throw e;
  }
  // get id of channel to publish postpone post
  const chatId = tgChat.app.config.blogs[blogName].sn.telegram?.channelId;

  if (!chatId) {
    throw new Error(`Telegram chat id doesn't set`);
  }

  await tgChat.app.tasks.addTask({

    // TODO: use post's time

    startTime: '2022-10-30T14:10:00+03:00',
    type: TASK_TYPES.postponePost,
    chatId,
    blogUname: blogName,
    sn: SN_TYPES.telegram,
    forwardMessageId: msgId,
  });
}
