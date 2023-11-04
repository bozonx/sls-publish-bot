import {IndexedEventEmitter, lastItem} from '../../../../../../../../../mnt/disk2/workspace/squidlet-lib';
import {Context, Telegraf, Format, Types} from 'telegraf';
import {Message, PhotoSize, Video} from 'typegram/message';
import {Main} from '../Main';
import MessageEventBase, {
  PhotoMessageEvent,
  PollMessageEvent,
  TextMessageEvent,
  VideoMessageEvent
} from '../types/MessageEvent';


export enum TG_BOT_EVENT {
  cmdStart,
  //launched,
  callbackQuery,
  textMessage,
  photoMessage,
  videoMessage,
  pollMessage,
}


export class TgBotApi {
  private readonly main: Main
  private events = new IndexedEventEmitter()

  // TODO: лучше не создавать инстансы бота, а напрямую делать запросы
  // like {botId: Telegraf}
  private readonly bots: Record<string, Telegraf> = {}


  constructor(main: Main) {
    this.main = main
  }

  async destroy(reason: string) {
    this.events.destroy()

    for (const botId of Object.keys(this.bots)) this.stopBot(botId, reason)
  }


  stopBot(botId: string, reason: string) {
    this.bots[botId].stop(reason)

    delete this.bots[botId]
  }

  /**
   * Instantiate bot, launch it and start listeners
   * @param botId
   * @param botToken
   */
  async initBotAndStartListeners(botId: string, botToken: string) {
    const bot = this.bots[botId] = new Telegraf(botToken, {
      telegram: {
        testEnv: !this.main.config.isProduction,
      }
    })

    bot.start((ctx: Context) => {
      if (typeof ctx.chat?.id !== 'undefined')
        this.events.emit(TG_BOT_EVENT.cmdStart, botId, String(ctx.chat.id))
    })

    bot.on('callback_query', (ctx) => {
      if (!ctx.chat?.id) {
        this.main.log.warn('No chat id in callback_query');

        return;
      }

      this.events.emit(
        TG_BOT_EVENT.callbackQuery,
        botId,
        ctx.chat.id,
        (ctx.update.callback_query as  any).data)
    });

    bot.on('message', (ctx) => {
      // uncomment this to find channel id by forwarding a message
      //console.log('--- forwarded', (ctx.update?.message as any)?.forward_from_chat)

      const message: Message.CommonMessage = ctx.update.message;

      //console.log(1111, JSON.stringify(message, null, 2))

      if (!message.chat?.id) {
        this.main.log.warn('No chat id in message event');

        return
      }

      const chatId = String(ctx.chat.id)
      const msgBase: MessageEventBase = {
        // TODO: а зачем так то ???
        messageId: (typeof message.forward_from_message_id === 'undefined')
          ? message.message_id
          : message.forward_from_message_id,
        chatId: (typeof message.forward_from_chat === 'undefined')
          ? message.chat.id
          : message.forward_from_chat.id,
        date: message.date,
      }

      if ((message as any).text) {
        this.events.emit(TG_BOT_EVENT.textMessage, botId, chatId, {
          ...msgBase,
          text: (message as any).text,
          entities: (message as any).entities,
        } as TextMessageEvent)
      }
      else if ((message as any).photo) {
        const lastPhoto = lastItem((message as any).photo) as PhotoSize

        this.events.emit(TG_BOT_EVENT.photoMessage, botId, chatId, {
          ...msgBase,
          caption: (message as any).caption,
          entities: (message as any).caption_entities,
          photo: {
            type: 'photo',
            fileId: lastPhoto.file_id,
            fileUniqueId: lastPhoto.file_unique_id,
            fileSize: lastPhoto.file_size,
            width: lastPhoto.width,
            height: lastPhoto.height,
          }
        } as PhotoMessageEvent)
      }
      else if ((message as any).video) {
        const video = (message as any).video as Video;

        this.events.emit(TG_BOT_EVENT.videoMessage, botId, chatId, {
          ...msgBase,
          caption: (message as any).caption,
          entities: (message as any).caption_entities,
          video: {
            type: 'video',
            fileId: video.file_id,
            fileUniqueId: video.file_unique_id,
            fileSize: video.file_size,
            width: video.width,
            height: video.height,
            duration: video.duration,
            mimeType: video.mime_type,
          }
        } as VideoMessageEvent)
      }
        // else if ((message as any).media_group_id) {
        //   const lastPhoto = _.last((message as any).photo) as PhotoSize;
        //
        //   this.chats[ctx.chat.id].handleIncomeMediaGroupItemEvent({
        //     ...msgBase,
        //     caption: (message as any).caption,
        //     mediaGroupId: (message as any).media_group_id,
        //     photo: {
        //       type: 'photo',
        //       fileId: lastPhoto.file_id,
        //       fileUniqueId: lastPhoto.file_unique_id,
        //       fileSize: lastPhoto.file_size,
        //       width: lastPhoto.width,
        //       height: lastPhoto.height,
        //     }
        //   });
      // }
      else if ((message as any).poll) {
        this.events.emit(TG_BOT_EVENT.pollMessage, botId, chatId, {
          ...msgBase,
          poll: {
            //id: (message as any).poll.id,
            question: (message as any).poll.question,
            options: (message as any).poll.options.map((el: {text: string}) => el.text),
            isClosed: (message as any).poll.is_closed,
            isAnonymous: (message as any).poll.is_anonymous,
            type: (message as any).poll.type,
            multipleAnswers: (message as any).poll.allows_multiple_answers,
            correctOptionId: (message as any).poll.correct_option_id,
          }
        } as PollMessageEvent)
      }
    });


    bot.launch()
      .then(() => {
        // const eventName = this.main.config.testBotToken + EVENT_DELIMITER + TG_BOT_EVENT.launched
        //
        // this.events.emit(eventName)

        // TODO: почему-то зависает - лучше здесь писать что бот был запущен

        console.log(3333)
      })
      .catch((e) => this.main.log.error(String(e)))

    this.main.log.info(`Bot with id ${botId} launched`);
  }

