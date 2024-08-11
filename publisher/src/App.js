import { Bot, InlineKeyboard } from 'grammy';

export class App {
	bot;

	constructor(token) {
		this.bot = new Bot(token);

		this.bot.use(async (ctx, next) => {
			// Modify context object here by setting the config.
			ctx.config = {
				test: 123,
				// botDeveloper: BOT_DEVELOPER,
				// isDeveloper: ctx.from?.id === BOT_DEVELOPER,
			};
			// Run remaining handlers.
			await next();
		});
	}

	async init() {
		this.bot.command('start', (ctx) => {
			const inlineKeyboard = new InlineKeyboard().text('« 1', 'first').webApp('web', 'https://blog.p-libereco.org/ru/recent/1');

			ctx.reply('Welcome! Up and running.', {
				reply_markup: inlineKeyboard,
			});
		});

		// Wait for click events with specific callback data.
		// this.bot.callbackQuery('click-payload', async (ctx) => {
		// 	console.log(111, ctx);
		// 	await ctx.answerCallbackQuery({
		// 		text: 'You were curious, indeed!',
		// 	});
		// });

		this.bot.on('callback_query:data', async (ctx) => {
			console.log('Unknown button event with payload', ctx.callbackQuery.data);
			await ctx.answerCallbackQuery({
				text: 'You were curious, indeed!',
			});
		});

		this.bot.on('message', (ctx) => {
			ctx.reply('Got another message!');
		});
	}

	/**
	 * This is only for dev
	 */
	botStart() {
		this.bot.start();
	}
}
