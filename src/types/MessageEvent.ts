import {TgEntity} from './TgEntity.js';

export interface PhotoUrlData {
  type: 'photoUrl',
  url: string,
}

export interface PhotoData {
  type: 'photo',
  fileId: string;
  fileUniqueId: string;
  fileSize?: number;
  width: number;
  height: number;
}

export interface VideoData {
  type: 'video',
  fileId: string;
  fileUniqueId: string;
  fileSize?: number;
  width: number;
  height: number;
  duration: number
  // 'video/mp4'
  mimeType?: string;
}

export default interface MessageEventBase {
  messageId: number;
  // It is chat where message is.
  // * If it forwarded then chatId is original chat of message
  // * If it isn't forwarded then it is chat id of user
  chatId: number;
  date: number;
}

export interface TextMessageEvent extends MessageEventBase {
  text: string;
  entities?: TgEntity[];
}

export interface PhotoMessageEvent extends MessageEventBase {
  photo: PhotoData;
  caption?: string;
}

export interface VideoMessageEvent extends MessageEventBase {
  video: VideoData;
  caption?: string;
}

export interface MediaGroupItemMessageEvent extends MessageEventBase {
  photo: PhotoData;
  caption?: string;
  mediaGroupId: number;
}

export interface PollMessageEvent extends MessageEventBase {
  poll: {
    // TODO: use PollData
    // id: string,
    question: string,
    // TODO: а чё всмысле ???
    options: string[][],
    isClosed: false,
    isAnonymous: boolean,
    type: 'regular' | 'quiz',
    multipleAnswers: boolean;
    correctOptionId?: number;
  }
}