  async sendTextMessage(
    botId: string,
    chatId: string,
    text: string | Format.FmtString,
    extra?: Types.ExtraReplyMessage
  ) {
    const bot = this.resolveBot(botId)

    return await bot.telegram.sendMessage(chatId, text, extra)
  }

  async sendPhotoMessage(botId: string, chatId: string) {
    const bot = this.resolveBot(botId)

    // TODO: add
  }

  async sendVideoMessage(botId: string, chatId: string) {
    const bot = this.resolveBot(botId)

    // TODO: add
  }

  async sendAudioMessage(botId: string, chatId: string) {
    const bot = this.resolveBot(botId)

    // TODO: add
  }

  async sendPollMessage(botId: string, chatId: string) {
    const bot = this.resolveBot(botId)

    // TODO: add
  }

  async deleteMessage(botToken: string, chatId: number | string, msgId: number) {
    const bot = this.resolveBot(botToken)

    await bot.telegram.deleteMessage(chatId, msgId)
  }

  onCmdStart(handler:(botId: string, chatId: string) => void) {
    return this.events.addListener(TG_BOT_EVENT.cmdStart, handler)
  }

  onIncomeCallbackQuery(handler: (botId: string, chatId: string, queryData: string) => void): number {
    return this.events.addListener(TG_BOT_EVENT.callbackQuery, handler)
  }


  // onBotLaunched(botToken: string, handler:() => void) {
  //   const eventName = botToken + EVENT_DELIMITER + TG_BOT_EVENT.launched
  //
  //   return this.events.addListener(eventName, handler)
  // }

  onTextMessage(handler: (botId: string, chatId: string, event: TextMessageEvent) => void): number {
    return this.events.addListener(TG_BOT_EVENT.textMessage, handler)
  }

  onPhotoMessage(handler: (botId: string, chatId: string, event: PhotoMessageEvent) => void): number {
    return this.events.addListener(TG_BOT_EVENT.photoMessage, handler)
  }

  onVideoMessage(handler: (botId: string, chatId: string, event: VideoMessageEvent) => void): number {
    return this.events.addListener(TG_BOT_EVENT.videoMessage, handler)
  }

  // onAudioMessage(handler: (botId: string, chatId: string, event: AudioMessageEvent) => void): number {
  //
  // }

  onPollMessage(handler: (botId: string, chatId: string, event: PollMessageEvent) => void): number {
    return this.events.addListener(TG_BOT_EVENT.pollMessage, handler)
  }


  private resolveBot(botId: string) {
    if (this.bots[botId]) return this.bots[botId]

    throw new Error(`Can't find bot with id ${botId}`)
  }

}
