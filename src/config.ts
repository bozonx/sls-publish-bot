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
      notionRawPagesDbId: '7c866a978313462a9d164a7e3923f1bc',
    },
  ]
}

export default conf;
