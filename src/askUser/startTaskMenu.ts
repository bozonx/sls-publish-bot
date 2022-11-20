import {askTasksListMenu, TASK_LIST_ACTIONS} from './askTasksListMenu';
import {askTaskMenu} from './askTaskMenu';
import TgChat from '../apiTg/TgChat';


export async function startTaskMenu(tgChat: TgChat) {
  await askTasksListMenu(
    tgChat,
    (taskId?: string, action?: string) => {
      if (action === TASK_LIST_ACTIONS.DELETE_POST) {

      }
      else if (action === TASK_LIST_ACTIONS.PIN_POST) {

      }
      else if (action === TASK_LIST_ACTIONS.UNPIN_POST) {

      }
      else if (action === TASK_LIST_ACTIONS.FINISH_POLL) {

      }
      else if (taskId) {
        askTaskMenu(taskId, tgChat, () => {
          tgChat.steps.cancel();
        });
      }
    }
  );
}
