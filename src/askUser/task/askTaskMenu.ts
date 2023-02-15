import TgChat from '../../apiTg/TgChat.js';
import {ChatEvents, WARN_SIGN} from '../../types/constants.js';
import {makeTaskDetails} from '../../taskManager/makeTaskDetails.js';
import BaseState from '../../types/BaseState.js';
import {BACK_BTN_CALLBACK, CANCEL_BTN_CALLBACK, makeBackBtn, makeCancelBtn} from '../../helpers/buttons.js';
import {PostponeTgPostTask} from '../../types/TaskItem.js';
import {askDateTime} from '../common/askDateTime.js';
import {makeIsoDateTimeStr, replaceHorsInDate} from '../../helpers/helpers.js';
import moment from 'moment';
import {askPublicationMenu} from '../publishContentPlan/askPublicationMenu.js';
import {askTimePeriod} from '../common/askTimePeriod.js';


const TASK_ACTIONS = {
  DELETE: 'DELETE',
  FLUSH: 'FLUSH',
  CHANGE_EXEC_DATE: 'CHANGE_EXEC_DATE',
  CHANGE_AUTO_DELETE_DATE: 'CHANGE_AUTO_DELETE_DATE',
}


export async function askTaskMenu(taskId: string, tgChat: TgChat, onDone: () => void) {
  await tgChat.addOrdinaryStep(tgChat.asyncCb(async (state: BaseState) => {
    const task = tgChat.app.tasks.getTask(taskId);

    if (!task) {
      await tgChat.reply(tgChat.app.i18n.message.noTask)
      onDone()

      return
    }

    const msg = tgChat.app.i18n.menu.taskDetails + '\n\n'
      + await makeTaskDetails(task, tgChat.app)
    const buttons = [
      [
        {
          text: tgChat.app.i18n.menu.flushTask,
          callback_data: TASK_ACTIONS.FLUSH,
        },
        {
          text: tgChat.app.i18n.menu.deleteTask,
          callback_data: TASK_ACTIONS.DELETE,
        }
      ],
      [
        {
          text: tgChat.app.i18n.menu.changeTaskExecDate,
          callback_data: TASK_ACTIONS.CHANGE_EXEC_DATE,
        },
      ],
      (task.type === 'postponePost') ? [
        {
          text: tgChat.app.i18n.menu.changeTaskAutoDeleteDate,
          callback_data: TASK_ACTIONS.CHANGE_AUTO_DELETE_DATE,
        }
      ]: [],
      [
        makeBackBtn(tgChat.app.i18n),
        makeCancelBtn(tgChat.app.i18n),
      ]
    ]
    // print main menu message
    state.messageIds.push(await tgChat.reply(msg, buttons, true))
    // listen to result
    state.handlerIndexes.push([
      tgChat.events.addListener(
        ChatEvents.CALLBACK_QUERY,
        tgChat.asyncCb(async (queryData: string) => {
          if (queryData === CANCEL_BTN_CALLBACK) {
            return tgChat.steps.cancel();
          }
          else if (queryData === BACK_BTN_CALLBACK) {
            return tgChat.steps.back();
          }
          else if (queryData === TASK_ACTIONS.DELETE) {
            try {
              await tgChat.app.tasks.removeTask(taskId)
            }
            catch (e) {
              await tgChat.reply(tgChat.app.i18n.menu.taskRemoveError + e)
            }

            await tgChat.reply(tgChat.app.i18n.message.taskRemoved)

            onDone()
          }
          else if (queryData === TASK_ACTIONS.FLUSH) {
            try {
              await tgChat.app.tasks.flushTask(taskId)
            }
            catch (e) {
              await tgChat.reply('Task flush error: ' + e)
            }

            await tgChat.reply(tgChat.app.i18n.message.taskFlushed);

            onDone();
          }
          else if (queryData === TASK_ACTIONS.CHANGE_EXEC_DATE) {
            await askDateTime(tgChat, tgChat.asyncCb(async (isoDate: string, time: string) => {
              try {
                await tgChat.app.tasks.editTask(taskId, {
                  startTime: makeIsoDateTimeStr(isoDate, time, tgChat.app.appConfig.utcOffset)
                })
              }
              catch (e) {
                await tgChat.reply(tgChat.app.i18n.menu.taskEditError + e)
              }

              await tgChat.reply(tgChat.app.i18n.message.taskTimeWasChanged)

              onDone()
            }))
          }
          else if (queryData === TASK_ACTIONS.CHANGE_AUTO_DELETE_DATE) {
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
                <= moment(task.startTime).unix()
              ) {
                await tgChat.reply(`${WARN_SIGN} ${tgChat.app.i18n.errors.dateLessThenAutoDelete}`)

                return
              }

              if (hoursPeriod) {
                autoDeleteDateTime = replaceHorsInDate(task.startTime, hoursPeriod)
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
            }))
          }
          // else do nothing
        })
      ),
      ChatEvents.CALLBACK_QUERY
    ]);
  }))
}
