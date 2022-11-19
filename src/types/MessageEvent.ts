interface PhotoEventData {
  fileId: string;
  fileUniqueId: string;
  fileSize?: number;
  width: number;
  height: number;
}

export default interface MessageEventBase {
  messageId: number;
  fromId: number;
  chatId: number;
  date: number;
}

export interface TextMessageEvent extends MessageEventBase {
  text: string;
}

export interface PhotoMessageEvent extends MessageEventBase {
  photo: PhotoEventData;
  caption?: string;
}

export interface MediaGroupItemMessageEvent extends MessageEventBase {
  photo: PhotoEventData;
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
