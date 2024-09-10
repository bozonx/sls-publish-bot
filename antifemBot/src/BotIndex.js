import { Bot } from 'grammy';
import { handleStart, makeContext } from './botLogic.js';
import { routerMiddleware } from './PageRouter.js';
import { Home } from './pages/Home.js';
import { ConfigManager } from './pages/ConfigManager.js';
import { TagsManager } from './pages/TagsManager.js';
import { UserItem } from './pages/UserItem.js';
import { UsersManager } from './pages/UsersManager.js';
import { PubContent } from './pages/PubContent.js';
import { PubTags } from './pages/PubTags.js';
import { PubDate } from './pages/PubDate.js';
import { PubTime } from './pages/PubTime.js';
import { PubPostSetup } from './pages/PubPostSetup.js';
import { PubConfirm } from './pages/PubConfirm.js';
import { ScheduledList } from './pages/ScheduledList.js';
import { ScheduledItem } from './pages/ScheduledItem.js';
import { ConservedList } from './pages/ConservedList.js';
import { ConservedItem } from './pages/ConservedItem.js';
import { AlreadyPublishedList } from './pages/AlreadyPublishedList.js';

export class BotIndex {
	bot;

	constructor(TG_TOKEN, ...params) {
		this.bot = new Bot(TG_TOKEN);

		this.bot.use(makeContext(...params));
	}

	async init() {
		const routes = {
			home: Home,
			'config-manager': ConfigManager,
			'users-manager': UsersManager,
			'user-item': UserItem,
			'tags-manager': TagsManager,
			'pub-content': PubContent,
			'pub-tags': PubTags,
			'pub-date': PubDate,
			'pub-time': PubTime,
			'pub-post-setup': PubPostSetup,
			'pub-confirm': PubConfirm,
			'scheduled-list': ScheduledList,
			'scheduled-item': ScheduledItem,
			'conserved-list': ConservedList,
			'conserved-item': ConservedItem,
			'published-list': AlreadyPublishedList,
		};

		this.bot.use(routerMiddleware(routes));
		this.bot.command('start', handleStart);
		this.bot.on('message', (c) => c.router.$handleMessage(c));
		this.bot.on('callback_query:data', (c) => c.router.$handleQueryData(c));
	}

	/**
	 * This is only for dev
	 */
	botStart() {
		this.bot.start();
	}
}
