import App from '../App';
import TaskItem, {DeletePostTypeData, PostponePostTypeData} from '../types/TaskItem';
import {TASK_TYPES} from '../types/consts';
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
    // TODO: clean timeouts
  }


  addTask(task: TaskItem): number {

    // TODO: validate task

    const taskNum = this.registerTask(task);

    if (taskNum === -1) {
      return -1;
    }

    this.saveTask(task)
      .catch((e) => {throw e});

    return taskNum;
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
    const content = 'qqqqq';

    // TODO: скопировать сообщение

    await this.app.tg.bot.telegram.sendMessage(taskData.chatId, content, {
      parse_mode: this.app.config.telegram.parseMode,
    });
  }

  private async executeDeletePost(taskData: DeletePostTypeData) {
    await this.app.tg.bot.telegram.deleteMessage(taskData.chatId, taskData.messageId);
  }

  private registerTask(task: TaskItem): number {
    const secondsToDate = calcSecondsToDate(task.startTime, this.app.config.utcOffset);

    if (secondsToDate <= MINIMUM_SECONDS_TO_PUBLISH) {

      // TODO: сообщить в log канал

      console.warn(`Invalid seconds ${secondsToDate} to publish task ${JSON.stringify(task)}`);

      return -1;
    }

    this.tasks.push(task);

    const timeout = setTimeout(() => {
      this.executeFork(task)
        .catch((e) => {throw e});
    }, secondsToDate * 1000);

    this.timeouts.push(timeout);

    return this.timeouts.length - 1;
  }

}
