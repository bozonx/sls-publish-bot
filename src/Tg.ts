import { Context, Telegraf } from 'telegraf';
import config from './config';
import { MENU_MAKE_ARTICLE, MENU_MAKE_POST, MENU_MAKE_STORY } from './types/consts';


export default class Tg {
    public readonly bot: Telegraf;
    public ctx!: Context;
    public botChatId!: number;
    private startMessageId: number = -1;


    constructor() {
        this.bot = new Telegraf(process.env.BOT_TOKEN as any);
    }


    async init() {
        this.bot.start(async (ctx) => {
            this.ctx = ctx;
            this.botChatId = ctx.chat.id;
            this.ctx.reply('Welcome');

            //bot.telegram.sendMessage(ctx.chat.id, 'hello there! Welcome to my new telegram bot.', {
            //})
            const result = await this.bot.telegram.sendMessage(ctx.chat.id, 'Что хотите сделать?', {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: "Создать статью",
                                callback_data: MENU_MAKE_ARTICLE,
                            },
                            {
                                text: "Создать пост",
                                callback_data: MENU_MAKE_POST,
                            },
                            {
                                text: "Создать сторис",
                                callback_data: MENU_MAKE_STORY,
                            },
                        ],
        
                    ]
                }
            });

            this.startMessageId = result.message_id;
        });
        // bot.help((ctx) => ctx.reply('Send me a sticker'));
        // bot.on('sticker', (ctx) => ctx.reply('👍'));
        // bot.hears('hi', (ctx) => ctx.reply('Hey there'));
        this.bot.launch();

        this.bot.on('callback_query', (ctx) => {
            if (!ctx.update.callback_query.data) throw new Error('Empty data in callback_query');

            if ([MENU_MAKE_ARTICLE, MENU_MAKE_POST, MENU_MAKE_STORY].includes(ctx.update.callback_query.data)) {
                this.askChannel(ctx.update.callback_query.data).catch((e) => {throw e});
                
                return;
            }
            else if (ctx.update.callback_query.data.indexOf('channel:') === 0) {
                const splat: string[] = ctx.update.callback_query.data.split(':');
                const channelId: number = Number(splat[1]);
                const menuAction: string = splat[2];

                console.log(22222, channelId, menuAction)


                return;
            }

            throw new Error('No data in callback_query');
        });
    }


    private async askChannel(selection: string | undefined) {
        await this.ctx.deleteMessage(this.startMessageId);
        
        this.bot.telegram.sendMessage(this.ctx.chat?.id || -1, 'Выберете канал', {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: "Тестовый канал",
                            callback_data: 'channel:0:' + selection,
                        },
                    ],
    
                ]
            }
        })
    }

}
