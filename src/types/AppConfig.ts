import {LogLevel} from './Logger.js';


export default interface AppConfig {
  botToken: string;
  notionToken: string;
  telegraPhToken: string;
  telegraPhImageToken: string;
  logChannelId: number | string;
  // offset of UTC in hours - 3 means Moscow or Istanbul
  utcOffset: number;
  consoleLogLevel: LogLevel;
  channelLogLevel: LogLevel;
  botChatLogLevel: LogLevel;
  dataDirPath: string;
  // don't execute tasks which is going to execute in specified seconds and less
  expiredTaskOffsetSec: number;
  telegram: {
    //parseMode: 'MarkdownV2';
    parseMode: 'HTML';
  },
}
