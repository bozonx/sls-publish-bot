import App from '../App';
import {TaskItem, TASK_TYPES, PostponePostTask, DeletePostTask} from '../types/TaskItem';
import {calcSecondsToDate} from '../helpers/helpers';
import * as fs from 'fs/promises';
import path from 'path';
import {clearTimeout} from 'timers';


const STATE_TASKS_FILENAME = 'tasks.json';


export default class TasksMain {
  private readonly app: App;
  private readonly filePath: string;
  // Object like {taskId: TaskItem}
  private tasks: Record<string, TaskItem> = {};
  // Object like {taskId: Timeout}
  private readonly timeouts: Record<string, NodeJS.Timeout> = {};


  constructor(app: App) {
    this.app = app;
    this.filePath = path.resolve(
      this.app.appConfig.stateDirPath,
      STATE_TASKS_FILENAME
    )
  }


  async init() {
    let fileContent: Buffer | undefined;

    try {
      fileContent = await fs.readFile(this.filePath);
    }
    catch (e: any) {
      if (e.code === 'ENOENT') {
        return;
      }
      else {
        const msg = `Can't load tasks file: ${e}`;

        this.app.channelLog.error(msg);

        throw new Error(msg);
      }
    }

    const tasks: Record<string, TaskItem> = JSON.parse(fileContent.toString('utf8'));
    // register and start timers
    for (const taskId in tasks) {
      this.registerTask(tasks[taskId], taskId);
    }
  }

  async destroy() {
    // clean timeouts
    for (const taskId of Object.keys(this.timeouts)) {
      this.clearTask(taskId);
    }
  }


  async addTask(task: TaskItem): Promise<string | null> {

    // TODO: validate task

    const taskNum = this.registerTask(task);

    if (taskNum === null) return null;

    // TODO: писать пользователю если ошибка!
    // TODO: отменить добавление если ошибка
    await this.saveTasks();

    return taskNum;
  }

  getTasksList(): Record<string, TaskItem> {
    return this.tasks;
  }

  getTask(taskId: string): TaskItem {
    return this.tasks[taskId];
  }

  async removeTask(taskId: string) {
    const removedTask = this.tasks[taskId];

    this.clearTask(taskId);

    // TODO: что если не удалось записать??? тогда восстановить???
    await this.saveTasks();
    this.app.channelLog.info(`Task ${taskId} was removed. ${JSON.stringify(removedTask)}`)
  }


  /**
   * Register a new task - set data to runtime and make timeout.
   * @return {string | null} taskId or null if task haven't added.
   * @private
   */
  private registerTask(task: TaskItem, specifiedTaskId?: string): string | null {
    const secondsToPublish = calcSecondsToDate(task.startTime, this.app.appConfig.utcOffset);

    if (secondsToPublish <= this.app.appConfig.skipTasksEarlierSec) {
      const msg = `The task has expired time to publish - ${secondsToPublish} seconds.\n`
        + `The minimum time is ${this.app.appConfig.skipTasksEarlierSec} seconds.\n`
        + `Task:\n`
        + `${JSON.stringify(task, null, 2)}`;

      this.app.channelLog.warn(msg);
      console.warn(msg);
      // means task haven't added
      return null;
    }

    const taskId: string = (specifiedTaskId)
      ? specifiedTaskId
      : String(Object.keys(this.tasks).length);

    this.tasks[taskId] = task;
    this.timeouts[taskId] = setTimeout(
      () => {
        this.executeFork(taskId)
          .catch((e) => {
            const msg = `Can't execute task "${taskId}" fork in timeout: ${e}`;

            this.clearTask(taskId);
            this.app.channelLog.error(msg);
            this.app.consoleLog.error(msg);
          });
      },
      secondsToPublish * 1000
    );

    return taskId;
  }

  private async saveTasks() {
    const content = JSON.stringify(this.tasks, null, 2);

    await fs.writeFile(path.resolve(), new Buffer(content, 'utf8'));
  }

  private async executeFork(taskId: string) {
    const task = this.tasks[taskId];

    if (task.type === TASK_TYPES.postponePost) {
      await this.executePostponePost(taskId);
    }
    else if (task.type === TASK_TYPES.deletePost) {
      await this.executeDeletePost(taskId);
    }
    else {
      throw new Error(`Unknown task type: ${task.type}`);
    }

    this.clearTask(taskId);
  }

  private async executePostponePost(taskId: string) {
    const task = this.tasks[taskId] as PostponePostTask;

    await this.app.tg.bot.telegram.copyMessage(
      task.chatId,
      this.app.config.logChannelId,
      task.forwardMessageId,
    );
  }

  private async executeDeletePost(taskId: string) {
    const task = this.tasks[taskId] as DeletePostTask;

    await this.app.tg.bot.telegram.deleteMessage(task.chatId, task.messageId);
  }

  private clearTask(taskId: string) {
    clearTimeout(this.timeouts[taskId]);

    delete this.timeouts[taskId];
    delete this.tasks[taskId];
  }

}
