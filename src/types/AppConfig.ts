import {LogLevel} from './Logger';

export interface ConfigChannel {
  channelId: number | string;
  name: string;
  dispname: string;
  notionContentPlanDbId: string;
  // some PUBLICATION_TYPES
  supportedTypes: string[];
  sn: {
    telegram: {
      telegraPhAuthorName: string;
      telegraPhAuthorUrl: string;
    };
    instagram: {

    };
    zen: {

    };
  };
}


export default interface AppConfig {
  botToken: string;
  notionToken: string;
  telegraPhToken: string;
  // offset of UTC in hours - 3 means Moscow
  utcOffset: number;
  consoleLogLevel: LogLevel;
  channelLogLevel: LogLevel;
  botChatLogLevel: LogLevel;
  logChannelId: number | string;
  telegram: {
    parseMode: 'MarkdownV2';
  },
  channels: ConfigChannel[];
}
