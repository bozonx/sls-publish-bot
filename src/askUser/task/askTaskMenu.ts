import TgChat from '../../apiTg/TgChat.js';
import {
  BACK_BTN,
  BACK_BTN_CALLBACK,
  CANCEL_BTN,
  CANCEL_BTN_CALLBACK, ChatEvents
} from '../../types/constants.js';
import {makeTaskDetails} from '../../taskManager/makeTaskDetails.js';
import BaseState from '../../types/BaseState.js';


const DELETE_TASK_ACTION = 'delete_task';
const FLUSH_TASK_ACTION = 'flush_task';


export async function askTaskMenu(taskId: string, tgChat: TgChat, onDone: () => void) {
  await tgChat.addOrdinaryStep(tgChat.asyncCb(async (state: BaseState) => {
    const task = tgChat.app.tasks.getTask(taskId);

    if (!task) {
      await tgChat.reply(tgChat.app.i18n.message.noTask)
      onDone()

      return;
    }

    const msg = tgChat.app.i18n.menu.taskDetails + '\n\n'
      + await makeTaskDetails(task, tgChat.app)
    const buttons = [
      [
        {
          text: tgChat.app.i18n.menu.flushTask,
          callback_data: FLUSH_TASK_ACTION,
        },
        {
          text: tgChat.app.i18n.menu.deleteTask,
          callback_data: DELETE_TASK_ACTION,
        }
      ],
      [
        BACK_BTN,
        CANCEL_BTN,
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
          else if (queryData === DELETE_TASK_ACTION) {
            try {
              await tgChat.app.tasks.removeTask(taskId);
            }
            catch (e) {
              await tgChat.reply(tgChat.app.i18n.menu.taskRemoveError + e)
            }

            await tgChat.reply(tgChat.app.i18n.message.taskRemoved);

            onDone();
          }
          else if (queryData === FLUSH_TASK_ACTION) {
            try {
              await tgChat.app.tasks.flushTask(taskId)
            }
            catch (e) {
              await tgChat.reply('Task flush error: ' + e)
            }

            await tgChat.reply(tgChat.app.i18n.message.taskFlushed);

            onDone();
          }
          // else do nothing
        })
      ),
      ChatEvents.CALLBACK_QUERY
    ]);
  }))
}
