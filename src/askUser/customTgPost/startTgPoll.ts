import TgChat from '../../apiTg/TgChat.js';
import {askTgPoll} from './askTgPoll.js';
import {askConfirm} from '../common/askConfirm.js';
import {PollMessageEvent} from '../../types/MessageEvent.js';
import {askDateTime} from '../common/askDateTime.js';
import {makePublishTaskTgCopy} from '../../publish/makePublishTaskTg.js';
import {askCloseTgPoll} from './askCloseTgPoll.js';
import {makeIsoDateTimeStr} from '../../helpers/helpers.js';


export async function startTgPoll(blogName: string, tgChat: TgChat) {
  await askTgPoll(tgChat, tgChat.asyncCb(async (message: PollMessageEvent) => {
    await tgChat.app.tg.bot.telegram.copyMessage(
      tgChat.botChatId,
      tgChat.botChatId,
      message.messageId,
    );

    await askDateTime(tgChat, tgChat.asyncCb(async (isoDate: string, time: string) => {
      const publishDateTime = makeIsoDateTimeStr(isoDate, time, tgChat.app.appConfig.utcOffset);

      await askCloseTgPoll(publishDateTime, tgChat, tgChat.asyncCb(async (closeIsoDateTime: string) => {
        await askConfirm(blogName, tgChat, tgChat.asyncCb(async () => {
          await makePublishTaskTgCopy(
            isoDate,
            time,
            message.messageId,
            blogName,
            tgChat,
          )

          await tgChat.reply(tgChat.app.i18n.message.taskRegistered)
          await tgChat.steps.cancel();
        }), tgChat.app.i18n.commonPhrases.publishConfirmation);
      }));
    }));

  }));
}
