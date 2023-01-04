import TasksMain from './TasksMain.js';
import {
  DeletePostTask,
  FinishPollTask,
  PinPostTask,
  PostponePostTask,
  TASK_TYPES,
  UnpinPostTask
} from '../types/TaskItem.js';


export default class ExecuteTask {
  private readonly tasks: TasksMain;


  constructor(tasks: TasksMain) {
    this.tasks = tasks;

  }

  // TODO: review

  async executeFork(taskId: string) {
    const task = this.tasks.getTask(taskId);

    if (task.type === TASK_TYPES.postponePost) {
      await this.executePostponePost(taskId);
    }
    else if (task.type === TASK_TYPES.deletePost) {
      await this.executeDeletePost(taskId);
    }
    else if (task.type === TASK_TYPES.pinPost) {
      await this.executePinPost(taskId);
    }
    else if (task.type === TASK_TYPES.unpinPost) {
      await this.executeUnpinPost(taskId);
    }
    else if (task.type === TASK_TYPES.finishPoll) {
      await this.executeFinishPoll(taskId);
    }
    else {
      throw new Error(`Unknown task type: ${task.type}`);
    }

    this.tasks.clearTask(taskId);
    // TODO: проверить ошибку
    await this.tasks.saveTasks();

    this.tasks.app.channelLog.log(
      this.tasks.app.i18n.message.taskDoneSuccessful + '\n' + this.makeTaskDetails(task)
    );
  }


  private async executePostponePost(taskId: string) {
    const task = this.tasks.getTask(taskId) as PostponePostTask;

    await this.tasks.app.tg.bot.telegram.copyMessage(
      task.chatId,
      this.tasks.app.appConfig.logChannelId,
      task.forwardMessageId,
    );
  }

  private async executeDeletePost(taskId: string) {
    const task = this.tasks.getTask(taskId) as DeletePostTask;

    await this.tasks.app.tg.bot.telegram.deleteMessage(task.chatId, task.messageId);
  }

  private async executePinPost(taskId: string) {
    const task = this.tasks.getTask(taskId) as PinPostTask;

    await this.tasks.app.tg.bot.telegram.pinChatMessage(task.chatId, task.messageId);
  }

  private async executeUnpinPost(taskId: string) {
    const task = this.tasks.getTask(taskId) as UnpinPostTask;

    await this.tasks.app.tg.bot.telegram.unpinChatMessage(task.chatId, task.messageId);
  }

  private async executeFinishPoll(taskId: string) {
    const task = this.tasks.getTask(taskId) as FinishPollTask;

    await this.tasks.app.tg.bot.telegram.stopPoll(task.chatId, task.messageId);
  }

}