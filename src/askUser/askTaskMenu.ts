import TgChat from '../apiTg/TgChat';
import BaseState from '../types/BaseState';
import {AppEvents, BACK_BTN, BACK_BTN_CALLBACK, CANCEL_BTN, CANCEL_BTN_CALLBACK} from '../types/constants';


export const DELETE_TASK_ACTION = 'delete_task';


export async function askTaskMenu(taskId: string, tgChat: TgChat, onDone: () => void) {
  await tgChat.addOrdinaryStep(async (state: BaseState) => {
    // print main menu message
    state.messageIds.push(await printInitialMessage(taskId, tgChat));
    // listen to result
    state.handlerIndexes.push([
      tgChat.events.addListener(
        AppEvents.CALLBACK_QUERY,
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
            // else do nothing
          }
        )),
      AppEvents.CALLBACK_QUERY
    ]);
  });
}

async function printInitialMessage(taskId: string, tgChat: TgChat): Promise<number> {
  const taskDetails = tgChat.app.i18n.menu.taskDetails + taskId + '\n'
    + JSON.stringify(tgChat.app.tasks.getTask(taskId), null, 2);

  return tgChat.reply(taskDetails, [
    [
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
