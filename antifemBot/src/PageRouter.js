import { InlineKeyboard } from 'grammy';
import _ from 'lodash';
import { loadFromCache, saveToCache } from './helpers.js';
import { CACHE_MENU_MSG_ID_TTL_SEC, CACHE_STATE_TTL_SEC } from './constants.js';

const QUERY_MARKER = 'PageRouter';
const PREV_MENU_MSG_ID_CACHE_NAME = 'prevMsgId';
const STATE_CACHE_NAME = 'pageState';

/**
 * Do not store andy state inside your page class between requests
 */
export class PageBase {
	router;
	// path of this page
	path;
	// Put here the description of menu
	text;
	// Put here menu rows and buttons here
	// like [ [ {id, label, payload, cb(id, payload)}, ...btns ], ..rows ]
	menu = [];

	// state which is passed between pages using cache
	get state() {
		return this.router.state;
	}

	// It runs when a route of certain user has been changed
	constructor(router, path) {
		this.router = router;
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
	// state which is loaded from DB on request start
	_loadedState;

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

	resetState() {
		//
	}

	// // TODO: будет автоматом сохранен
	// async setState(newStateToReplace) {
	// 	// await saveToCache(
	// 	// 	this.c,
	// 	// 	STATE_CACHE_NAME,
	// 	// 	newStateToReplace,
	// 	// 	CACHE_STATE_TTL_SEC,
	// 	// );
	//
	// 	this._state = newStateToReplace;
	// }

	async reload(newPartialState, replaceState) {
		this.go(this.currentPage?.path, newPartialState, replaceState);
	}

	/**
	 * @param {object|null} newPartialState - state which will be merged with the main state. Null means totally clear state
	 * @param {boolean} [replaceState=false] - if set then the main state will be replaced with newPartialState
	 */
	async go(pathTo) {
		const c = this.c;

		console.log('-----go', pathTo);

		try {
			await this._switchPage(pathTo);
		} catch (e) {
			return c.reply(String(e));
		}

		const keyboard = this._renderMenuKeyboard();

		await this._sendMenu(keyboard);

		return this._theEndOfRequest();
	}

	middleware = async (c, next) => {
		this.c = c;
		c.pager = this;

		return next();
	};

	_handleMessage = async (c) => {
		console.log('-----_handleMessage', c.msg);

		try {
			await this._switchPage();
		} catch (e) {
			return c.reply(String(e));
		}

		await this.currentPage.onMessage?.();

		return this._theEndOfRequest();
	};

	_handleQueryData = async (c) => {
		console.log('-----_handleQueryData', c.update.callback_query.data);

		// The start of request
		const data = c.update.callback_query.data;
		const [marker, btnId, ...bntPayloadRest] = data.split('|');

		if (marker !== QUERY_MARKER) return;

		const btnPayload = bntPayloadRest.length
			? JSON.parse(bntPayloadRest.join('|'))
			: undefined;

		try {
			await this._switchPage();
		} catch (e) {
			return c.reply(String(e));
		}

		const menu = this.currentPage.menu;

		if (!menu?.length) return c.reply(`ERROR: No menu`);

		for (const row of menu) {
			for (const { id, cb } of row) {
				if (String(id) !== btnId) continue;
				// run menu button handler
				await cb(id, btnPayload);

				return this._theEndOfRequest();
			}
		}

		return c.reply(`ERROR: Can't find button. ${data}`);
	};

	async _switchPage(newPath) {
		await this.currentPage?.unmount();
		await this._loadState();

		let pathTo = newPath || this.state.currentPath;

		if (!pathTo)
			if (!this.pages[pathTo]) throw new Error(`Wrong path "${pathTo}"`);

		// configure state after it has been loaded before page initializing
		// await cb?.();

		// make current page instance
		this.currentPage = new this.pages[pathTo](this, pathTo);
		await this.currentPage.mount();
	}

	_renderMenuKeyboard() {
		const menu = this.currentPage?.menu;

		if (!menu?.length) return;

		const keyboard = new InlineKeyboard();

		for (const row of menu) {
			for (const { id, label, payload } of row) {
				let query = `${QUERY_MARKER}|${this.currentPath}|${id}`;

				if (payload) query += `|${JSON.stringify(payload)}`;

				keyboard.text(label, query);
			}

			keyboard.row();
		}

		return keyboard;
	}

	async _sendMenu(keyboard) {
		const c = this.c;

		// TODO: сохранять в стейте ???

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

	async _loadState() {
		// in case switching page is run on /start command
		if (this.state) return;

		this._loadedState = await loadFromCache(this.c, STATE_CACHE_NAME);
		this._state = this._loadedState || {};
	}

	async _theEndOfRequest() {
		// in case it has been run from .go()
		if (this.state) return;

		if (!_.isEqual(this._loadedState, this.state)) {
			await saveToCache(c, STATE_CACHE_NAME, this.state, CACHE_STATE_TTL_SEC);
		}

		this._state = undefined;
	}
}
