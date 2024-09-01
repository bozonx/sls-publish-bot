import { Bot } from 'grammy';
import { handleStart, makeContext } from './botLogic.js';
import { routerMiddleware } from './PageRouter.js';
import { Home } from './pages/Home.js';
import { ConfigManager } from './pages/ConfigManager.js';
import { TagsManager } from './pages/TagsManager.js';
import { UsersManager } from './pages/UsersManager.js';
import { PubContent } from './pages/PubContent.js';
import { PubAuthor } from './pages/PubAuthor.js';
import { PubTags } from './pages/PubTags.js';
import { PubDate } from './pages/PubDate.js';
import { PubHour } from './pages/PubHour.js';
import { PubPostSetup } from './pages/PubPostSetup.js';
import { PubConfirm } from './pages/PubConfirm.js';

export class BotIndex {
	bot;

	constructor(TG_TOKEN, MAIN_ADMIN_TG_USER_ID, KV) {
		this.bot = new Bot(TG_TOKEN);

		this.bot.use(makeContext(MAIN_ADMIN_TG_USER_ID, KV));
	}

	async init() {
		const routes = {
			home: Home,
			'config-manager': ConfigManager,
			'users-manager': UsersManager,
			'tags-manager': TagsManager,
			'pub-content': PubContent,
			'pub-author': PubAuthor,
			'pub-tags': PubTags,
			'pub-date': PubDate,
			'pub-hour': PubHour,
			'pub-post-setup': PubPostSetup,
			'pub-confirm': PubConfirm,
		};

		this.bot.use(routerMiddleware(routes));
		this.bot.command('start', handleStart);
		this.bot.on('callback_query:data', (c) => c.router._handleQueryData(c));
		this.bot.on('message', (c) => c.router._handleMessage(c));
	}

	/**
	 * This is only for dev
	 */
	botStart() {
		this.bot.start();
	}
}
