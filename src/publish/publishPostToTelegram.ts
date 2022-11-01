import moment from 'moment/moment';
import {publishTgPost} from '../apiTg/publishTgPost';
import TgChat from '../apiTg/TgChat';
import {FULL_DATE_FORMAT} from '../types/constants';
import {PostponePostTask, TASK_TYPES} from '../types/TaskItem';
import ContentItem, {SN_TYPES} from '../types/ContentItem';
import RawPageContent from '../types/PageContent';


export async function publishPostToTelegram(
  contentItem: ContentItem,
  parsedPage: RawPageContent,
  blogName: string,
  tgChat: TgChat
) {
  let msgId: number;

  console.log(22222222, parsedPage.textBlocks)

  // Print to log channel
  try {
    msgId = await publishTgPost(
      tgChat.app.config.logChannelId,
      'test post',
      //transformNotionToTelegramPostMd(parsedPage.textBlocks),
      blogName,
      tgChat
    );

    // TODO: проверить что он будет ответом на пост
    // TODO: может лучше использовать channelLog.log
    // TODO: отформатировать почеловечи
    await tgChat.app.tg.bot.telegram.sendMessage(
      tgChat.app.config.logChannelId,
      tgChat.app.i18n.message.prePublishInfo
      + tgChat.app.config.blogs[blogName].dispname + ', '
      + moment(contentItem.date).format(FULL_DATE_FORMAT) + ' '
      // TODO: add sn
      + contentItem.time,
      {
        reply_to_message_id: msgId,
      }
    )
  }
  catch (e) {
    await tgChat.app.channelLog.error(`Can't publish prepared to telegram post to log channel`);

    throw e;
  }
  // get id of channel to publish postpone post
  const chatId = tgChat.app.config.blogs[blogName].sn.telegram?.channelId;

  if (!chatId) {
    throw new Error(`Telegram chat id doesn't set`);
  }

  const task: PostponePostTask = {

    // TODO: use post's time

    startTime: '2022-11-01T18:54:00+03:00',
    type: TASK_TYPES.postponePost,
    chatId,
    blogUname: blogName,
    sn: SN_TYPES.telegram,
    forwardMessageId: msgId,
  };

  await tgChat.app.tasks.addTask(task);
}
