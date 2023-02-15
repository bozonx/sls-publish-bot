import {SnType} from './snTypes.js';
import {TgReplyBtnUrl} from './TgReplyButton.js';
import {PrimitiveMediaGroup} from './types.js';


export const TASK_TYPES: Record<TaskTypes, TaskTypes> = {
  postponePost: 'postponePost',
  deletePost: 'deletePost',
  clonePost: 'clonePost',
  pinPost: 'pinPost',
  unpinPost: 'unpinPost',
  finishPoll: 'finishPoll',
};


export type TaskTypes = 'postponePost'
  | 'deletePost'
  | 'clonePost'
  | 'pinPost'
  | 'unpinPost'
  | 'finishPoll';

export interface PostponeTgPostTask extends TaskTgBase {
  type: typeof TASK_TYPES['postponePost']
  messageIdToCopy?: number
  urlBtn?: TgReplyBtnUrl
  // in full ISO format like '2022-11-01T19:58:00+03:00'
  autoDeleteDateTime?: string
  // in full ISO format like '2022-11-01T19:58:00+03:00'
  closePollDateTime?: string
  mediaGroupCaptionHtml?: string
  mediaGroup?: PrimitiveMediaGroup[]
}

export interface DeleteTgPostTask extends TaskTgBase {
  type: 'deletePost'
  messageIds: number[]
}

export interface CloneTgPostTask extends TaskTgBase {
  type: 'clonePost'
  messageIds: number[]
  toChatId: number | string
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
