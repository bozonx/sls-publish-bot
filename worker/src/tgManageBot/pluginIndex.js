import { makeNewTgUser } from './helpers/helpers.js';
import { loadFromCache } from './io/KVio.js';
import {
	CTX_KEYS,
	SESSION_CACHE_NAME,
	DB_TABLE_NAMES,
	USER_KEYS,
	MAIN_HOME,
} from './constants.js';
import { routerMiddleware } from './PageRouter.js';
import { MainHome } from './pages/MainHome.js';
// import { ManagerHome } from './pages/ManagerHome.js';
// import { ConfigManager } from './pages/ConfigManager.js';
// import { TagsManager } from './pages/TagsManager.js';
// import { UserItem } from './pages/UserItem.js';
// import { UsersManager } from './pages/UsersManager.js';
// import { PubContent } from './pages/PubContent.js';
// import { PubTags } from './pages/PubTags.js';
// import { PubDate } from './pages/PubDate.js';
// import { PubTime } from './pages/PubTime.js';
// import { PubPostSetup } from './pages/PubPostSetup.js';
// import { PubSelectLinkPreview } from './pages/PubSelectLinkPreview.js';
// import { PubConfirm } from './pages/PubConfirm.js';
// import { ScheduledList } from './pages/ScheduledList.js';
// import { ScheduledItem } from './pages/ScheduledItem.js';
// import { ConservedList } from './pages/ConservedList.js';
// import { ConservedItem } from './pages/ConservedItem.js';
// import { AlreadyPublishedList } from './pages/AlreadyPublishedList.js';
// import { AlreadyPublishedItem } from './pages/AlreadyPublishedItem.js';

const routes = {
	home: MainHome,
	// [HOME_PAGE]: ManagerHome,
	// 'config-manager': ConfigManager,
	// 'users-manager': UsersManager,
	// 'user-item': UserItem,
	// 'tags-manager': TagsManager,
	// 'pub-content': PubContent,
	// 'pub-tags': PubTags,
	// 'pub-date': PubDate,
	// 'pub-time': PubTime,
	// 'pub-post-setup': PubPostSetup,
	// 'pub-select-preview': PubSelectLinkPreview,
	// 'pub-confirm': PubConfirm,
	// 'scheduled-list': ScheduledList,
	// 'scheduled-item': ScheduledItem,
	// 'conserved-list': ConservedList,
	// 'conserved-item': ConservedItem,
	// 'published-list': AlreadyPublishedList,
	// 'published-item': AlreadyPublishedItem,
};

export function tgManageBotPlugin() {
	return async (c, next) => {
		await makeContext(c);

		await routerMiddleware(routes)(c, next);
	};
}

export function onMessage(c) {
	return c.router.$handleMessage(c);
}

export function onQueryData(c) {
	return c.router.$handleQueryData(c);
}

export function onStart(c) {
	return handleStart(c);
}

async function makeContext(c) {
	if (!c.msg?.chat) return;

	const chatId = c.msg.chat.id;
	let tgSm;
	let session;
	let me;

	try {
		[session, me] = await Promise.all([
			loadFromCache(c, SESSION_CACHE_NAME, chatId),
			// load me
			c.ctx[CTX_KEYS.DB_CRUD].getItem(
				DB_TABLE_NAMES.User,
				undefined,
				undefined,
				{
					tgChatId: String(chatId),
				},
			),
		]);
	} catch (e) {
		throw new Error(`Can't load initial data: ${e}`);
	}

	if (typeof session?.tgSmId !== 'undefined') {
		tgSm = await c.ctx[CTX_KEYS.DB_CRUD].getItem(
			DB_TABLE_NAMES.SocialMedia,
			session.tgSmId,
		);
	}

	c.ctx = {
		...c.ctx,
		[CTX_KEYS.tgSm]: tgSm && {
			...tgSm,
			[SOCIAL_MEDIA_KEYS.cfg]: JSON.parse(tgSm.cfg),
		},
		[CTX_KEYS.session]: session,
		[CTX_KEYS.me]: me && {
			...me,
			[USER_KEYS.cfg]: JSON.parse(me.cfg),
		},
	};
}

async function handleStart(c) {
	if (!c.ctx[CTX_KEYS.me]) {
		// else create user
		c.ctx[CTX_KEYS.me] = await c.ctx[CTX_KEYS.DB_CRUD].createItem(
			DB_TABLE_NAMES.User,
			makeNewTgUser(c),
		);
	}

	return c.router.start(MAIN_HOME);
}
