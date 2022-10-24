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
      notionRawPagesDbId: '60be6ecd4b4d41ae83e72a807d889052',
      supportedTypes: [
        PublicationTypes.Article,
        PublicationTypes.Post1000,
      ]
    },
  ]
}

export default conf;
