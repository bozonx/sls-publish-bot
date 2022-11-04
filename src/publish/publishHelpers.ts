import moment from 'moment';
import {publishTgPost} from '../apiTg/publishTgPost';
import {FULL_DATE_FORMAT} from '../types/constants';
import {PostponePostTask, TASK_TYPES} from '../types/TaskItem';
import {SN_TYPES} from '../types/ContentItem';
import TgChat from '../apiTg/TgChat';


export async function publishPreparedPostTg(
  resolvedDate: string,
  resolvedTime: string,
  postStr: string,
  blogName: string,
  tgChat: TgChat,
  allowPreview: boolean
) {
  let msgId: number;
  // Print to log channel
  try {
    msgId = await publishTgPost(
      tgChat.app.config.logChannelId,
      postStr,
      blogName,
      tgChat,
      !allowPreview
    );

    // TODO: отформатировать почеловечи
    await tgChat.app.tg.bot.telegram.sendMessage(
      tgChat.app.config.logChannelId,
      tgChat.app.i18n.message.prePublishInfo
      + tgChat.app.config.blogs[blogName].dispname + ', '
      + moment(resolvedDate).format(FULL_DATE_FORMAT) + ' '
      // TODO: add sn
      + resolvedTime,
      {
        reply_to_message_id: msgId,
      }
    )
  }
  catch (e) {
    await tgChat.app.channelLog.error(`Can't publish prepared post to telegram to log channel`);

    throw e;
  }
  // get id of channel to publish postpone post
  const chatId = tgChat.app.config.blogs[blogName].sn.telegram?.channelId;

  if (!chatId) {
    throw new Error(`Telegram chat id doesn't set`);
  }

  const task: PostponePostTask = {
    //startTime: '2022-11-01T19:58:00+03:00',
    startTime: moment(`${resolvedDate}T${resolvedTime}:00`)
      .utcOffset(tgChat.app.appConfig.utcOffset).format(),
    type: TASK_TYPES.postponePost,
    chatId,
    blogUname: blogName,
    sn: SN_TYPES.telegram,
    forwardMessageId: msgId,
  };

  await tgChat.app.tasks.addTask(task);
}
