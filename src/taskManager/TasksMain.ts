import App from '../App';
import TaskItem, {DeletePostTypeData, PostponePostTypeData} from '../types/TaskItem';
import {TASK_TYPES} from '../types/consts';


export default class TasksMain {
  private readonly app: App;
  private readonly tasks: TaskItem[] = [];


  constructor(app: App) {
    this.app = app;
  }


  addTask(task: TaskItem) {
    // TODO: validate task
    this.tasks.push(task);

    // TODO: add timeout
  }


  private async saveTask(task: TaskItem) {
    // TODO: save to file
  }

  private async executeFork(task: TaskItem) {
    if (task.type === TASK_TYPES.postponePost) {
      await this.executePostponePost(task.data);
    }
    else if (task.type === TASK_TYPES.deletePost) {
      await this.executeDeletePost(task.data);
    }
    else {
      throw new Error(`Unknown task type: ${task.type}`);
    }
  }

  private async executePostponePost(taskData: PostponePostTypeData) {

  }

  private async executeDeletePost(taskData: DeletePostTypeData) {

  }

}
