import App from '../App';
import {TaskItem, TASK_TYPES} from '../types/TaskItem';
import {calcSecondsToDate} from '../helpers/helpers';
import * as fs from 'fs/promises';
import path from 'path';
import {clearTimeout} from 'timers';


const MINIMUM_SECONDS_TO_PUBLISH = 1;
const STATE_TASKS_FILENAME = 'tasks.json';


export default class TasksMain {
  private readonly app: App;
  private filePath: string;
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
    // TODO: что если ошибка
    const fileContent = await fs.readFile(this.filePath);

    this.tasks = JSON.parse(fileContent.toString('utf8'));

    // TODO: нужно ли удалять файл тасков??? впринципе он актуальный сейчас
    // TODO: запустить таймеры
  }

  async destroy() {
    // clean timeouts
    for (const taskId of Object.keys(this.timeouts)) {
      clearTimeout(this.timeouts[taskId]);

      delete this.timeouts[taskId];
    }
  }


  async addTask(task: TaskItem): Promise<number> {

    // TODO: добавить блог
    // TODO: добавить соц сеть в таски


    // TODO: validate task

    const taskNum = this.registerTask(task);
    // TODO: так а что делать то????
    if (taskNum === -1) {
      return -1;
    }

    // TODO: писать пользователю если ошибка!
    // TODO: отменить добавление если ошибка
    await this.saveTasks();

    return taskNum;
  }

  getTaskList(): Record<string, TaskItem> {
    return this.tasks;
  }

  async removeTask(taskId: string) {
    clearTimeout(this.timeouts[taskId]);

    delete this.timeouts[taskId];
    delete this.tasks[taskId];

    // TODO: что если не удалось записать??? тогда восстановить???
    await this.saveTasks();
  }


  private async saveTasks() {
    const content = JSON.stringify(this.tasks, null, 2);

    await fs.writeFile(path.resolve(), new Buffer(content, 'utf8'));
  }

  private async executeFork(task: TaskItem) {
    if (task.type === TASK_TYPES.postponePost) {
      await this.executePostponePost(task);
    }
    else if (task.type === TASK_TYPES.deletePost) {
      await this.executeDeletePost(task);
    }
    else {
      throw new Error(`Unknown task type: ${task.type}`);
    }
  }

  private async executePostponePost(task: TaskItem) {
    await this.app.tg.bot.telegram.copyMessage(
      taskData.chatId,
      this.app.config.logChannelId,
      taskData.forwardMessageId,
    );

    // TODO: если не получилось написать в лог канал
    // TODO: удалить из timeouts и tasks
  }

  private async executeDeletePost(taskData: DeletePostTypeData) {
    await this.app.tg.bot.telegram.deleteMessage(taskData.chatId, taskData.messageId);

    // TODO: если не получилось написать в лог канал
    // TODO: удалить из timeouts и tasks
  }

  private registerTask(task: TaskItem): number {
    const secondsToDate = calcSecondsToDate(task.startTime, this.app.appConfig.utcOffset);

    if (secondsToDate <= MINIMUM_SECONDS_TO_PUBLISH) {

      // TODO: сообщить в log канал

      console.warn(`Invalid seconds ${secondsToDate} to publish task ${JSON.stringify(task)}`);

      return -1;
    }

    this.tasks.push(task);

    const timeout = setTimeout(() => {
      // TODO: use log
      this.executeFork(task)
        .catch((e) => {throw e});
    }, secondsToDate * 1000);

    this.timeouts.push(timeout);

    return this.timeouts.length - 1;
  }

}
