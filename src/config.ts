import dotenv from 'dotenv';
import AppConfig from './types/AppConfig';


dotenv.config();

const conf: AppConfig = {
  botToken: process.env.BOT_TOKEN as any,
  notionToken: process.env.NOTION_TOKEN as any,
  channels: [
    {
      name: 'test',
      dispname: 'Тестовый канал',
      id: '',
    },
  ]
}

export default conf;
