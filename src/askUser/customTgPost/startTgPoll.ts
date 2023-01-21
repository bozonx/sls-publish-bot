import TgChat from '../../apiTg/TgChat.js';
import {askTgPoll} from './askTgPoll.js';
import {askConfirm} from '../common/askConfirm.js';
import {PollMessageEvent} from '../../types/MessageEvent.js';
import {askDateTime} from '../common/askDateTime.js';
import {makePublishTaskTgCopy} from '../../publish/makePublishTaskTg.js';
import {askTimePeriod} from '../common/askTimePeriod.js';
import {isoDateToHuman, makeIsoDateTimeStr} from '../../helpers/helpers.js';
import {makePollInfo} from '../../publish/publishHelpers.js';


export async function startTgPoll(blogName: string, tgChat: TgChat) {
  await askTgPoll(tgChat, tgChat.asyncCb(async (message: PollMessageEvent) => {
    await tgChat.reply(
      tgChat.app.i18n.commonPhrases.pollParams + `\n`
      + makePollInfo(message, tgChat)
    )

    // await tgChat.app.tg.bot.telegram.copyMessage(
    //   tgChat.botChatId,
    //   tgChat.botChatId,
    //   message.messageId,
    // );

    await askDateTime(tgChat, tgChat.asyncCb(async (isoDate: string, time: string) => {
      const publishIsoDateTime = makeIsoDateTimeStr(isoDate, time, tgChat.app.appConfig.utcOffset);




      await askTimePeriod(tgChat, tgChat.asyncCb(async (
        hoursPeriod?: number,
        certainIsoDateTime?: string
      ) => {
        // TODO: make final date
        //onDone(replaceHorsInDate(publishIsoDateTime, Number(splat[1])));

        // TODO: check publishDateTime

        // if (closeIsoDateTime) {
        //   await tgChat.reply(
        //     tgChat.app.i18n.commonPhrases.pollCloseDateAndTime + '\n'
        //     + isoDateToHuman(closeIsoDateTime)
        //   )
        // }

        await askConfirm(tgChat, tgChat.asyncCb(async () => {
          await makePublishTaskTgCopy(
            blogName,
            tgChat,
            isoDate,
            time,
            message.messageId,
            // TODO: надо сюда добавить дату закрытия потомучто мы не знаем конечный messageId
            // TODO: может быть не установлена дата закрытия
          )

          // const task: FinishTgPollTask = {
          //   startTime: closeIsoDateTime,
          //   type: 'finishPoll',
          //   sn: 'telegram',
          //   chatId,
          //   messageId: message.messageId,
          // }
          //
          // await tgChat.app.tasks.addTaskAndLog(task);

          await tgChat.reply(tgChat.app.i18n.message.taskRegistered)
          await tgChat.steps.cancel();
        }), tgChat.app.i18n.commonPhrases.publishConfirmation);
      }));
    }));

  }));
}
