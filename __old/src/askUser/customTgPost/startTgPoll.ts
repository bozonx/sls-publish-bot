import moment from 'moment/moment.js';
import TgChat from '../../apiTg/TgChat';
import {askTgPoll} from './askTgPoll';
import {askConfirm} from '../common/askConfirm';
import {PollMessageEvent} from '../../../../microserviceTelegramBot/src/types/MessageEvent.js';
import {askDateTime} from '../common/askDateTime';
import {registerTgTaskCopy} from '../../helpers/registerTgPost';
import {askTimePeriod} from '../common/askTimePeriod';
import {addHorsInDate, makeIsoDateTimeStr} from '../../helpers/helpers';
import {makePollInfo} from '../../helpers/publishHelpers';
import {PRINT_SHORT_DATE_TIME_FORMAT, WARN_SIGN} from '../../types/constants';


const POLL_FINISH_STEP = 'POLL_FINISH_STEP'


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
        closeHoursPeriod?: number,
        certainCloseIsoDateTime?: string
      ) => {
        // validate that selected date is greater than auto-delete date
        if (
          certainCloseIsoDateTime && moment(certainCloseIsoDateTime).unix()
          <= moment(publishIsoDateTime).unix()
        ) {
          await tgChat.reply(`${WARN_SIGN} ${tgChat.app.i18n.errors.dateLessThenAutoDelete}`)

          return await tgChat.steps.to(POLL_FINISH_STEP)
        }

        let finalClosePollIsoDateTime: string | undefined

        if (certainCloseIsoDateTime) {
          finalClosePollIsoDateTime = certainCloseIsoDateTime
        }
        else if (closeHoursPeriod) {
          finalClosePollIsoDateTime = addHorsInDate(publishIsoDateTime, closeHoursPeriod)
        }

        if (finalClosePollIsoDateTime) {
          await tgChat.reply(
            tgChat.app.i18n.commonPhrases.closePollTime
            + moment(finalClosePollIsoDateTime).format(PRINT_SHORT_DATE_TIME_FORMAT)
          )
        }

        await askConfirm(tgChat, tgChat.asyncCb(async () => {
          await registerTgTaskCopy(
            blogName,
            tgChat,
            isoDate,
            time,
            message.messageId,
            undefined,
            finalClosePollIsoDateTime
          )

          await tgChat.reply(tgChat.app.i18n.message.taskRegistered)
          await tgChat.steps.cancel();
        }), tgChat.app.i18n.commonPhrases.publishConfirmation);
      }), POLL_FINISH_STEP);
    }), undefined, undefined,true, true)

  }));
}
