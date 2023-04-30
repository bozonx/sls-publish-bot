import dotenv from 'dotenv';
import {LOG_LEVELS} from 'squidlet-lib';
import AppConfig from './types/AppConfig.js';


dotenv.config();


const appConfig: AppConfig = {
  isProduction: process.env.NODE_ENV === 'production',
  botToken: process.env.BOT_TOKEN as any,
  notionToken: process.env.NOTION_TOKEN as any,
  telegraPhToken: process.env.TELEGRA_PH_TOKEN as any,
  googleApiToken: process.env.GOOGLE_API_TOKENS as any,
  logChannelId: process.env.LOG_CHANNEL_ID as any,

  consoleLogLevel: process.env.CONSOLE_LOG_LEVEL as any || LOG_LEVELS.error,
  channelLogLevel: process.env.CHANNEL_LOG_LEVEL as any || LOG_LEVELS.info,
  botChatLogLevel: process.env.BOT_CHAT_LOG_LEVEL as any || LOG_LEVELS.info,
  dataDirPath: process.env.DATA_DIR as any,
  utcOffset: Number(process.env.UTC_OFFSET || 0),
  // skip tasks which should be run earlier that specified value in seconds
  expiredTaskOffsetSec: Number(process.env.EXPIRED_TASK_OFFSET_SEC || 1),

  itemsPerPage: 10,

  telegram: {
    parseMode: 'HTML',
  },

  webServerExternalPort: process.env.WEB_SERVER_EXTERNAL_PORT as any || 443,
  webServerLocalPort: process.env.WEB_SERVER_LOCAL_PORT  as any || 3000,
  hostname: process.env.HOST_NAME || 'localhost',
  sslPrivateKeyFilePath: '/home/node/files/cert/privatekey.pem',
  sslCertFilePath: '/home/node/files/cert/certificate.pem',
}

export default appConfig
