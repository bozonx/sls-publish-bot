import { Bot } from 'grammy';
import { CTX_KEYS } from './constants.js';
import { handleStart, prepareKvAndConfig } from './botLogic.js';
import { makeRouter } from './PageRouter.js';
import { Home } from './pages/Home.js';
import { ConfigManager } from './pages/ConfigManager.js';
import { TagsManager } from './pages/TagsManager.js';
import { UsersManager } from './pages/UsersManager.js';
import { PubContent } from './pages/PubContent.js';
import { PubAuthor } from './pages/PubAuthor.js';
import { PubTags } from './pages/PubTags.js';
// import { PubDate } from './pages/PubDate.js';
// import { PubHour } from './pages/PubHour.js';
// import { PubConfirm } from './pages/PubConfirm.js';

export class BotIndex {
	bot;

	constructor(TG_TOKEN, MAIN_ADMIN_TG_USER_ID, KV) {
		this.bot = new Bot(TG_TOKEN);
		this.bot.use(async (c, next) => {
			c.ctx = { [CTX_KEYS.KV]: KV };
			c.ctx = {
				...c.ctx,
				...(await prepareKvAndConfig(c, MAIN_ADMIN_TG_USER_ID)),
			};

			await next();
		});
	}

	async init() {
		const router = await makeRouter({
			home: Home,
			'config-manager': ConfigManager,
			'users-manager': UsersManager,
			'tags-manager': TagsManager,
			'pub-content': PubContent,
			'pub-author': PubAuthor,
			'pub-tags': PubTags,
			// 'pub-date': PubDate,
			// 'pub-hour': PubHour,
			// 'pub-confirm': PubConfirm,
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
