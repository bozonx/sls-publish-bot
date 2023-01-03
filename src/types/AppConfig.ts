import {LogLevel} from './Logger';


export default interface AppConfig {
  botToken: string;
  notionToken: string;
  telegraPhToken: string;
  logChannelId: number | string;
  // offset of UTC in hours - 3 means Moscow or Istanbul
  utcOffset: number;
  consoleLogLevel: LogLevel;
  channelLogLevel: LogLevel;
  botChatLogLevel: LogLevel;
  dataDirPath: string;
  skipTasksEarlierSec: number;
  telegram: {
    parseMode: 'MarkdownV2';
  },
}
