import { Bot, session } from 'grammy';
import {
	tgManageBotPlugin,
	onMessage,
	onQueryData,
	onStart,
} from './tgManageBot/pluginIndex.js';
import { CTX_KEYS } from './constants.js';

export class BotIndex {
	bot;

	constructor(TG_TOKEN, WEB_APP_URL, KV, PRISMA_ADAPTER, APP_DEBUG, TEST_MODE) {
		this.bot = new Bot(TG_TOKEN);

		this.bot.use(async (c, next) => {
			c.ctx = {
				[CTX_KEYS.KV]: KV,
				[CTX_KEYS.DB_CRUD]: new DbCrud(PRISMA_ADAPTER),
				[CTX_KEYS.WEB_APP_URL]: WEB_APP_URL,
				[CTX_KEYS.SESSION_STATE_TTL_DAYS]: SESSION_STATE_TTL_DAYS,
				[CTX_KEYS.APP_DEBUG]: APP_DEBUG,
				[CTX_KEYS.TEST_MODE]: TEST_MODE,
			};

			await next();
		});
	}

	async init() {
		// this.bot.use(
		// 	session({
		// 		// Stores data per user.
		// 		getSessionKey: (ctx) => {
		// 			// Give every user their personal session storage
		// 			// (will be shared across groups and in their private chat)
		// 			return ctx.from?.id.toString();
		// 		},
		// 		initial: () => ({ userData: null }),
		// 	}),
		// );

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
