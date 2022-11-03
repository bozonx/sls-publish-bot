import moment from 'moment/moment';
import {publishTgPost} from '../apiTg/publishTgPost';
import TgChat from '../apiTg/TgChat';
import {FULL_DATE_FORMAT} from '../types/constants';
import {PostponePostTask, TASK_TYPES} from '../types/TaskItem';
import ContentItem, {SN_TYPES} from '../types/ContentItem';
import RawPageContent from '../types/PageContent';
import {transformNotionToTelegramPostMd} from '../helpers/transformNotionToTelegramPostMd';


export async function publishPostToTelegram(
  contentItem: ContentItem,
  parsedPage: RawPageContent,
  blogName: string,
  tgChat: TgChat
) {

  console.log(3333, transformNotionToTelegramPostMd(parsedPage.textBlocks))

  let msgId: number;
  // Print to log channel
  try {
    msgId = await publishTgPost(
      tgChat.app.config.logChannelId,
      transformNotionToTelegramPostMd(parsedPage.textBlocks),
      blogName,
      tgChat
    );

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
    //startTime: '2022-11-01T19:58:00+03:00',
    startTime: moment(`${contentItem.date} ${contentItem.time}`)
      .utcOffset(tgChat.app.appConfig.utcOffset).format(),
    type: TASK_TYPES.postponePost,
    chatId,
    blogUname: blogName,
    sn: SN_TYPES.telegram,
    forwardMessageId: msgId,
  };

  await tgChat.app.tasks.addTask(task);
}
