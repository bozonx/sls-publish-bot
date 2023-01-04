import TgChat from '../../apiTg/TgChat.js';
import BaseState from '../../types/BaseState.js';
import {ChatEvents, BACK_BTN, BACK_BTN_CALLBACK, CANCEL_BTN, CANCEL_BTN_CALLBACK} from '../../types/constants.js';


const DELETE_TASK_ACTION = 'delete_task';
const FLUSH_TASK_ACTION = 'flush_task';


export async function askTaskMenu(taskId: string, tgChat: TgChat, onDone: () => void) {
  await tgChat.addOrdinaryStep(async (state: BaseState) => {
    // print main menu message
    state.messageIds.push(await printInitialMessage(taskId, tgChat));
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

              await tgChat.reply(`Задание ${taskId} удалено`);

              onDone();
            }
            else if (queryData === FLUSH_TASK_ACTION) {
              await tgChat.app.tasks.flushTask(taskId)
                //.catch((e) => this.app.consoleLog.error(e));
              // TODO: нужно ли обрабаывать ошибку????

              onDone();
            }
            // else do nothing
          }
        )),
      ChatEvents.CALLBACK_QUERY
    ]);
  });
}

async function printInitialMessage(taskId: string, tgChat: TgChat): Promise<number> {
  const taskDetails = tgChat.app.i18n.menu.taskDetails + taskId + '\n'
    + JSON.stringify(tgChat.app.tasks.getTask(taskId), null, 2);

  return tgChat.reply(taskDetails, [
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
  ]);
}
