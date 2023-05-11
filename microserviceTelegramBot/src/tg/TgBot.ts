import {IndexedEventEmitter} from 'squidlet-lib';
import {Context, Telegraf, Format, Types} from 'telegraf';
import {Message, PhotoSize, Video} from 'typegram/message';
import {Main} from '../Main.js';


const EVENT_DELIMITER = '|'

export enum TG_BOT_EVENT {
  cmdStart,
  //launched,
  callbackQuery,
}


export class TgBot {
  private readonly main: Main
  private events = new IndexedEventEmitter()

  // TODO: лучше не создавать инстансы бота, а напрямую делать запросы
  // like {botToken: Telegraf}
  private readonly bots: Record<string, Telegraf> = {}


  constructor(main: Main) {
    this.main = main
  }

  async destroy(reason: string) {
    this.events.destroy()

    for (const token of Object.keys(this.bots)) {
      this.bots[token].stop(reason)
    }
  }


  async sendTextMessage(
    botToken: string,
    chatId: number | string,
    text: string | Format.FmtString,
    extra?: Types.ExtraReplyMessage
  ) {
    const bot = await this.resolveBot(botToken)

    return await bot.telegram.sendMessage(chatId, text, extra)
  }

  async sendPhotoMessage(botToken: string, chatId: number | string) {
    const bot = await this.resolveBot(botToken)

    // TODO: add
  }

  async sendVideoMessage(botToken: string, chatId: number | string) {
    const bot = await this.resolveBot(botToken)

    // TODO: add
  }

  async sendAudioMessage(botToken: string, chatId: number | string) {
    const bot = await this.resolveBot(botToken)

    // TODO: add
  }

  async sendPollMessage(botToken: string, chatId: number | string) {
    const bot = await this.resolveBot(botToken)

    // TODO: add
  }

  async deleteMessage(botToken: string, chatId: number | string, msgId: number) {
    const bot = await this.resolveBot(botToken)

    await bot.telegram.deleteMessage(chatId, msgId)
  }

  onCmdStart(handler:(botToken: string, chatId: string) => void) {
    return this.events.addListener(TG_BOT_EVENT.cmdStart, handler)
  }


  // onBotLaunched(botToken: string, handler:() => void) {
  //   const eventName = botToken + EVENT_DELIMITER + TG_BOT_EVENT.launched
  //
  //   return this.events.addListener(eventName, handler)
  // }

  onCallbackQuery(botToken: string, chatId: number | string, handler: (queryData: string) => void): number {
    const eventName = botToken + EVENT_DELIMITER + chatId + EVENT_DELIMITER
      + TG_BOT_EVENT.callbackQuery

    return this.events.addListener(eventName, handler)
  }

  onTextMessage(botToken: string) {

  }

  onPhotoMessage(botToken: string) {

  }

  onVideoMessage(botToken: string) {

  }

  onAudioMessage(botToken: string) {

  }

  onPollMessage(botToken: string) {

  }


  private async resolveBot(botToken: string) {
    if (this.bots[botToken]) return this.bots[botToken]

    this.bots[botToken] = new Telegraf(botToken, {
      telegram: {
        testEnv: !this.main.config.isProduction,
      }
    })

    await this.initBot(botToken)

    return this.bots[botToken]
  }

