export const TASK_TYPES: Record<TaskTypes, TaskTypes> = {
  postponePost: 'postponePost',
  deletePost: 'deletePost',
};


export type TaskTypes = 'postponePost'
  | 'deletePost';


export interface PostponePostTask extends TaskSnBase {
  forwardMessageId: number;
}

export interface DeletePostTask extends TaskSnBase {
  messageId: number;
}

interface TaskSnBase extends TaskItemBase {
  chatId: number | string;
  blogUname: string;
  sn: string;
}

interface TaskItemBase {
  startTime: string;
  type: TaskTypes;
}

export type TaskItem = PostponePostTask | DeletePostTask;
