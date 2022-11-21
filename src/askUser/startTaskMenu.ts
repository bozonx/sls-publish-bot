import {askTasksListMenu, TASK_LIST_ACTIONS} from './askTasksListMenu';
import {askTaskMenu} from './askTaskMenu';
import TgChat from '../apiTg/TgChat';
import {askTaskAdd} from './askTaskAdd';
import {askTaskFinishPoll} from './askTaskFinishPoll';


export async function startTaskMenu(tgChat: TgChat) {
  await askTasksListMenu(
    tgChat,
    tgChat.asyncCb(async (taskId?: string, action?: string) => {
      if (action === TASK_LIST_ACTIONS.DELETE_POST) {
        return askTaskAdd(tgChat.app.i18n.menu.taskDeletePost, tgChat, tgChat.asyncCb(async (
          messageId: number,
          chatId: number,
          startTime: string
        ) => {
          await tgChat.app.tasks.addTaskAndLog({
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
        return askTaskAdd(tgChat.app.i18n.menu.taskPinPost, tgChat, tgChat.asyncCb(async (
          messageId: number,
          chatId: number,
          startTime: string
        ) => {
          await tgChat.app.tasks.addTaskAndLog({
            messageId,
            chatId,
            sn: 'telegram',
            startTime,
            type: 'pinPost',
          });

          await tgChat.steps.cancel();
        }));
      }
      else if (action === TASK_LIST_ACTIONS.UNPIN_POST) {
        return askTaskAdd(tgChat.app.i18n.menu.taskUnpinPost, tgChat, tgChat.asyncCb(async (
          messageId: number,
          chatId: number,
          startTime: string
        ) => {
          await tgChat.app.tasks.addTaskAndLog({
            messageId,
            chatId,
            sn: 'telegram',
            startTime,
            type: 'unpinPost',
          });

          await tgChat.steps.cancel();
        }));
      }
      else if (action === TASK_LIST_ACTIONS.FINISH_POLL) {
        return askTaskFinishPoll(tgChat.app.i18n.menu.taskFinishPoll, tgChat, tgChat.asyncCb(async (
          messageId: number,
          chatId: number,
          startTime: string
        ) => {
          await tgChat.app.tasks.addTaskAndLog({
            messageId,
            chatId,
            sn: 'telegram',
            startTime,
            type: 'finishPoll',
          });

          await tgChat.steps.cancel();
        }));
      }
      else if (taskId) {
        return askTaskMenu(taskId, tgChat, tgChat.asyncCb(async () => {
          await tgChat.steps.cancel();
        }));
      }
    })
  );
}
