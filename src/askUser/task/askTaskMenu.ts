import TgChat from '../../apiTg/TgChat.js';
import {ChatEvents} from '../../types/constants.js';
import {makeTaskDetails} from '../../taskManager/makeTaskDetails.js';
import BaseState from '../../types/BaseState.js';
import {BACK_BTN_CALLBACK, CANCEL_BTN_CALLBACK, makeBackBtn, makeCancelBtn} from '../../helpers/buttons.js';
import {addSimpleStep} from '../../helpers/helpers.js';


export const TASK_ACTIONS = {
  DELETE: 'DELETE',
  FLUSH: 'FLUSH',
  CHANGE_EXEC_DATE: 'CHANGE_EXEC_DATE',
  CHANGE_AUTO_DELETE_DATE: 'CHANGE_AUTO_DELETE_DATE',
}


export async function askTaskMenu(
  taskId: string,
  tgChat: TgChat,
  onDone: (action?: keyof typeof TASK_ACTIONS) => void
) {


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
            return tgChat.steps.cancel()
          }
          else if (queryData === BACK_BTN_CALLBACK) {
            return tgChat.steps.back()
          }
          else if (Object.keys(TASK_ACTIONS).includes(queryData)) {
            onDone(queryData as keyof typeof TASK_ACTIONS)
          }
          // else do nothing
        })
      ),
      ChatEvents.CALLBACK_QUERY
    ]);
  }))
}
