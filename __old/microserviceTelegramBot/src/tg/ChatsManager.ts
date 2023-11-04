import {TgChat} from './TgChat';
import {Main} from '../Main';
import {makeBotId} from '../../../../../../../../../mnt/disk2/workspace/sls-publish-bot/__old/src/helpers/makeBotId';
import {BotStatus} from '../types/BotStatus';
import {BotStorageInfo} from '../types/dbTypes';
import {PhotoMessageEvent, PollMessageEvent, TextMessageEvent, VideoMessageEvent} from '../types/MessageEvent';


export class ChatsManager {
  readonly main: Main
  // like {"chatId": TgChat}
  private readonly chats: Record<string, TgChat> = {}


  constructor(main: Main) {
    this.main = main
  }


  async init() {
    const botTokens: BotStorageInfo[] = await this.main.chatStorage.getAllBots()

    for (const item of botTokens) {
      // make api bot instance and start listeners
      await this.main.tgApi.initBotAndStartListeners(item.botId, item.token)

      const botChatIds = await this.main.chatStorage.getBotChats(item.botId)

      for (const chat of botChatIds) {
        await this.initChat(item.botId, chat.chatId)
      }
    }

    this.listenNewChatsStart()
    this.listenIncomeMessages()
  }
  
  async destroy() {
    for (const itemIndex in this.chats) {
      await this.chats[itemIndex].destroy()

      delete this.chats[itemIndex]
    }
  }


  async newBot(botToken: string): Promise<string> {
    const botId = makeBotId(botToken)
    const found = Object.values(this.chats)
      .find((chat) => chat.botId === botId)
    // if it is already initialized - do nothing. It means that it works fine and saved
    if (found) return botId
    // if it is a new bot then save it
    await this.main.chatStorage.saveBot(botToken, botId)
    // make bot instance and start listeners
    await this.main.tgApi.initBotAndStartListeners(botId, botToken)
    // when start command will be called then TgChat is instantiated

    return botId
  }

  async removeBot(botId: string) {
    for (const chatId of Object.keys(this.chats)) {
      const chat = this.chats[chatId]

      if (chat.botId !== botId) continue

      await this.chats[chatId].destroy()

      delete this.chats[chatId]
    }

    this.main.tgApi.stopBot(botId, 'removed')

    await this.main.chatStorage.removeBotAndItsChats(botId)
  }

  async botStatus(botId: string): Promise<BotStatus> {
    // TODO: add !!!
    return {

    } as any
  }


  /**
   * Listen of all the bots' start command.
   * It chat exists it will be destroyed and reinitialized
   * @private
   */
  private listenNewChatsStart() {
    this.main.tgApi.onCmdStart((botId: string, chatId: string) => {
      (async () => {
        if (this.chats[chatId]) {
          // destroy chat instance if it exists
          await this.chats[chatId].destroy()
        }
        else {
          // TODO: так это будет каждый раз чтоли???
          // if chat doesn't exists - save it
          await this.main.chatStorage.saveChat(botId, chatId)
        }
        // make a new instance any way
        await this.initChat(botId, chatId)
      })().catch((e) => this.main.log.error(e))
    })
  }

  /**
   * Listen income messages of all the bots and chats
   * @private
   */
  private listenIncomeMessages() {
    this.main.tgApi.onIncomeCallbackQuery((botId: string, chatId: string, queryData: string) => {
      if (!this.chats[chatId]) {
        this.main.log.warn(`Income message to not registered chat ${chatId}`)

        return
      }

      this.chats[chatId].handleIncomeCallbackQuery(queryData)
    })

    this.main.tgApi.onTextMessage((botId: string, chatId: string, event: TextMessageEvent) => {
      if (!this.chats[chatId]) {
        this.main.log.warn(`Income text message to not registered chat ${chatId}`)

        return
      }

      this.chats[chatId].handleIncomeTextEvent(event)
    })

    this.main.tgApi.onPhotoMessage((botId: string, chatId: string, event: PhotoMessageEvent) => {
      if (!this.chats[chatId]) {
        this.main.log.warn(`Income photo message to not registered chat ${chatId}`)

        return
      }

      this.chats[chatId].handleIncomePhotoEvent(event)
    })

    this.main.tgApi.onVideoMessage((botId: string, chatId: string, event: VideoMessageEvent) => {
      if (!this.chats[chatId]) {
        this.main.log.warn(`Income video message to not registered chat ${chatId}`)

        return
      }

      this.chats[chatId].handleIncomeVideoEvent(event)
    })

    this.main.tgApi.onPollMessage((botId: string, chatId: string, event: PollMessageEvent) => {
      if (!this.chats[chatId]) {
        this.main.log.warn(`Income poll message to not registered chat ${chatId}`)

        return
      }

      this.chats[chatId].handleIncomePollEvent(event)
    })
  }

  private async initChat(botId: string, chatId: string) {
    this.chats[chatId] = new TgChat(this, botId, chatId)
    // and init it
    await this.chats[chatId].init()
  }

}
