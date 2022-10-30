import {TaskTypes} from './types';


export interface PostponePostTypeData {
  chatId: number;
  forwardMessageId: number;
  //allowLinkPreview: boolean;
  //isImageDescr: boolean;
  // TODO: add images
}

export interface DeletePostTypeData {
  chatId: number;
  messageId: number;
}


export default interface TaskItem {
  startTime: string;
  type: TaskTypes;
  // TODO: должно быть или или
  data: PostponePostTypeData | DeletePostTypeData
}
