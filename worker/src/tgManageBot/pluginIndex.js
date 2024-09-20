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
import { PubSelectLinkPreview } from './pages/PubSelectLinkPreview.js';
import { PubConfirm } from './pages/PubConfirm.js';
import { ScheduledList } from './pages/ScheduledList.js';
import { ScheduledItem } from './pages/ScheduledItem.js';
import { ConservedList } from './pages/ConservedList.js';
import { ConservedItem } from './pages/ConservedItem.js';
import { AlreadyPublishedList } from './pages/AlreadyPublishedList.js';
import { AlreadyPublishedItem } from './pages/AlreadyPublishedItem.js';

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
	'pub-select-preview': PubSelectLinkPreview,
	'pub-confirm': PubConfirm,
	'scheduled-list': ScheduledList,
	'scheduled-item': ScheduledItem,
	'conserved-list': ConservedList,
	'conserved-item': ConservedItem,
	'published-list': AlreadyPublishedList,
	'published-item': AlreadyPublishedItem,
};

export function tgManageBotPlugin() {
	return async (c, next) => {
		await makeContext();

		await routerMiddleware(routes)(c, next);
	};
}

export async function onMessage(c) {
	await c.router.$handleMessage(c);
}

export async function onQueryData(c) {
	await c.router.$handleQueryData(c);
}

export async function onStart(c) {
	await handleStart(c);
}
