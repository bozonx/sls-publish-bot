import { Context, Telegraf } from 'telegraf';
import App from '../App';
import TgChat from './TgChat';
import MessageEvent, {PhotoMessageEvent, TextMessageEvent} from '../types/MessageEvent';
import _ from 'lodash';
import {PhotoSize} from 'typegram/message';
import MessageEventBase from '../types/MessageEvent';


export default class TgMain {
  public readonly bot: Telegraf;
  private readonly app: App;
  // chats where users talk to bot
  private readonly chats: Record<string, TgChat> = {};


  constructor(app: App) {
    this.app = app;
    this.bot = new Telegraf(this.app.config.botToken);
  }


  async init() {
    this.bot.start((ctx: Context) => {
      if (!ctx.chat?.id) throw new Error(`No chat id`);

      if (!this.chats[ctx.chat.id]) {
        this.chats[ctx.chat.id] = new TgChat(ctx.chat.id, this.app);
      }

      this.chats[ctx.chat.id].startCmd()
        .catch((e) => this.app.consoleLog.error(e));
    });

    this.addListeners();

    await this.bot.launch();
    await this.app.channelLog.info('Bot launched');
    this.app.consoleLog.info('Bot launched');
  }

  async destroy(reason: string) {
    for (const itemIndex in this.chats) {
      await this.chats[itemIndex].destroy();
      // @ts-ignore
      this.chats[itemIndex] = undefined;
    }

    this.bot.stop(reason);
  }

/*
forwarded

{
  message_id: 2230,
  from: {
    id: 456361709,
    is_bot: false,
    first_name: 'Ivan Kozyrin',
    username: 'ivan_k8',
    language_code: 'en'
  },
  chat: {
    id: 456361709,
    first_name: 'Ivan Kozyrin',
    username: 'ivan_k8',
    type: 'private'
  },
  date: 1667630314,
  forward_from_chat: {
    id: -1001664865912,
    title: 'sls_publish_test',
    username: 'sls_publish_test',
    type: 'channel'
  },
  forward_from_message_id: 263,
  forward_date: 1667581797,
  photo: [
    {
      file_id: 'AgACAgQAAxkBAAIItmNmBOpPxm2BpQjkxHY2u3jVxt5pAALmrjEbTA0tU5A43oOhGgsZAQADAgADcwADKwQ',
      file_unique_id: 'AQAD5q4xG0wNLVN4',
      file_size: 1664,
      width: 90,
      height: 90
    },
    {
      file_id: 'AgACAgQAAxkBAAIItmNmBOpPxm2BpQjkxHY2u3jVxt5pAALmrjEbTA0tU5A43oOhGgsZAQADAgADbQADKwQ',
      file_unique_id: 'AQAD5q4xG0wNLVNy',
      file_size: 34260,
      width: 320,
      height: 320
    },
    {
      file_id: 'AgACAgQAAxkBAAIItmNmBOpPxm2BpQjkxHY2u3jVxt5pAALmrjEbTA0tU5A43oOhGgsZAQADAgADeAADKwQ',
      file_unique_id: 'AQAD5q4xG0wNLVN9',
      file_size: 175247,
      width: 800,
      height: 800
    },
    {
      file_id: 'AgACAgQAAxkBAAIItmNmBOpPxm2BpQjkxHY2u3jVxt5pAALmrjEbTA0tU5A43oOhGgsZAQADAgADeQADKwQ',
      file_unique_id: 'AQAD5q4xG0wNLVN-',
      file_size: 229593,
      width: 960,
      height: 960
    }
  ],
  caption: 'абзац1\n' +
    '\n' +
    'строка1. _ ~ - (gggg) [bbbb]\n' +
    'строка2\n' +
    '\n' +
    '\n' +
    'абзац с большим оступом\n' +
    '\n' +
    '* эл1\n' +
    '* эл2\n' +
    '\n' +
    'заголовок 2у\n' +
    '\n' +
    '1. нумерованный\n' +
    '2. список\n' +
    '\n' +
    'Заголовок 3у\n' +
    '\n' +
    'форматированный текст наклонный жирный подчёркнутый перечёркнутый код\n' +
    '\n' +
    'ссылка text\n' +
    '\n' +
    '| цитата\n' +
    '| стр2\n' +
    '\n' +
    'ввв\n' +
    '\n' +
    '\n' +
    'большой код\n' +
    '\n' +
    '\n' +
    'маленькая палка\n' +
    '\n' +
    '—\n' +
    '\n' +
    'большая палка\n' +
    '\n' +
    '---\n' +
    '\n' +
    'пррр\n' +
    '\n' +
    'заголовок1у\n' +
    '\n' +
    'СОЖ 🌴 | #вв #аа #пп',
  caption_entities: [
    { offset: 85, length: 12, type: 'bold' },
    { offset: 126, length: 12, type: 'bold' },
    { offset: 162, length: 9, type: 'italic' },
    { offset: 172, length: 6, type: 'bold' },
    { offset: 179, length: 12, type: 'underline' },
    { offset: 192, length: 13, type: 'strikethrough' },
    { offset: 206, length: 3, type: 'code' },
    {
      offset: 211,
      length: 6,
      type: 'text_link',
      url: 'https://duckduckgo.com/?t=ffab&q=javascript+regexp&ia=web'
    },
    { offset: 247, length: 12, type: 'pre', language: 'javascript' },
    { offset: 307, length: 11, type: 'bold' },
    {
      offset: 320,
      length: 6,
      type: 'text_link',
      url: 'https://t.me/+DT00UFZf3_IwYmY6'
    },
    { offset: 329, length: 3, type: 'hashtag' },
    { offset: 333, length: 3, type: 'hashtag' },
    { offset: 337, length: 3, type: 'hashtag' }
  ]
}


photo
Context {
  update: {
    update_id: 291272581,
    message: {
      message_id: 2235,
      from: [Object],
      chat: [Object],
      date: 1667630503,
      photo: [Array],
      caption: 'ff'
    }
  },
  telegram: Telegram {
    token: '5570365803:AAFDzu1g29UPpj_Ni-UPgR55nE5QXetVJ4Q',
    response: undefined,
    options: {
      apiRoot: 'https://api.telegram.org',
      apiMode: 'bot',
      webhookReply: true,
      agent: [Agent],
      attachmentAgent: undefined,
      testEnv: false
    }
  },
  botInfo: {
    id: 5570365803,
    is_bot: true,
    first_name: 'sls_publish_test_bot',
    username: 'sls_publish_test_bot',
    can_join_groups: true,
    can_read_all_group_messages: false,
    supports_inline_queries: false
  },
  state: {}
}

 */

