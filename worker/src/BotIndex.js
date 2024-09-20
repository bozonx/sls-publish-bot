import { Bot, session } from 'grammy';
import {
	tgManageBotPlugin,
	onMessage,
	onQueryData,
	onStart,
} from './tgManageBot/pluginIndex.js';

export class BotIndex {
	bot;

	constructor(
		token,
		webAppUrl,
		apiCallLocalCode,
		KV,
		PRISMA_ADAPTER,
		APP_DEBUG,
		TEST_MODE,
	) {
		this.bot = new Bot(token);

		this.bot.use(async (ctx, next) => {
			ctx.config = {
				webAppUrl,
				apiBaseUrlOrDb,
				apiCallLocalCode,
			};

			c.ctx = {
				[CTX_KEYS.KV]: KV,
				[CTX_KEYS.DB_CRUD]: new DbCrud(PRISMA_ADAPTER),
				[CTX_KEYS.SESSION_STATE_TTL_DAYS]: SESSION_STATE_TTL_DAYS,
				[CTX_KEYS.APP_DEBUG]: APP_DEBUG,
			};

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

		this.bot.use(tgManageBotPlugin());

		this.bot.command('start', onStart);
		this.bot.on('callback_query:data', onQueryData);
		this.bot.on('message', onMessage);
	}

	/**
	 * This is only for dev
	 */
	botStart() {
		this.bot.start();
	}
}
