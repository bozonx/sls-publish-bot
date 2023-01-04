import {SnType} from './snTypes.js';


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

export interface PostponeTgPostTask extends TaskTgBase {
  type: typeof TASK_TYPES['postponePost']
  forwardMessageId: number;
}

export interface DeleteTgPostTask extends TaskTgBase {
  type: 'deletePost'
  messageId: number;
}

export interface PinTgPostTask extends TaskTgBase {
  type: 'pinPost'
  messageId: number;
}

export interface UnpinTgPostTask extends TaskTgBase {
  type: 'unpinPost'
  messageId: number;
}

export interface FinishTgPollTask extends TaskTgBase {
  type: 'finishPoll'
  messageId: number;
}

interface TaskTgBase extends TaskItemBase {
  chatId: number | string;
  sn: 'telegram';
}

interface TaskItemBase {
  startTime: string;
  type: TaskTypes;
  sn: SnType;
}

export type TaskItem = PostponeTgPostTask
  | DeleteTgPostTask
  | PinTgPostTask
  | UnpinTgPostTask
  | FinishTgPollTask;
