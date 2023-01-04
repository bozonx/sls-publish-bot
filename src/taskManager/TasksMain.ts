import moment from 'moment';
import * as fs from 'fs/promises';
import path from 'path';
import {clearTimeout} from 'timers';
import App from '../App.js';
import {TaskItem} from '../types/TaskItem.js';
import {calcSecondsToDate} from '../lib/common.js';
import {FILE_ENCODING, MAX_TIMEOUT_SECONDS, PRINT_SHORT_DATE_TIME_FORMAT} from '../types/constants.js';
import ExecuteTask from './ExecuteTask.js';


const STATE_TASKS_FILENAME = 'tasks.json';


export default class TasksMain {
  readonly app: App;
  private readonly execute: ExecuteTask;
  private readonly filePath: string;
  // Object like {taskId: TaskItem}
  private tasks: Record<string, TaskItem> = {};
  // Object like {taskId: Timeout}
  private readonly timeouts: Record<string, NodeJS.Timeout> = {};


  constructor(app: App) {
    this.app = app;
    this.execute = new ExecuteTask(this);
    this.filePath = path.resolve(
      this.app.appConfig.dataDirPath,
      STATE_TASKS_FILENAME
    );
  }


  async init() {
    // load old tasks from disk
    const oldTasks: Record<string, TaskItem> = await this.loadOldTasks() || {};
    // register them and start timers
    for (const taskId in oldTasks) {
      this.registerTask(oldTasks[taskId], taskId);

      // TODO: не пишится что загрузилось задание если оно нормальное - надо по всем писать

      // TODO: сделать Promise run
      // this.app.channelLog.info(
      //   this.app.i18n.message.loadedTask + '\n'
      //   + this.makeTaskDetails(tasks[taskId])
      // );
    }

    // resave tasks. It removes expired tasks
    await this.saveTasks();
  }

  async destroy() {
    // clean timeouts
    for (const taskId of Object.keys(this.timeouts)) {
      this.clearTask(taskId);
    }
  }

  async addTaskAndLog(task: TaskItem): Promise<string | null> {
    await this.app.channelLog.log(
      this.app.i18n.message.taskRegistered + '\n' + this.makeTaskDetails(task)
    );

    return this.addTask(task);
  }

  async addTask(task: TaskItem): Promise<string | null> {

    // TODO: validate task

    //console.log(1111, task.startTime)

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

  async flushTask(taskId: string) {
    clearTimeout(this.timeouts[taskId]);
    // TODO: наверно лучше обработку засунуть обратно внутрь
    try {
      await this.execute.executeFork(taskId)
    }
    catch(e) {
      const msg = `Can't execute task "${taskId}" fork in timeout: ${e}`;

      this.clearTask(taskId);
      this.app.channelLog.error(msg);
      this.app.consoleLog.error(msg);
    }
  }

  async removeTask(taskId: string) {
    const removedTask = this.tasks[taskId];

    this.clearTask(taskId);

    // TODO: что если не удалось записать??? тогда восстановить???
    await this.saveTasks();
    this.app.channelLog.info(
      this.app.i18n.message.taskRemoved + '\n'
      + `taskId: ${taskId}\n`
      + this.makeTaskDetails(removedTask)
    );
  }


  //////// Public but for inner use

  clearTask(taskId: string) {
    clearTimeout(this.timeouts[taskId]);

    delete this.timeouts[taskId];
    delete this.tasks[taskId];
  }

  async saveTasks() {
    const content = JSON.stringify(this.tasks, null, 2);

    try {
      await fs.writeFile(this.filePath, Buffer.from(content, FILE_ENCODING));
    }
    catch (e) {
      const msg = `Can't save tasks file: ${e}`;

      this.app.consoleLog.error(msg);
      this.app.channelLog.error(msg);
    }
  }


  /**
   * Register a new task - set data to runtime and make timeout.
   * @return {string | null} taskId or null if task haven't added.
   * @private
   */
  private registerTask(task: TaskItem, specifiedTaskId?: string): string | null {
    // TODO: почему дата не предается???
    const secondsToPublish = calcSecondsToDate(task.startTime, this.app.appConfig.utcOffset);

    // TODO: она должна прервать выполнение и написаться ошибка пользователю
    if (secondsToPublish > MAX_TIMEOUT_SECONDS) {
      throw new Error(
        `Too big timeout number! ${task.startTime} is ${secondsToPublish} seconds. `
        + `Max is (${MAX_TIMEOUT_SECONDS}) seconds (24 days)`
      );
    }

    //console.log(2222, secondsToPublish)

    // TODO: если слишком большое время ожидания то короче глюк - надо просто сохранить
    // TODO: сделать крон который будет поднимать отложенные задачи и регистрировать

    // TODO: зачем нужно skipTasksEarlierSec ???
    if (secondsToPublish <= this.app.appConfig.skipTasksEarlierSec) {
      const msg = `The task has expired time to publish - ${secondsToPublish} seconds.\n`
        + `The minimum time is ${this.app.appConfig.skipTasksEarlierSec} seconds.\n`
        + `Task:\n`
        + this.makeTaskDetails(task);

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
        this.execute.executeFork(taskId)
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

  private makeTaskDetails(task: TaskItem): string {
    let result = `${this.app.i18n.commonPhrases.type}: ${task.type}\n`
      + `${this.app.i18n.commonPhrases.date}: ${moment(task.startTime).format(PRINT_SHORT_DATE_TIME_FORMAT)}\n`;

    if (task.sn) {
      result += `${this.app.i18n.commonPhrases.sn}: ${task.sn}`;
    }

    return result;
  }

  private async loadOldTasks(): Promise<Record<string, TaskItem> | undefined> {
    try {
      const fileContent: Buffer | undefined = await fs.readFile(this.filePath);

      return JSON.parse(fileContent.toString(FILE_ENCODING));
    }
    catch (e: any) {
      if (e.code === 'ENOENT') {
        // if no file then do nothing
        return;
      }
      else {
        const msg = `Can't load tasks file: ${e}`;

        this.app.channelLog.error(msg);

        throw new Error(msg);
      }
    }
  }

}
