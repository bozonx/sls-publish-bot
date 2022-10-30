import {TaskTypes} from './types';


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
