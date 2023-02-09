import * as fs from 'fs/promises';
import path from 'path';
import {clearTimeout} from 'timers';
import App from '../App.js';
import {TaskItem} from '../types/TaskItem.js';
import {calcSecondsToDate} from '../lib/common.js';
import {FILE_ENCODING} from '../types/constants.js';
import ExecuteTask from './ExecuteTask.js';
import {makeTaskDetails} from './makeTaskDetails.js';
import {validateTask} from './validateTask.js';


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
    this.filePath = path.resolve(this.app.appConfig.dataDirPath, STATE_TASKS_FILENAME);
  }


  async init() {
    // load old tasks from disk
    const oldTasks: Record<string, TaskItem> = await this.loadOldTasks() || {};
    // register them and start timers
    for (const taskId in oldTasks) {
      const task = oldTasks[taskId];
      const validateResult = await validateTask(task, this.app);

      if (validateResult) {
        this.app.channelLog.warn(`Task was skipped: ` + validateResult)
        // skip not valid tasks
        continue;
      }

      this.registerTask(task, taskId);
    }
    // resave tasks. It removes expired tasks
    // do noting on error
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
      this.app.i18n.message.taskRegistered
        + '\n' + await makeTaskDetails(task, this.app)
    )

    return this.addTaskSilently(task);
  }

  getTasksList(): Record<string, TaskItem> {
    return this.tasks;
  }

  getTask(taskId: string): TaskItem | undefined {
    return this.tasks[taskId];
  }

  /**
   * Run task wright now
   */
  async flushTask(taskId: string) {
    return this.execute.execute(taskId)
  }

  async removeTask(taskId: string) {
    const removedTask = this.tasks[taskId];

    this.clearTask(taskId)
    // do noting on error
    await this.saveTasks()
    this.app.channelLog.info(
      this.app.i18n.message.taskRemoved + '\n'
      + `taskId: ${taskId}\n`
      + await makeTaskDetails(removedTask, this.app)
    );
  }


  //////// Public but for inner use

  /**
   * Add task
   * @return if sting - taskId, if null - task haven't been added
   */
  async addTaskSilently(task: TaskItem): Promise<string | null> {
    const validateResult = await validateTask(task, this.app);

    if (validateResult) {
      this.app.channelLog.error(`Task was skipped: ` + validateResult)
      // skip not valid tasks
      return null;
    }

    const taskNum = this.registerTask(task);
    // do noting on error
    await this.saveTasks()

    return taskNum;
  }

  /**
   * Totally remove silent task
   */
  clearTask(taskId: string) {
    clearTimeout(this.timeouts[taskId]);

    delete this.timeouts[taskId];
    delete this.tasks[taskId];
  }

  async saveTasks(): Promise<boolean> {
    const content = JSON.stringify(this.tasks, null, 2);

    try {
      await fs.writeFile(this.filePath, Buffer.from(content, FILE_ENCODING));

      return true;
    }
    catch (e) {
      const msg = `Can't save tasks file: ${e}`;

      this.app.consoleLog.error(msg);
      this.app.channelLog.error(msg);

      return false;
    }
  }

  /**
   * Register a new valid task - set data to runtime and make timeout.
   * Please validate task before
   * @return {string} taskId
   * @private
   */
  private registerTask(task: TaskItem, specifiedTaskId?: string): string {
    // seconds from now to start time
    const secondsToPublish = calcSecondsToDate(task.startTime, this.app.appConfig.utcOffset);
    const taskId: string = (specifiedTaskId)
      ? specifiedTaskId
      : String(Object.keys(this.tasks).length);

    //console.log(2222, secondsToPublish)

    this.tasks[taskId] = task;
    this.timeouts[taskId] = setTimeout(() => {
      this.execute.execute(taskId).catch((e) => this.app.consoleLog.error(e));
    },secondsToPublish * 1000);

    return taskId;
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
