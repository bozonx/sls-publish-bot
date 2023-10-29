import TgChat from '../../apiTg/TgChat';
import {makeTaskDetails} from '../../taskManager/makeTaskDetails';
import {BACK_BTN_CALLBACK, CANCEL_BTN_CALLBACK, makeBackBtn, makeCancelBtn} from '../../helpers/buttons';
import {addSimpleStep} from '../../helpers/helpers';
import {TgReplyButton} from '../../types/TgReplyButton';


export const TASK_ACTIONS = {
  DELETE: 'DELETE',
  FLUSH: 'FLUSH',
  CHANGE_EXEC_DATE: 'CHANGE_EXEC_DATE',
  CHANGE_AUTO_DELETE_DATE: 'CHANGE_AUTO_DELETE_DATE',
}


export async function askTaskMenu(
  taskId: string,
  tgChat: TgChat,
  onDone: (action: keyof typeof TASK_ACTIONS) => void
) {
  await addSimpleStep(
    tgChat,
    async (): Promise<[string, TgReplyButton[][]]> => {
      const task = tgChat.app.tasks.getTask(taskId)

      if (!task) {
        await tgChat.reply(tgChat.app.i18n.message.noTask)

        return [ tgChat.app.i18n.message.noTask, [[makeBackBtn(tgChat.app.i18n)]] ]
      }

      return [
        tgChat.app.i18n.menu.taskDetails + '\n\n' + await makeTaskDetails(task, tgChat.app),
        [
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
      ]
    },
    (queryData: string) => {
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
    }
  )
}
