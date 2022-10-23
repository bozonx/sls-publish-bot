import { Telegraf } from 'telegraf';
import config from './config';


const bot = new Telegraf(process.env.BOT_TOKEN as any);

bot.start((ctx) => {
    ctx.reply('Welcome');
    const info = ctx.botInfo;

    //bot.telegram.sendMessage(ctx.chat.id, 'hello there! Welcome to my new telegram bot.', {
    //})
    bot.telegram.sendMessage(ctx.chat.id, 'msg', {
        reply_markup: {
            inline_keyboard: [
                [{
                        text: "dog",
                        callback_data: 'dog'
                    },
                    {
                        text: "cat",
                        callback_data: 'cat'
                    }
                ],

            ]
        }
    })
});
bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.on('sticker', (ctx) => ctx.reply('👍'));
bot.hears('hi', (ctx) => ctx.reply('Hey there'));
bot.launch();


bot.action('dog', ctx => {
    console.log('dog')
    ctx.reply('dog');
})

//method that returns image of a cat 

bot.action('cat', ctx => {
    console.log('cat')
    ctx.reply('cat');
})

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));