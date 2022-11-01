import TgChat from '../apiTg/TgChat';
import BaseState from '../types/BaseState';
import {AppEvents, CANCEL_BTN, CANCEL_BTN_CALLBACK} from '../types/constants';


export const TASK_ID_PREFIX = 'task:';


export async function askTasksListMenu(tgChat: TgChat, onDone: (taskId: string) => void) {
  await tgChat.addOrdinaryStep(async (state: BaseState) => {
    // print main menu message
    state.messageIds.push(await printInitialMessage(tgChat));
    // listen to result
    state.handlerIndexes.push([
      tgChat.events.addListener(
        AppEvents.CALLBACK_QUERY,
        tgChat.asyncCb(async (queryData: string) => {
            if (queryData === CANCEL_BTN_CALLBACK) {
              return tgChat.steps.cancel();
            }
            else if (queryData.indexOf(TASK_ID_PREFIX) === 0) {
              const splat = queryData.split(':');

              onDone(splat[1]);
            }
            // else do nothing
          }
        )),
      AppEvents.CALLBACK_QUERY
    ]);
  });
}

async function printInitialMessage(tgChat: TgChat): Promise<number> {
  const taskList = tgChat.app.tasks.getTasksList();

  if (!Object.keys(taskList).length) {
    return tgChat.reply(tgChat.app.i18n.menu.emptyTaskList, [[ CANCEL_BTN ]]);
  }

  return tgChat.reply(tgChat.app.i18n.menu.taskList, [
    Object.keys(taskList).map((taskId) => {
      return {
        text: JSON.stringify(taskList[taskId]),
        callback_data: TASK_ID_PREFIX + taskId,
      }
    }),
    [
      CANCEL_BTN,
    ]
  ]);
}
