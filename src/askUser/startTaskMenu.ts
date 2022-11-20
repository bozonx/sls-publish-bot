import {askTasksListMenu, TASK_LIST_ACTIONS} from './askTasksListMenu';
import {askTaskMenu} from './askTaskMenu';
import TgChat from '../apiTg/TgChat';
import {askTaskDeletePost} from './askTaskDeletePost';


export async function startTaskMenu(tgChat: TgChat) {
  await askTasksListMenu(
    tgChat,
    tgChat.asyncCb(async (taskId?: string, action?: string) => {
      if (action === TASK_LIST_ACTIONS.DELETE_POST) {
        return askTaskDeletePost(tgChat, tgChat.asyncCb(async (
          messageId: number,
          chatId: number,
          startTime: string
        ) => {
          await tgChat.app.tasks.addTask({
            messageId,
            chatId,
            sn: 'telegram',
            startTime,
            type: 'deletePost',
          });

          await tgChat.steps.cancel();
        }));
      }
      else if (action === TASK_LIST_ACTIONS.PIN_POST) {

      }
      else if (action === TASK_LIST_ACTIONS.UNPIN_POST) {

      }
      else if (action === TASK_LIST_ACTIONS.FINISH_POLL) {

      }
      else if (taskId) {
        return askTaskMenu(taskId, tgChat, tgChat.asyncCb(async () => {
          await tgChat.steps.cancel();
        }));
      }
    })
  );
}
