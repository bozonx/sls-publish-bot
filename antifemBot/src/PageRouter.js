import _ from 'lodash';
import {
	loadFromCache,
	parseJsonSafelly,
	saveToCache,
	renderMenuKeyboard,
} from './helpers.js';
import { SESSION_STATE_TTL_SEC, CTX_KEYS, QUERY_MARKER } from './constants.js';

const PREV_MENU_MSG_ID_STATE_NAME = 'prevMsgId';
const SESSION_CACHE_NAME = 'pageState';

// It makes a new instance of router on each request including dev env
export function routerMiddleware(routes) {
	return async (c, next) => {
		c.router = new PageRouter(c, routes);

		return next();
	};
}

/**
 * IMPORTANT: Do not store andy state inside your page class between requests
 */
export class PageBase {
	router;
	// path of this page
	path;
	// Put here the description of menu
	text;
	// Put here menu rows and buttons
	// like [ [ {id, label, payload, cb(payload, id)}, ...btns ], ..rows ]
	menu = [];

	// state which is passed between pages using cache
	// actually it is a session
	get state() {
		return this.router.state;
	}

	get chatWithBotId() {
		return this.router.chatWithBotId;
	}

	get me() {
		return this.router.me;
	}

	get users() {
		return this.router.users;
	}

	get config() {
		return this.router.config;
	}

	// It runs when a route of certain user has been changed
	constructor(router, path) {
		this.router = router;
		this.path = path;
	}

	// It runs twice
	// 1. when a route of certain user has been changed
	// 2. when button is pressed. It should find menu handler
	async mount() { }

	// It runs when a route is changing
	async unmount() { }

	// It runs on each income message while this page is active
	async onMessage() { }
}

export class PageRouter {
	c;
	// not initialized pages
	pages = {};
	// current initialized page
	currentPage;
	// path of previous page which was changed while handling request
	prevPath;
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

	get chatWithBotId() {
		return this.c.ctx[CTX_KEYS.chatWithBotId];
	}

	get me() {
		return this.c.ctx[CTX_KEYS.me];
	}

	get users() {
		return this.c.ctx[CTX_KEYS.users];
	}

	get config() {
		return this.c.ctx[CTX_KEYS.config];
	}

	constructor(c, initialPages) {
		this.c = c;
		this.pages = initialPages;
	}

	async reload() {
		// TODO: может это перенести в go()
		if (!this.currentPath)
			return this.c.reply(
				`ERROR: Can't reload because there isn't current page`,
			);

		// TODO: в принципе не обязательно передавать страницу, он всеравно возмёт из стейта
		return this.go(this.currentPath);
	}

	async go(pathTo) {
		const c = this.c;

		console.log('-----go', pathTo);

		try {
			await this._switchPage(pathTo);
		} catch (e) {
			await c.reply(String(e));

			// TODO: ???
			throw e;
		}

		await this._sendMenu(renderMenuKeyboard(this.currentPage.menu));
		// really the end of request
		return this._theEndOfRequest();
	}

	// middleware = async (c, next) => {
	// 	this.c = c;
	// 	c.router = this;
	//
	// 	return next();
	// };

	_handleMessage = async (c) => {
		console.log('-----_handleMessage', c.msg);

		try {
			await this._switchPage();
		} catch (e) {
			return c.reply(String(e));
		}

		await this.currentPage.onMessage?.();
		// the end of request only if there has been called .go()
		if (this.prevPath) await this._theEndOfRequest();
		// await this._theEndOfRequest();
	};

	_handleQueryData = async (c) => {
		console.log('============ _handleQueryData', c.update.callback_query.data);

		// TODO: вначале загружаем прошлую страницу
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
			? parseJsonSafelly(bntPayloadRest.join('|'))
			: undefined;

		const menu = this.currentPage.menu;

		if (!menu?.length) return c.reply(`ERROR: No menu`);

		for (const row of menu) {
			for (const { id, cb } of row) {
				if (String(id) !== btnId) continue;
				// run menu button handler
				await cb(btnPayload, id);
				// the end of request only if there has been called .go()
				// TODO: review
				if (this.prevPath) await this._theEndOfRequest();
				// await this._theEndOfRequest();

				return;
			}
		}

		return c.reply(`ERROR: Can't find button. ${data}`);
	};

	// TODO: review
	async _switchPage(newPath) {
		if (this.currentPage) {
			// save previous path
			this.prevPath = this.currentPage.path;

			await this.currentPage.unmount();
		}

		await this._loadState();

		// TODO: если идёт переход не на home и нет стейта то он протух
		// написать сообщение и отправить на главную

		const pathTo = newPath || this.state.currentPath;

		console.log(11111, this.state, newPath);

		this._state.currentPath = pathTo;

		if (!this.pages[pathTo]) throw new Error(`Wrong path "${pathTo}"`);

		// make current page instance
		this.currentPage = new this.pages[pathTo](this, pathTo);
		await this.currentPage.mount();
	}

	async _loadState() {
		// in case switching page on .go()
		if (this.state) return;
		else if (this.state === null) {
			throw new Error(`ERROR: Request has been already finished`);
		}

		this._loadedState = await loadFromCache(this.c, SESSION_CACHE_NAME);

		console.log('========== _loadState', this._loadedState);

		this._state = this._loadedState || {};
	}

	async _theEndOfRequest() {
		if (!this.state) return;

		console.log('============ _theEndOfRequest', this.state);

		// TODO: review
		// if (!_.isEqual(this._loadedState, this.state)) {
		await saveToCache(
			this.c,
			SESSION_CACHE_NAME,
			this.state,
			SESSION_STATE_TTL_SEC,
		);
		// }

		this._state = null;
		this.prevPath = null;
	}

	async _sendMenu(keyboard) {
		const c = this.c;

		// const prevMenuMsgId = await loadFromCache(c, PREV_MENU_MSG_ID_CACHE_NAME);

		// remove prev menu message
		if (this.state[PREV_MENU_MSG_ID_STATE_NAME]) {
			try {
				await c.api.deleteMessage(
					c.chatId,
					this.state[PREV_MENU_MSG_ID_STATE_NAME],
				);
			} catch (e) {
				// skip error
			}
		}

		const { message_id } = await c.reply(this.currentPage.text, {
			reply_markup: keyboard,
		});

		this.state[PREV_MENU_MSG_ID_STATE_NAME] = message_id;

		// await saveToCache(
		// 	c,
		// 	PREV_MENU_MSG_ID_CACHE_NAME,
		// 	message_id,
		// 	CACHE_MENU_MSG_ID_TTL_SEC,
		// );
	}
}
