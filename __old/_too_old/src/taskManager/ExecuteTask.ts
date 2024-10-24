import TasksMain from './TasksMain';
import {
  CloneTgPostTask,
  DeleteTgPostTask,
  FinishTgPollTask,
  PinTgPostTask,
  PostponeTgPostTask,
  TASK_TYPES, TaskItem,
  UnpinTgPostTask
} from '../types/TaskItem';
import {makeTaskDetails} from './makeTaskDetails';
import {publishTgCopy, publishTgMediaGroup} from '../apiTg/publishTg';


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
      case TASK_TYPES.clonePost:
        return await this.executeClonePost(task);
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

    if (postponeTask.mediaGroup) {
      createdMessagesIds = await publishTgMediaGroup(
        this.tasks.app,
        postponeTask.chatId,
        postponeTask.mediaGroup,
        postponeTask.mediaGroupCaptionHtml,
      )
    }
    else if (typeof postponeTask.messageIdToCopy !== 'undefined') {
      // just copy message if it isn't a mediaGroup
      createdMessagesIds[0] = await publishTgCopy(
        this.tasks.app,
        postponeTask.chatId,
        this.tasks.app.appConfig.logChannelId,
        postponeTask.messageIdToCopy,
        postponeTask.urlBtn
      )
    }
    else {
      const msg = `Empty messageIdToCopy of mediaGroup`

      this.tasks.app.consoleLog.error(msg)
      this.tasks.app.channelLog.error(msg)

      return
    }

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

  private async executeClonePost(task: TaskItem) {
    const cloneTask = task as CloneTgPostTask

    await Promise.all(cloneTask.messageIds.map((msgId) => {
      return this.tasks.app.tg.bot.telegram.copyMessage(
        cloneTask.toChatId,
        cloneTask.chatId,
        msgId
      )
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