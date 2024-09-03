import _ from 'lodash';
import {
	loadFromCache,
	parseJsonSafelly,
	saveToCache,
	renderMenuKeyboard,
} from './helpers.js';
import {
	SESSION_STATE_TTL_SEC,
	CTX_KEYS,
	QUERY_MARKER,
	HOME_PAGE,
} from './constants.js';
import { printFinalPost } from './publishHelpres.js';

const PREV_MENU_MSG_ID_STATE_NAME = 'prevMsgId';
const SESSION_CACHE_NAME = 'session';

// It makes a new instance of router on each request including dev env
export function routerMiddleware(routes) {
	return async (c, next) => {
		c.router = new PageRouter(c, routes);

		return next();
	};
}

/**
 * You can store some data in class, you can define it in mount() method
 * and this class properitites will be accesable in other methods.
 * But keep in mind that this data is storing only while handlind current request,
 * not between requests.
 * To store data between requests put values into this.state,
 * and the will be saved automaticaly.
 */
export class PageBase {
	router;
	// path of this page
	path;
	// Put here the description of menu
	text;

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

	// Please use this instead of context's one
	async reply(...p) {
		return this.router.reply(...p);
	}

	async printFinalPost(...p) {
		return this.router.printFinalPost(...p);
	}

	// It runs on each request.
	// You can save some state to user in other functions while request is handling
	async mount() { }

	// It runs when a route is changing. On each request
	async unmount() { }

	// Render menu here and return it.
	// It runs only when the menu need to be renderred
	// Menu has to be like [ [ {id, label, payload, cb(payload, id)}, ...btns ], ..rows ]
	async renderMenu() { }

	// It runs on each income message while this page is active
	async onMessage() { }

	// It runs on each button press of menu of this page
	async onButtonPress(btnId, payload) { }
}

export class PageRouter {
	c;
	// not initialized pages
	pages = {};
	// current initialized page
	currentPage;
	// readonly state
	_state;
	// state which is loaded from DB on request start
	_loadedSession;

	get state() {
		return this._state;
	}

	get currentPath() {
		return this.currentPage?.path;
	}

	// Chat id of current user and this bot
	get chatWithBotId() {
		return this.c.ctx[CTX_KEYS.chatWithBotId];
	}

	// user object
	get me() {
		return this.c.ctx[CTX_KEYS.me];
	}

	// all the users
	get users() {
		return this.c.ctx[CTX_KEYS.users];
	}

	// app config from db
	get config() {
		return this.c.ctx[CTX_KEYS.config];
	}

	constructor(c, initialPages) {
		this.c = c;
		this.pages = initialPages;
	}

	// Please use this instead of context's one
	async reply(...p) {
		this.redrawMenu();

		return this.c.reply(...p);
	}

	async printFinalPost(...p) {
		this.redrawMenu();

		return printFinalPost(this.c, ...p);
	}

	redrawMenu() {
		this.state.redrawMenu = true;
	}

	async reload() {
		// TODO: может это перенести в go()
		// if (!this.currentPath)
		// 	return this.this.reply(
		// 		`ERROR: Can't reload because there isn't current page`,
		// 	);

		// TODO: в принципе не обязательно передавать страницу, он всеравно возмёт из стейта
		// return this.go(this.currentPath);

		return this.go();
	}

	// on command start - just draw the menu
	async start() {
		await this.go(HOME_PAGE);

		return this._theEndOfRequest();
	}

	async go(pathTo) {
		console.log('=========== go', pathTo);

		try {
			const msg = await this._switchPage();

			if (msg) return this.reply(msg);
		} catch (e) {
			await this.reply(String(e));

			throw e;
		}

		const menu = (await this.currentPage.renderMenu()) || [];

		return this._sendMenu(renderMenuKeyboard(menu));
	}

	_handleMessage = async (c) => {
		console.log('============= _handleMessage', c.msg);

		// it loads current page
		try {
			const msg = await this._switchPage();

			if (msg) return this.reply(msg);
		} catch (e) {
			await this.reply(String(e));

			throw e;
		}

		await this.currentPage.onMessage?.();
		// really the end of request
		return this._theEndOfRequest();
	};

	_handleQueryData = async (c) => {
		console.log('============ _handleQueryData', c.update.callback_query.data);

		// it loads current page
		try {
			const msg = await this._switchPage();

			if (msg) return this.reply(msg);
		} catch (e) {
			await this.reply(String(e));

			throw e;
		}

		// The start of request
		const data = c.update.callback_query.data;
		const [marker, btnId, ...bntPayloadRest] = data.split('|');

		if (marker !== QUERY_MARKER) return;

		const btnPayload = bntPayloadRest.length
			? parseJsonSafelly(bntPayloadRest.join('|'))
			: undefined;

		const result = await this.currentPage.onButtonPress(btnId, btnPayload);

		if (result === false)
			return this.reply(
				`ERROR: Can't find button handler "${btnId}" on page "${this.currentPath}"`,
			);

		// really the end of request
		return this._theEndOfRequest();
	};

	async _switchPage(newPath) {
		await this.currentPage?.unmount();
		await this._loadSession();

		if (!this._loadedSession && newPath !== HOME_PAGE)
			return `Session has been lost. Start from the beginning /start`;

		const pathTo = newPath || this.state.currentPath;

		if (!newPath)
			throw new Error(`ERROR: No path. Start from the beginning /start`);

		this._state.currentPath = pathTo;

		if (!this.pages[pathTo]) throw new Error(`Wrong path "${pathTo}"`);

		// make current page instance
		this.currentPage = new this.pages[pathTo](this, pathTo);

		await this.currentPage.mount();
	}

	async _loadSession() {
		// in case switching page on .go()
		if (this.state) return;
		else if (this.state === null) {
			throw new Error(`ERROR: Request has been already finished`);
		}

		this._loadedSession = await loadFromCache(this.c, SESSION_CACHE_NAME);

		console.log('========== _loadState', this._loadedSession);

		this._state = this._loadedSession || {};
	}

	async _theEndOfRequest() {
		console.log('============ _theEndOfRequest', this.state);

		if (!_.isEqual(this._loadedSession, this.state)) {
			await saveToCache(
				this.c,
				SESSION_CACHE_NAME,
				this.state,
				SESSION_STATE_TTL_SEC,
			);
		}

		this._state = null;
	}

	async _sendMenu(keyboard) {
		const c = this.c;
		const prevMsgId = this.state[PREV_MENU_MSG_ID_STATE_NAME];
		let msgId;

		// remove prev menu message
		if (!this.state.redrawMenu && prevMsgId) {
			try {
				const { message_id } = await c.api.editMessageText(
					this.chatWithBotId,
					prevMsgId,
					this.currentPage.text,
					{ reply_markup: keyboard },
				);

				// msgId = message_id;
				msgId = prevMsgId;
			} catch (e) {
				// skip error. means need to create a new post
			}
		}

		// if can't edit message of there isn't any message then create a new one
		if (!msgId) {
			const [deleteResult, sendResult] = await Promise.all([
				prevMsgId && (await c.api.deleteMessage(this.chatWithBotId, prevMsgId)),
				await c.reply(this.currentPage.text, { reply_markup: keyboard }),
			]);

			msgId = sendResult.message_id;
		}

		delete this.state.redrawMenu;

		if (msgId) this.state[PREV_MENU_MSG_ID_STATE_NAME] = msgId;
	}
}
