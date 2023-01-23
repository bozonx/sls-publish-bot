import TasksMain from './TasksMain.js';
import {
  DeleteTgPostTask,
  FinishTgPollTask,
  PinTgPostTask,
  PostponeTgPostTask,
  TASK_TYPES, TaskItem,
  UnpinTgPostTask
} from '../types/TaskItem.js';
import {makeTaskDetails} from './makeTaskDetails.js';
import {publishTgCopy, publishTgMediaGroup} from '../apiTg/publishTg.js';


export default class ExecuteTask {
  private readonly tasks: TasksMain;


  constructor(tasks: TasksMain) {
    this.tasks = tasks;
  }


  async execute(taskId: string) {
    const task = this.tasks.getTask(taskId);

    if (!task) {
      const msg = `Can't find task ${taskId}`

      this.tasks.app.channelLog.error(msg);
      this.tasks.app.consoleLog.error(msg);
      throw new Error(msg);
    }

    // remove task anyway in success and error case
    this.tasks.clearTask(taskId);
    // do noting on error
    await this.tasks.saveTasks();

    try {
      await this.executeFork(task)
      this.tasks.app.channelLog.log(
        this.tasks.app.i18n.message.taskDoneSuccessful + '\n'
        + await makeTaskDetails(task, this.tasks.app)
      );
    }
    catch (e) {
      const msg = `Can't execute task "${taskId}": ${e}`;
      this.tasks.app.channelLog.error(msg);
      this.tasks.app.consoleLog.error(msg);
    }
  }


  private async executeFork(task: TaskItem) {
    switch (task.type) {
      case TASK_TYPES.postponePost:
        return await this.executePostponePost(task);
      case TASK_TYPES.deletePost:
        return await this.executeDeletePost(task);
      case TASK_TYPES.pinPost:
        return await this.executePinPost(task);
      case TASK_TYPES.unpinPost:
        return await this.executeUnpinPost(task);
      case TASK_TYPES.finishPoll:
        return await this.executeFinishPoll(task);
      default:
        throw new Error(`Unknown task type: ${task.type}`);
    }
  }

  private async executePostponePost(task: TaskItem) {
    const postponeTask = task as PostponeTgPostTask;
    let createdMessagesIds: number[] = []

    if (postponeTask.forwardMessageIds.length === 1) {
      createdMessagesIds[0] = await publishTgCopy(
        this.tasks.app,
        postponeTask.chatId,
        this.tasks.app.appConfig.logChannelId,
        postponeTask.forwardMessageIds[0],
        postponeTask.urlBtn
      )
    }
    // else {
    //   createdMessagesIds = (await this.tasks.app.tg.bot.telegram.sendMediaGroup(
    //     postponeTask.chatId,
    //     postponeTask.forwardMessageIds.map((forwardMsgId, index) => {
    //       const firstItemData = (index) ? {} : {
    //         // TODO: нужен текст
    //         caption: 'captionMd',
    //         parse_mode: this.tasks.app.appConfig.telegram.parseMode,
    //
    //         // TODO: проверить
    //         // reply_markup: urlBtn && {
    //         //   inline_keyboard: [
    //         //     [ urlBtn ]
    //         //   ]
    //         // } || undefined,
    //
    //       };
    //
    //       return {
    //
    //       }
    //
    //       // if (el.type === 'photo') {
    //       //   return {
    //       //     type: 'photo',
    //       //     media: el.fileId,
    //       //     ...firstItemData,
    //       //   };
    //       // }
    //       // else if (el.type === 'photoUrl') {
    //       //   return {
    //       //     type: 'photo',
    //       //     media: el.url,
    //       //     ...firstItemData,
    //       //   };
    //       // }
    //       // else if (el.type === 'video') {
    //       //   return {
    //       //     type: 'video',
    //       //     media: el.fileId,
    //       //     ...firstItemData,
    //       //   };
    //       // }
    //       // else {
    //       //   throw new Error(`Unknown media`);
    //       // }
    //     }),
    //     {
    //       disable_notification: disableNotification,
    //     }
    //   )).map((e) => e.message_id);
    // }

    // for (const forwardMsgId of postponeTask.forwardMessageIds) {
    //
    //   // await publishTgMediaGroup(
    //   //   postponeTask.chatId,
    //   //
    //   // )
    // }

    if (postponeTask.autoDeleteDateTime) {
      const task: DeleteTgPostTask = {
        startTime: postponeTask.autoDeleteDateTime,
        type: 'deletePost',
        sn: 'telegram',
        chatId: postponeTask.chatId,
        messageIds: createdMessagesIds,
      }

      await this.tasks.addTaskAndLog(task)
    }

    if (postponeTask.closePollDateTime) {
      const task: FinishTgPollTask = {
        startTime: postponeTask.closePollDateTime,
        type: 'finishPoll',
        sn: 'telegram',
        chatId: postponeTask.chatId,
        messageId: createdMessagesIds[0],
      }

      await this.tasks.addTaskAndLog(task);
    }
  }

  private async executeDeletePost(task: TaskItem) {
    const deleteTask = task as DeleteTgPostTask;

    await Promise.all(deleteTask.messageIds.map((msgId) => {
      return this.tasks.app.tg.bot.telegram.deleteMessage(task.chatId, msgId);
    }))
  }

  private async executePinPost(task: TaskItem) {
    const pinTask = task as PinTgPostTask;

    await this.tasks.app.tg.bot.telegram.pinChatMessage(task.chatId, pinTask.messageId);
  }

  private async executeUnpinPost(task: TaskItem) {
    const unpinTask = task as UnpinTgPostTask;

    await this.tasks.app.tg.bot.telegram.unpinChatMessage(task.chatId, unpinTask.messageId);
  }

  private async executeFinishPoll(task: TaskItem) {
    const finishPollTask = task as FinishTgPollTask;

    await this.tasks.app.tg.bot.telegram.stopPoll(task.chatId, finishPollTask.messageId);
  }

}