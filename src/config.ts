import dotenv from 'dotenv';
import AppConfig from './types/AppConfig';
import {PublicationTypes} from "./types/consts";


dotenv.config();

const conf: AppConfig = {
  botToken: process.env.BOT_TOKEN as any,
  notionToken: process.env.NOTION_TOKEN as any,
  channels: [
    {
      channelId: '',
      name: 'test',
      dispname: 'Тестовый канал',
      notionRawPagesDbId: '7c866a978313462a9d164a7e3923f1bc',
      supportedTypes: [
        PublicationTypes.Article,
        PublicationTypes.Post1000,
      ]
    },
  ]
}

export default conf;