  private async initBot(botToken: string) {
    const bot = this.bots[botToken]

    bot.start((ctx: Context) => {
      if (typeof ctx.chat?.id === 'undefined') return

      this.events.emit(TG_BOT_EVENT.cmdStart, botToken, ctx.chat.id)
    });

    bot.on('callback_query', (ctx) => {
      if (!ctx.chat?.id) {
        this.main.log.warn('No chat id in callback_query');

        return;
      }

      const eventName = botToken + EVENT_DELIMITER + ctx.chat.id + EVENT_DELIMITER
        + TG_BOT_EVENT.callbackQuery

      this.events.emit(eventName, (ctx.update.callback_query as  any).data)
    });

    // this.bot.on('message', (ctx) => {
    //   // uncomment this to find channel id by forwarding a message
    //   //console.log('--- forwarded', (ctx.update?.message as any)?.forward_from_chat)
    //
    //   const message: Message.CommonMessage = ctx.update.message;
    //
    //   //console.log(1111, JSON.stringify(message, null, 2))
    //
    //   if (!message.chat?.id) {
    //     this.ctx.consoleLog.warn('No chat id in message event');
    //
    //     return;
    //   }
    //   if (!this.chats[message.chat.id]) {
    //     ctx.reply(this.ctx.i18n.errors.notRegisteredChat);
    //     //this.ctx.consoleLog.error(`No chat id (${message.chat.id}) for handling income message`)
    //
    //     return;
    //   }
    //
    //   const msgBase: MessageEventBase = {
    //     messageId: (typeof message.forward_from_message_id === 'undefined')
    //       ? message.message_id
    //       : message.forward_from_message_id,
    //     chatId: (typeof message.forward_from_chat === 'undefined')
    //       ? message.chat.id
    //       : message.forward_from_chat.id,
    //     date: message.date,
    //   }
    //
    //   if ((message as any).text) {
    //     this.chats[ctx.chat.id].handleIncomeTextEvent({
    //       ...msgBase,
    //       text: (message as any).text,
    //       entities: (message as any).entities,
    //     });
    //   }
    //   else if ((message as any).photo) {
    //     const lastPhoto = _.last((message as any).photo) as PhotoSize;
    //
    //     this.chats[ctx.chat.id].handleIncomePhotoEvent({
    //       ...msgBase,
    //       caption: (message as any).caption,
    //       entities: (message as any).caption_entities,
    //       photo: {
    //         type: 'photo',
    //         fileId: lastPhoto.file_id,
    //         fileUniqueId: lastPhoto.file_unique_id,
    //         fileSize: lastPhoto.file_size,
    //         width: lastPhoto.width,
    //         height: lastPhoto.height,
    //       }
    //     });
    //   }
    //   else if ((message as any).video) {
    //     const video = (message as any).video as Video;
    //
    //     this.chats[ctx.chat.id].handleIncomeVideoEvent({
    //       ...msgBase,
    //       caption: (message as any).caption,
    //       entities: (message as any).caption_entities,
    //       video: {
    //         type: 'video',
    //         fileId: video.file_id,
    //         fileUniqueId: video.file_unique_id,
    //         fileSize: video.file_size,
    //         width: video.width,
    //         height: video.height,
    //         duration: video.duration,
    //         mimeType: video.mime_type,
    //       }
    //     });
    //   }
    //     // else if ((message as any).media_group_id) {
    //     //   const lastPhoto = _.last((message as any).photo) as PhotoSize;
    //     //
    //     //   this.chats[ctx.chat.id].handleIncomeMediaGroupItemEvent({
    //     //     ...msgBase,
    //     //     caption: (message as any).caption,
    //     //     mediaGroupId: (message as any).media_group_id,
    //     //     photo: {
    //     //       type: 'photo',
    //     //       fileId: lastPhoto.file_id,
    //     //       fileUniqueId: lastPhoto.file_unique_id,
    //     //       fileSize: lastPhoto.file_size,
    //     //       width: lastPhoto.width,
    //     //       height: lastPhoto.height,
    //     //     }
    //     //   });
    //   // }
    //   else if ((message as any).poll) {
    //     this.chats[ctx.chat.id].handleIncomePollEvent({
    //       ...msgBase,
    //       poll: {
    //         //id: (message as any).poll.id,
    //         question: (message as any).poll.question,
    //         options: (message as any).poll.options.map((el: {text: string}) => el.text),
    //         isClosed: (message as any).poll.is_closed,
    //         isAnonymous: (message as any).poll.is_anonymous,
    //         type: (message as any).poll.type,
    //         multipleAnswers: (message as any).poll.allows_multiple_answers,
    //         correctOptionId: (message as any).poll.correct_option_id,
    //       }
    //     });
    //   }
    // });


    bot.launch()
      .then(() => {
        // const eventName = this.main.config.testBotToken + EVENT_DELIMITER + TG_BOT_EVENT.launched
        //
        // this.events.emit(eventName)

        // TODO: почему-то зависает

        console.log(3333)
      })
      .catch((e) => this.main.log.error(String(e)))

    // TODO: лучше не светить токены, а работать с их md5 суммой
    this.main.log.info('Bot launched: ' + botToken);
  }

}
