export const TASK_TYPES: Record<TaskTypes, TaskTypes> = {
  postponePost: 'postponePost',
  deletePost: 'deletePost',
};


export type TaskTypes = 'postponePost'
  | 'deletePost';

export interface PostponePostTypeData {
  chatId: number | string;
  forwardMessageId: number;
}

export interface DeletePostTypeData {
  chatId: number | string;
  messageId: number;
}


export default interface TaskItem {
  startTime: string;
  type: TaskTypes;
  // TODO: должно быть или или
  data: PostponePostTypeData | DeletePostTypeData
}
