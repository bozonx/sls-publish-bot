import {LogLevel} from './Logger.js';


export default interface AppConfig {
  isProduction: boolean;
  botToken: string;
  notionToken: string;
  telegraPhToken: string;
  googleApiToken: string;
  logChannelId: number | string;
  // offset of UTC in hours - 3 means Moscow or Istanbul
  utcOffset: number;
  consoleLogLevel: LogLevel;
  channelLogLevel: LogLevel;
  botChatLogLevel: LogLevel;
  dataDirPath: string;
  // don't execute tasks which is going to execute in specified seconds and less
  expiredTaskOffsetSec: number;
  itemsPerPage: number;
  telegram: {
    //parseMode: 'MarkdownV2';
    parseMode: 'HTML';
  },
  webServerPost: number
  hostname: string
  sslPrivateKeyFilePath?: string
  sslCertFilePath?: string
}
