import { InlineKeyboard } from 'grammy';
import _ from 'lodash';
import { loadFromCache, saveToCache } from './helpers.js';
import { KV_KEYS, SESSION_STATE_TTL_SEC } from './constants.js';

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

	get users() {
		return this.router.users;
	}

	get config() {
		return this.router.config;
	}

	get KV() {
		return this.router.KV;
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

// export async function makeRouter(initialPages) {
// 	const router = new PageRouter(initialPages);
//
// 	// TODO: useless
// 	await router.init();
//
// 	return router;
// }

export class PageRouter {
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

	get users() {
		return this.c.ctx[CTX_KEYS.users];
	}

	get config() {
		return this.c.ctx[CTX_KEYS.config];
	}

	get KV() {
		return this.c.ctx[CTX_KEYS.KV];
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

	// resetState() {
	// 	this._state = {};
	// }

	async reload() {
		if (!this.currentPath)
			return this.c.reply(
				`ERROR: Can't reload because there isn't current page`,
			);

		// TODO: в принципе не обязательно передавать страницу, он всеравно возмёт из стейта
		return this.go(this.currentPath);
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
		c.router = this;

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

		try {
			await this._switchPage();
		} catch (e) {
			return c.reply(String(e));
		}

		// The start of request
		const data = c.update.callback_query.data;
		const [marker, btnId, ...bntPayloadRest] = data.split('|');

		if (marker !== QUERY_MARKER) return;

		const btnPayload = bntPayloadRest.length
			? JSON.parse(bntPayloadRest.join('|'))
			: undefined;

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

		// TODO: если идёт переход не на home и нет стейта то он протух
		// написать сообщение и отправить на главную

		const pathTo = newPath || this.state.currentPath;

		console.log(3333, this.state, newPath);

		this._state.currentPath = pathTo;

		if (!this.pages[pathTo]) throw new Error(`Wrong path "${pathTo}"`);

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
				let query = `${QUERY_MARKER}|${id}`;

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
		// in case switching page on .go()
		if (this.state) return;

		this._loadedState = await loadFromCache(this.c, STATE_CACHE_NAME);

		console.log(22222, this._loadedState);

		this._state = this._loadedState || {};
	}

	async _theEndOfRequest() {
		// in case it has been run from .go()
		// TODO: ?????
		if (!this.state) return;

		console.log(11111, this.state);

		// if (!_.isEqual(this._loadedState, this.state)) {
		await saveToCache(
			this.c,
			STATE_CACHE_NAME,
			this.state,
			SESSION_STATE_TTL_SEC,
		);
		// }

		this._state = undefined;
	}
}
