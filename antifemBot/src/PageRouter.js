import { InlineKeyboard } from 'grammy';
import { loadFromCache, saveToCache } from './helpers.js';
import { CTX_KEYS, CACHE_MENU_MSG_ID_TTL_SEC } from './constants.js';

const QUERY_MARKER = 'PageRouter';
const PREV_MENU_MSG_ID_CACHE_NAME = 'prevMsgId';

/**
 * Do not store andy state inside your page class between requests
 */
export class PageBase {
	pager;
	// path of this page
	path;
	// Put here the description of menu
	text;
	// Put here menu rows and buttons here
	menu = [];

	// state which is passed between pages using cache
	get state() {
		return this.pager.state;
	}

	constructor(pager, path) {
		this.pager = pager;
		this.path = path;
	}

	// It runs only first time init on app start. It means for all the users
	async init() {}

	// It runs when a route of certain user has been changed
	async mount() {}

	// It runs when a route is changing
	async unmount() {}

	// It runs on each income message while this page is active
	async onMessage() {}
}

export async function makeRouter(initialPages) {
	const router = new PageRouter(initialPages);

	await router.init();

	return router;
}

class PageRouter {
	c;
	pages = {};
	currentPage;
	state;

	get currentPath() {
		return this.currentPage?.path;
	}

	constructor(initialPages) {
		for (const pathTo of Object.keys(initialPages)) {
			this.pages[pathTo] = new initialPages[pathTo](this, pathTo);
		}
	}

	async init() {
		for (const pathTo of Object.keys(this.pages)) {
			await this.pages[pathTo].init();
		}
	}

	async go(pathTo, newPartialState) {
		if (!pathTo) return this.c.reply('No path');

		let newPayload;
		const oldPayload = this.currentPage?.payload || {};

		await this.currentPage?.unmount();

		if (!this.pages[pathTo]) return this.c.reply(`Wrong path "${pathTo}"`);

		this.currentPage = this.pages[pathTo];

		if (newPartialState === null) {
			newPayload = {};
		} else {
			newPayload = {
				state: {
					...(oldPayload?.state || {}),
					...(newPartialState || {}),
				},
			};
		}

		this.currentPage.setPayload(newPayload);
		await this.currentPage.mount();

		const prevMenuMsgId = await this._getFromCache(PREV_MENU_MSG_ID_CACHE_NAME);
		// remove prev menu message
		if (prevMenuMsgId) {
			try {
				await this.c.api.deleteMessage(this.c.chatId, prevMenuMsgId);
			} catch (e) {}
		}

		await this._renderMenu(newPayload);

		// The end of request
	}

	async reload(newPartialState) {
		this.go(this.currentPage?.path, newPartialState);
	}

	middleware = async (c, next) => {
		this.c = c;
		c.pager = this;

		return next();
	};

	// async _getFromCache(key) {
	// 	const fullKey = `${CACHE_PREFIX}|${this.c.msg.chat.id}|${key}`;
	//
	// 	return this.c.ctx[CTX_KEYS.KV].get(fullKey);
	// }
	//
	// async _setToCache(key, value) {
	// 	const fullKey = `${CACHE_PREFIX}|${this.c.msg.chat.id}|${key}`;
	//
	// 	return this.c.ctx[CTX_KEYS.KV].put(fullKey, value, {
	// 		expirationTtl: CACHE_MENU_MSG_ID_TTL_SEC,
	// 	});
	// }

	_handleQueryData = async (c) => {
		// The start of request
		const data = c.update.callback_query.data;
		const [marker, pathTo, btnId, ...payloadRest] = data.split('|');

		if (marker !== QUERY_MARKER) return;

		const normalPayload = JSON.parse(payloadRest.join('|'));
		const menu = this.pages[pathTo]?.menu;

		if (!menu) return c.reply(`ERROR: No menu`);

		// TODO: set payload to this.pages[pathTo]

		for (const row of menu) {
			for (const { id, cb } of row) {
				if (String(id) !== btnId) continue;
				// run menu button handler
				return cb(id);
			}
		}

		// return this.pages[pathTo]?.menu?.[rowIndex]?.[btnIndex]?.[1](normalPayload);
	};

	_handleMessage = (c) => {
		return this.currentPage?.onMessage?.();
	};

	async _renderMenu(payload) {
		const menu = this.currentPage?.menu;

		if (!menu) return;

		const keyboard = new InlineKeyboard();

		for (const row of menu) {
			for (const { id, label } of row) {
				const payloadStr = JSON.stringify(payload);

				keyboard.text(
					label,
					`${QUERY_MARKER}|${this.currentPath}|${id}|${payloadStr}`,
				);
			}

			keyboard.row();
		}

		const { message_id } = await this.c.reply(this.currentPage.text, {
			reply_markup: keyboard,
		});

		await this._setToCache(PREV_MENU_MSG_ID_CACHE_NAME, message_id);
	}
}
