import { Bot, session } from 'grammy';
import { handleStart, handleMessage, handleButtonCallback } from './BotLogic.js';

// await bot.api.sendMessage(12345, "Hello!");

export class BotIndex {
	bot;

	constructor(token, webAppUrl, apiBaseUrl) {
		this.bot = new Bot(token);

		this.bot.use(async (ctx, next) => {
			ctx.config = {
				webAppUrl,
				apiBaseUrl,
			};
			// Run remaining handlers.
			await next();
		});
	}

	async init() {
		this.bot.use(
			session({
				// Stores data per user.
				getSessionKey: (ctx) => {
					// Give every user their personal session storage
					// (will be shared across groups and in their private chat)
					return ctx.from?.id.toString();
				},
				initial: () => ({ userData: null }),
			}),
		);

		this.bot.command('start', handleStart);
		this.bot.on('callback_query:data', handleButtonCallback);
		this.bot.on('message', handleMessage);
	}

	/**
	 * This is only for dev
	 */
	botStart() {
		this.bot.start();
	}
}
