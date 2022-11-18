import TgChat from '../apiTg/TgChat';
import {askPoll} from '../askUser/askPoll';
import {askPostConfirm} from '../askUser/askPostConfirm';
import {PollMessageEvent} from '../types/MessageEvent';
import {publishCopyTg} from './publishHelpers';
import {askDateTime} from '../askUser/askDateTime';


export async function startPublishPollTg(blogName: string, tgChat: TgChat) {
  await askPoll(tgChat, tgChat.asyncCb(async (message: PollMessageEvent) => {
    await tgChat.app.tg.bot.telegram.copyMessage(
      tgChat.botChatId,
      tgChat.botChatId,
      message.messageId,
    );

    await askDateTime(tgChat, tgChat.asyncCb(async (isoDate: string, time: string) => {
      await askPostConfirm(blogName, tgChat, tgChat.asyncCb(async () => {
        await publishCopyTg(
          isoDate,
          time,
          message.messageId,
          blogName,
          tgChat
        )

        await tgChat.reply(tgChat.app.i18n.message.taskRegistered)
        await tgChat.steps.cancel();
      }));
    }));

  }));
}
