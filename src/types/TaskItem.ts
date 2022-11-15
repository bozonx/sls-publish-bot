export const TASK_TYPES: Record<TaskTypes, TaskTypes> = {
  postponePost: 'postponePost',
  deletePost: 'deletePost',
  pinPost: 'pinPost',
  unpinPost: 'unpinPost',
  finishPoll: 'finishPoll',
};


export type TaskTypes = 'postponePost'
  | 'deletePost'
  | 'pinPost'
  | 'unpinPost'
  | 'finishPoll';


export interface PostponePostTask extends TaskTgBase {
  forwardMessageId: number;
}

export interface DeletePostTask extends TaskTgBase {
  messageId: number;
}

export interface PinPostTask extends TaskTgBase {
  messageId: number;
}

export interface UnpinPostTask extends TaskTgBase {
  messageId: number;
}

export interface FinishPollTask extends TaskTgBase {
  messageId: number;
}

interface TaskTgBase extends TaskItemBase {
  chatId: number | string;
  sn: 'telegram';
  //blogUname: string;
}

interface TaskItemBase {
  startTime: string;
  type: TaskTypes;
}

export type TaskItem = PostponePostTask
  | DeletePostTask
  | PinPostTask
  | UnpinPostTask
  | FinishPollTask;
