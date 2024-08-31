import { InlineKeyboard } from 'grammy';
import { loadFromCache, saveToCache } from './helpers.js';
import {
	CTX_KEYS,
	CACHE_MENU_MSG_ID_TTL_SEC,
	CACHE_STATE_TTL_SEC,
} from './constants.js';

const QUERY_MARKER = 'PageRouter';
const PREV_MENU_MSG_ID_CACHE_NAME = 'prevMsgId';
const STATE_CACHE_NAME = 'pageState';

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
	// like [ [ {id, label, payload, cb(id, payload)}, ...btns ], ..rows ]
	menu = [];

	// state which is passed between pages using cache
	get state() {
		return this.pager.state;
	}

	// It runs when a route of certain user has been changed
	constructor(pager, path) {
		this.pager = pager;
		this.path = path;
	}

	// It runs only first time init on app start. It means for all the users
	// async init() {}

	// It runs when a route of certain user has been changed
	async mount() {}

	// It runs when a route is changing
	async unmount() {}

	// It runs on each income message while this page is active
	async onMessage() {}
}

export async function makeRouter(initialPages) {
	const router = new PageRouter(initialPages);

	// TODO: useless
	await router.init();

	return router;
}

class PageRouter {
	c;
	// not initialized pages
	pages = {};
	// current initialized page
	currentPage;
	// readonly state
	_state;

	get state() {
		return this._state;
	}

	get currentPath() {
		return this.currentPage?.path;
	}

	constructor(initialPages) {
		this.pages = initialPages;
		// TODO: but why?
		// for (const pathTo of Object.keys(initialPages)) {
		// 	this.pages[pathTo] = new initialPages[pathTo](this, pathTo);
		// }
	}

	// TODO: but why?
	async init() {
		// for (const pathTo of Object.keys(this.pages)) {
		// 	await this.pages[pathTo].init();
		// }
	}

	async setState(newStateToReplace) {
		await saveToCache(STATE_CACHE_NAME, newStateToReplace, CACHE_STATE_TTL_SEC);

		this._state = newStateToReplace;
	}

	/**
	 * @param {object|null} newPartialState - state which will be merged with the main state. Null means totally clear state
	 * @param {boolean} [replaceState=false] - if set then the main state will be replaced with newPartialState
	 */
	async go(pathTo, newPartialState, replaceState = false) {
		const c = this.c;

		console.log('-----go', pathTo);

		if (!pathTo) return c.reply('No path');

		await this.currentPage?.unmount();

		if (!this.pages[pathTo]) return c.reply(`Wrong path "${pathTo}"`);
		// make current page instance
		this.currentPage = new this.pages[pathTo](this, pathTo);
		// load from cache state and update it
		await this._setupState(newPartialState, replaceState);
		await this.currentPage.mount();

		const keyboard = this._renderMenuKeyboard();

		await this._sendMenu(keyboard);

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

	_handleMessage = (c) => {
		return this.currentPage?.onMessage?.();
	};

	_handleQueryData = async (c) => {
		console.log('-----_handleQueryData', c.update.callback_query.data);

		// The start of request
		const data = c.update.callback_query.data;
		const [marker, pathTo, btnId, ...bntPayloadRest] = data.split('|');

		if (marker !== QUERY_MARKER) return;

		const btnPayload = JSON.parse(bntPayloadRest.join('|'));

		// TODO: наверное должно создаться меню
		const menu = this.pages[pathTo]?.menu;

		if (!menu?.length) return c.reply(`ERROR: No menu`);

		for (const row of menu) {
			for (const { id, cb } of row) {
				if (String(id) !== btnId) continue;
				// run menu button handler
				return cb(id, btnPayload);
			}
		}

		return c.reply(`ERROR: Can't find button. ${data}`);
	};

	_renderMenuKeyboard() {
		const menu = this.currentPage?.menu;

		if (!menu?.length) return;

		const keyboard = new InlineKeyboard();

		for (const row of menu) {
			for (const { id, label, payload } of row) {
				keyboard.text(
					label,
					`${QUERY_MARKER}|${this.currentPath}|${id}|${JSON.stringify(payload)}`,
				);
			}

			keyboard.row();
		}

		return keyboard;
	}

	async _sendMenu(keyboard) {
		const c = this.c;
		const prevMenuMsgId = await loadFromCache(c, PREV_MENU_MSG_ID_CACHE_NAME);
		// remove prev menu message
		if (prevMenuMsgId) {
			try {
				await c.api.deleteMessage(c.chatId, prevMenuMsgId);
			} catch (e) {
				// skip error
			}
		}

		const { message_id } = await c.reply(this.currentPage.text, {
			reply_markup: keyboard,
		});

		await saveToCache(
			c,
			PREV_MENU_MSG_ID_CACHE_NAME,
			message_id,
			CACHE_MENU_MSG_ID_TTL_SEC,
		);
	}

	async _setupState(newPartialState, replaceState) {
		return;

		// TODO: если кэш протух то что?
		if (newPartialState === null) {
			newPayload = {};
		} else {
			// TODO: deep merge
			newPayload = {
				state: {
					...(oldPayload?.state || {}),
					...(newPartialState || {}),
				},
			};
		}

		this.currentPage.setPayload(newPayload);
	}
}
