import App from '../App';
import {TaskItem, TASK_TYPES} from '../types/TaskItem';
import {calcSecondsToDate} from '../helpers/helpers';


const MINIMUM_SECONDS_TO_PUBLISH = 1;


export default class TasksMain {
  private readonly app: App;
  private readonly tasks: TaskItem[] = [];
  private readonly timeouts: NodeJS.Timeout[] = [];


  constructor(app: App) {
    this.app = app;
  }


  async init() {
    // TODO: restore tasks
  }

  async destroy() {
    // clean timeouts
    for (const itemIndex in this.timeouts) {
      clearTimeout(this.timeouts[itemIndex]);
      // @ts-ignore
      this.timeouts[itemIndex] = undefined;
    }
  }


  addTask(task: TaskItem): number {

    // TODO: добавить блог
    // TODO: добавить соц сеть в таски


    // TODO: validate task

    const taskNum = this.registerTask(task);

    if (taskNum === -1) {
      return -1;
    }

    // TODO: use log
    this.saveTask(task)
      .catch((e) => {throw e});

    return taskNum;
  }

  getTaskList(): TaskItem[] {
    return this.tasks;
  }


  private async saveTask(task: TaskItem) {
    // TODO: save to file
  }

  private async loadTasks(): Promise<TaskItem[]> {
    // TODO: read from file
    return [];
  }

  private async executeFork(task: TaskItem) {
    if (task.type === TASK_TYPES.postponePost) {
      await this.executePostponePost(task.data as PostponePostTypeData);
    }
    else if (task.type === TASK_TYPES.deletePost) {
      await this.executeDeletePost(task.data as DeletePostTypeData);
    }
    else {
      throw new Error(`Unknown task type: ${task.type}`);
    }
  }

  private async executePostponePost(taskData: PostponePostTypeData) {
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
