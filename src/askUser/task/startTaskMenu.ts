import TgChat from '../../apiTg/TgChat.js';
import {askTaskMenu, TASK_ACTIONS} from './askTaskMenu.js';
import {askDateTime} from '../common/askDateTime.js';
import {makeIsoDateTimeStr, replaceHorsInDate} from '../../helpers/helpers.js';
import {PostponeTgPostTask} from '../../types/TaskItem.js';
import moment from 'moment/moment.js';
import {WARN_SIGN} from '../../types/constants.js';
import {askTimePeriod} from '../common/askTimePeriod.js';


export async function startTaskMenu(taskId: string, tgChat: TgChat, onDone: () => void) {
  const task = tgChat.app.tasks.getTask(taskId)

  return askTaskMenu(taskId, tgChat, tgChat.asyncCb(async (action: keyof typeof TASK_ACTIONS) => {
    if (action === TASK_ACTIONS.DELETE) {
      try {
        await tgChat.app.tasks.removeTask(taskId)
      }
      catch (e) {
        await tgChat.reply(tgChat.app.i18n.menu.taskRemoveError + e)
      }

      await tgChat.reply(tgChat.app.i18n.message.taskRemoved)
      onDone()
    }
    else if (action === TASK_ACTIONS.FLUSH) {
      try {
        await tgChat.app.tasks.flushTask(taskId)
      }
      catch (e) {
        await tgChat.reply('Task flush error: ' + e)
      }

      await tgChat.reply(tgChat.app.i18n.message.taskFlushed)
      onDone()
    }
    else if (action === TASK_ACTIONS.CHANGE_EXEC_DATE) {
      await askDateTime(tgChat, tgChat.asyncCb(async (isoDate: string, time: string) => {
        const startTime = makeIsoDateTimeStr(isoDate, time, tgChat.app.appConfig.utcOffset)
        const autoDeleteDateTime = (task as PostponeTgPostTask).autoDeleteDateTime

        if (
          autoDeleteDateTime && moment(autoDeleteDateTime).unix()
          <= moment(startTime).unix()
        ) {
          await tgChat.reply(`${WARN_SIGN} ${tgChat.app.i18n.errors.dateGreaterThenAutoDelete}`)

          return
        }

        try {
          await tgChat.app.tasks.editTask(taskId, { startTime })
        }
        catch (e) {
          await tgChat.reply(tgChat.app.i18n.menu.taskEditError + e)
        }

        await tgChat.reply(tgChat.app.i18n.message.taskTimeWasChanged)

        onDone()
      }), undefined, undefined, true, true)
    }
    else if (action === TASK_ACTIONS.CHANGE_AUTO_DELETE_DATE) {
      return await askTimePeriod(tgChat, tgChat.asyncCb(async (
        hoursPeriod?: number,
        certainIsoDateTime?: string
      ) => {
        let autoDeleteDateTime: string | null = null

        if (!hoursPeriod && !certainIsoDateTime) {
          await tgChat.reply(tgChat.app.i18n.commonPhrases.removedDeleteTimer)
          // keep it clear
        }
        // validate that selected date is greater than auto-delete date
        else if (
          certainIsoDateTime && moment(certainIsoDateTime).unix()
          <= moment((task as PostponeTgPostTask).startTime).unix()
        ) {
          await tgChat.reply(`${WARN_SIGN} ${tgChat.app.i18n.errors.dateLessThenAutoDelete}`)

          return
        }

        if (hoursPeriod) {
          autoDeleteDateTime = replaceHorsInDate((task as PostponeTgPostTask).startTime, hoursPeriod)
        }
        else {
          autoDeleteDateTime = certainIsoDateTime || null
        }

        try {
          await tgChat.app.tasks.editTask(taskId,{ autoDeleteDateTime })
        }
        catch (e) {
          await tgChat.reply(tgChat.app.i18n.menu.taskEditError + e)
        }

        await tgChat.reply(tgChat.app.i18n.message.taskAutoDeleteTimeWasChanged)

        onDone()
      }), undefined, tgChat.app.i18n.buttons.clear)
    }
    else {
      onDone()
    }
  }))
}