  private addListeners() {
    this.bot.on('callback_query', (ctx) => {
      if (!ctx.chat?.id) {
        this.app.consoleLog.warn('No chat id in callback_query');

        return;
      }
      else if (!this.chats[ctx.chat.id]) {
        this.app.consoleLog.error(`No chat id (${ctx.chat.id}) for handling callback query`)

        return;
      }

      this.chats[ctx.chat.id].handleCallbackQueryEvent(ctx.update.callback_query.data);
    });

    // text
    // document
    // poll

    // this.bot.on('text', (ctx) => {
    //   const message = ctx.update.message;
    //
    //   if (!message.chat.id) {
    //     this.app.consoleLog.warn('No chat id in text event');
    //
    //     return;
    //   }
    //   if (!this.chats[message.chat.id]) {
    //     this.app.consoleLog.error(`No chat id (${message.chat.id}) for handling income message`)
    //
    //     return;
    //   }
    //
    //   const msgEvent: TextMessageEvent = {
    //     messageId: message.message_id,
    //     fromId: message.from.id,
    //     chatId: message.chat.id,
    //     date: message.date,
    //     text: message.text,
    //   };
    //
    //   this.chats[ctx.chat.id].handleIncomeTextEvent(msgEvent);
    // })

    // this.bot.on('photo', (ctx) => {
    //   const message = ctx.update.message;
    //
    //   if (!message.chat.id) {
    //     this.app.consoleLog.warn('No chat id in photo event');
    //
    //     return;
    //   }
    //   if (!this.chats[message.chat.id]) {
    //     this.app.consoleLog.error(`No chat id (${message.chat.id}) for handling income message`)
    //
    //     return;
    //   }
    //
    //   const lastPhoto: PhotoSize = message.photo[message.photo.length - 1];
    //   const msgEvent: PhotoMessageEvent = {
    //     messageId: message.message_id,
    //     fromId: message.from.id,
    //     chatId: message.chat.id,
    //     date: message.date,
    //     caption: message.caption,
    //     photo: {
    //       fileId: lastPhoto.file_id,
    //       fileUniqueId: lastPhoto.file_unique_id,
    //       fileSize: lastPhoto.file_size,
    //       width: lastPhoto.width,
    //       height: lastPhoto.height,
    //     }
    //   };
    //
    //   this.chats[ctx.chat.id].handleIncomePhotoEvent(msgEvent);
    //
    //   console.log(333, ctx.update.message)
    // })

    this.bot.on('message', (ctx) => {

      const message = ctx.update.message;

      if (!message.chat?.id) {
        this.app.consoleLog.warn('No chat id in message event');

        return;
      }
      if (!this.chats[message.chat.id]) {
        this.app.consoleLog.error(`No chat id (${message.chat.id}) for handling income message`)

        return;
      }

      const msgBase: MessageEventBase = {
        messageId: message.message_id,
        fromId: message.from.id,
        chatId: message.chat.id,
        date: message.date,
      }

      if ((message as any).text) {
        this.chats[ctx.chat.id].handleIncomeTextEvent({
          ...msgBase,
          text: (message as any).text,
        });
      }
      else if ((message as any).photo) {
        const lastPhoto = _.last((message as any).photo) as PhotoSize;

        this.chats[ctx.chat.id].handleIncomePhotoEvent({
          ...msgBase,
          caption: (message as any).caption,
          photo: {
            fileId: lastPhoto.file_id,
            fileUniqueId: lastPhoto.file_unique_id,
            fileSize: lastPhoto.file_size,
            width: lastPhoto.width,
            height: lastPhoto.height,
          }
        });
      }
      else if ((message as any).media_group_id) {
        const lastPhoto = _.last((message as any).photo) as PhotoSize;

        this.chats[ctx.chat.id].handleIncomeMediaGroupItemEvent({
          ...msgBase,
          caption: (message as any).caption,
          mediaGroupId: (message as any).media_group_id,
          photo: {
            fileId: lastPhoto.file_id,
            fileUniqueId: lastPhoto.file_unique_id,
            fileSize: lastPhoto.file_size,
            width: lastPhoto.width,
            height: lastPhoto.height,
          }
        });
      }

      console.log(11111, message)

      const msg: string = (ctx.update.message as any).text;

      //this.chats[ctx.chat.id].handleIncomeMessageEvent(msg);
    });
  }

}
