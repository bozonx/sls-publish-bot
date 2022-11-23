import TgChat from '../apiTg/TgChat';
import {askPoll} from './askPoll';
import {askPostConfirm} from './askPostConfirm';
import {PollMessageEvent} from '../types/MessageEvent';
import {askDateTime} from './askDateTime';
import {makePublishTaskTgCopy} from '../publish/makePublishTaskTg';
import {askClosePoll} from './askClosePoll';


export async function startPublishPollTg(blogName: string, tgChat: TgChat) {
  await askPoll(tgChat, tgChat.asyncCb(async (message: PollMessageEvent) => {
    await tgChat.app.tg.bot.telegram.copyMessage(
      tgChat.botChatId,
      tgChat.botChatId,
      message.messageId,
    );

    await askDateTime(tgChat, tgChat.asyncCb(async (isoDate: string, time: string) => {
      await askClosePoll(tgChat, tgChat.asyncCb(async (closeIsoDateTime: string) => {
        await askPostConfirm(blogName, tgChat, tgChat.asyncCb(async () => {
          await makePublishTaskTgCopy(
            isoDate,
            time,
            message.messageId,
            blogName,
            tgChat,
          )

          await tgChat.reply(tgChat.app.i18n.message.taskRegistered)
          await tgChat.steps.cancel();
        }));
      }));
    }));

  }));
}
