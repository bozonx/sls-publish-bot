import {LogLevel} from './Logger';


export default interface AppConfig {
  // offset of UTC in hours - 3 means Moscow or Istanbul
  utcOffset: number;
  consoleLogLevel: LogLevel;
  channelLogLevel: LogLevel;
  botChatLogLevel: LogLevel;
  stateDirPath: string;
  skipTasksEarlierSec: number;
  telegram: {
    parseMode: 'MarkdownV2';
  },
}
