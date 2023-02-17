import {askTasksListMenu, TASK_LIST_ACTIONS, TASKS_MAIN_STEP} from './askTasksListMenu.js';
import TgChat from '../../apiTg/TgChat.js';
import {askSharePost} from '../common/askSharePost.js';
import {askTaskFinishPoll} from './askTaskFinishPoll.js';
import {
  CloneTgPostTask,
  DeleteTgPostTask,
  FinishTgPollTask,
  PinTgPostTask,
  UnpinTgPostTask
} from '../../types/TaskItem.js';
import {askChat} from '../common/askChat.js';
import {startTaskMenu} from './startTaskMenu.js';
import {startTaskAdd} from './startTaskAdd.js';


export async function startTaskListMenu(tgChat: TgChat) {
  await askTasksListMenu(
    tgChat,
    tgChat.asyncCb(async (taskId?: string, action?: string) => {
      if (action === TASK_LIST_ACTIONS.DELETE_POST) {
        return startTaskAdd(tgChat.app.i18n.menu.taskDeletePost, tgChat, tgChat.asyncCb(async (
          messageIds: number[],
          chatId: number,
          startTime: string
        ) => {
          const task: DeleteTgPostTask = {
            startTime,
            type: 'deletePost',
            sn: 'telegram',
            chatId,
            messageIds,
          }

          await tgChat.app.tasks.addTaskAndLog(task)
          await tgChat.reply(tgChat.app.i18n.message.taskRegistered)
          await tgChat.steps.to(TASKS_MAIN_STEP)
        }));
      }
      else if (action === TASK_LIST_ACTIONS.CLONE_POST) {
        return askSharePost(tgChat.app.i18n.menu.taskClonePost, tgChat, tgChat.asyncCb(async (
          messageIds: number[],
          chatId: number,
          startTime: string
        ) => {
          const msg = tgChat.app.i18n.message.pleaseSelectChatForClone
          await askChat(msg, tgChat, tgChat.asyncCb(async(toChatId: string | number) => {
            // TODO: а чё поддерживаются сразу несолько чтоли???
            const task: CloneTgPostTask = {
              startTime,
              type: 'clonePost',
              sn: 'telegram',
              // from chat
              chatId,
              messageIds,
              toChatId
            }

            await tgChat.app.tasks.addTaskAndLog(task)
            await tgChat.reply(tgChat.app.i18n.message.taskRegistered)
            await tgChat.steps.to(TASKS_MAIN_STEP)
          }))
        }));
      }
      else if (action === TASK_LIST_ACTIONS.PIN_POST) {
        return startTaskAdd(tgChat.app.i18n.menu.taskPinPost, tgChat, tgChat.asyncCb(async (
          messageIds: number[],
          chatId: number,
          startTime: string
        ) => {
          const task: PinTgPostTask = {
            startTime,
            type: 'pinPost',
            sn: 'telegram',
            chatId,
            messageId: messageIds[0],
          }

          await tgChat.app.tasks.addTaskAndLog(task)
          await tgChat.reply(tgChat.app.i18n.message.taskRegistered)
          await tgChat.steps.to(TASKS_MAIN_STEP)
        }));
      }
      else if (action === TASK_LIST_ACTIONS.UNPIN_POST) {
        return startTaskAdd(tgChat.app.i18n.menu.taskUnpinPost, tgChat, tgChat.asyncCb(async (
          messageIds: number[],
          chatId: number,
          startTime: string
        ) => {
          const task: UnpinTgPostTask = {
            startTime,
            type: 'unpinPost',
            sn: 'telegram',
            chatId,
            messageId: messageIds[0],
          }

          await tgChat.app.tasks.addTaskAndLog(task)
          await tgChat.reply(tgChat.app.i18n.message.taskRegistered)
          await tgChat.steps.to(TASKS_MAIN_STEP)
        }));
      }
      else if (action === TASK_LIST_ACTIONS.FINISH_POLL) {
        return askTaskFinishPoll(tgChat.app.i18n.menu.taskFinishPoll, tgChat, tgChat.asyncCb(async (
          messageIds: number[],
          chatId: number,
          startTime: string
        ) => {
          const task: FinishTgPollTask = {
            startTime,
            type: 'finishPoll',
            sn: 'telegram',
            chatId,
            messageId: messageIds[0],
          }

          await tgChat.app.tasks.addTaskAndLog(task)
          await tgChat.reply(tgChat.app.i18n.message.taskRegistered)
          await tgChat.steps.to(TASKS_MAIN_STEP)
        }));
      }
      else if (taskId) {
        return startTaskMenu(taskId, tgChat, tgChat.asyncCb(async () => {
          await tgChat.steps.to(TASKS_MAIN_STEP)
        }));
      }
    })
  );
}
