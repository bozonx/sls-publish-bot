import _ from 'lodash';
import {Context, Telegraf} from 'telegraf';
import {Message, PhotoSize, Video} from 'typegram/message';
import {TgRendererChat} from './TgRendererChat.js';
import {PackageContext} from '../../packageManager/PackageContext.js';
import MessageEventBase from '../../types/MessageEvent.js';


export class TelegramRenderer {
  readonly bot: Telegraf;
  readonly ctx: PackageContext
  // chats where users talk to bot
  private readonly chats: Record<string, TgRendererChat> = {}


  constructor(ctx: PackageContext) {
    this.ctx = ctx
    // TODO: токен брать как-то по другому, ведь юзер сам может задать своего бота
    this.bot = new Telegraf(this.ctx.config.botToken, {
      telegram: {
        testEnv: !this.ctx.config.isProduction,
      }
    })
  }


  init() {
    this.bot.start((ctx: Context) => {
      if (!ctx.chat?.id) throw new Error(`No chat id`);

      if (!this.chats[ctx.chat.id]) {
        this.chats[ctx.chat.id] = new TgRendererChat(ctx.chat.id, this)
      }

      this.chats[ctx.chat.id].init()
        .catch((e) => this.ctx.consoleLog.error(e));
    });

    this.addListeners();

    this.bot.launch()
      .then(() => {
  
  
        // TODO: почему-то зависает
  
        console.log(3333)
      });
    // TODO: ??? catch ???

    this.ctx.consoleLog.info('Bot launched');
  }
  
  // TODO: вызвать его из index
  async destroy(reason: string) {
    for (const itemIndex in this.chats) {
      //await this.chats[itemIndex].destroy();
      // @ts-ignore
      this.chats[itemIndex] = undefined;
    }

    this.bot.stop(reason);
  }


  private addListeners() {

    // TODO: add audio message

    this.bot.on('callback_query', (ctx) => {
      if (!ctx.chat?.id) {
        this.ctx.consoleLog.warn('No chat id in callback_query');

        return;
      }
      else if (!this.chats[ctx.chat.id]) {
        ctx.reply(this.ctx.i18n.errors.notRegisteredChat);
        //this.ctx.consoleLog.error(`No chat id (${ctx.chat.id}) for handling callback query`)

        return;
      }

      this.chats[ctx.chat.id].handleCallbackQueryEvent(
        (ctx.update.callback_query as  any).data
      );
    });

    this.bot.on('message', (ctx) => {
      // uncomment this to find channel id by forwarding a message
      //console.log('--- forwarded', (ctx.update?.message as any)?.forward_from_chat)

      const message: Message.CommonMessage = ctx.update.message;

      //console.log(1111, JSON.stringify(message, null, 2))

      if (!message.chat?.id) {
        this.ctx.consoleLog.warn('No chat id in message event');

        return;
      }
      if (!this.chats[message.chat.id]) {
        ctx.reply(this.ctx.i18n.errors.notRegisteredChat);
        //this.ctx.consoleLog.error(`No chat id (${message.chat.id}) for handling income message`)

        return;
      }

      const msgBase: MessageEventBase = {
        messageId: (typeof message.forward_from_message_id === 'undefined')
          ? message.message_id
          : message.forward_from_message_id,
        chatId: (typeof message.forward_from_chat === 'undefined')
          ? message.chat.id
          : message.forward_from_chat.id,
        date: message.date,
      }

      if ((message as any).text) {
        this.chats[ctx.chat.id].handleIncomeTextEvent({
          ...msgBase,
          text: (message as any).text,
          entities: (message as any).entities,
        });
      }
      else if ((message as any).photo) {
        const lastPhoto = _.last((message as any).photo) as PhotoSize;

        this.chats[ctx.chat.id].handleIncomePhotoEvent({
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
        });
      }
      else if ((message as any).video) {
        const video = (message as any).video as Video;

        this.chats[ctx.chat.id].handleIncomeVideoEvent({
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
        });
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
        this.chats[ctx.chat.id].handleIncomePollEvent({
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
        });
      }
    });
  }

}