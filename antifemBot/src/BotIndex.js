import { Bot, session } from 'grammy';
import { handleStart, prepareKvAndConfig } from './botLogic.js';
import { makeRouter } from './PageRouter.js';
import { PageMainMenu } from './PageMainMenu.js';
import { PageConfig } from './PageConfig.js';
import { PageTagManager } from './PageTagManager.js';
import { PagePubText } from './PagePubText.js';
import { PagePubAuthor } from './PagePubAuthor.js';
import { PagePubTags } from './PagePubTags.js';
import { PagePubDate } from './PagePubDate.js';
import { PagePubHour } from './PagePubHour.js';
import { PagePubConfirm } from './PagePubConfirm.js';

export class BotIndex {
	bot;

	constructor(TG_TOKEN, MAIN_ADMIN_TG_USER_ID, KV) {
		this.bot = new Bot(TG_TOKEN);
		this.bot.use(async (c, next) => {
			c.ctx = await prepareKvAndConfig(MAIN_ADMIN_TG_USER_ID, KV);

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
		// 		initial: () => ({ route: null }),
		// 	}),
		// );

		const router = makeRouter({
			home: PageMainMenu,
			'pub-text': PagePubText,
			config: PageConfig,
			'tag-manager': PageTagManager,
			'pub-author': PagePubAuthor,
			'pub-tags': PagePubTags,
			'pub-date': PagePubDate,
			'pub-hour': PagePubHour,
			'pub-confirm': PagePubConfirm,
		});

		this.bot.use(router.middleware);

		this.bot.command('start', handleStart);
		this.bot.on('callback_query:data', router._handleQueryData);
		this.bot.on('message', router._handleMessage);
	}

	/**
	 * This is only for dev
	 */
	botStart() {
		this.bot.start();
	}
}
