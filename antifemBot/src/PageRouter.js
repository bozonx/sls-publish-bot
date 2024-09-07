import { t, parseJsonSafelly, renderMenuKeyboard } from './helpers/helpers.js';
import { saveToCache } from './io/KVio.js';
import { printFinalPost } from './helpers/publishHelpres.js';
import {
	SESSION_STATE_TTL_SEC,
	CTX_KEYS,
	QUERY_MARKER,
	HOME_PAGE,
	SESSION_CACHE_NAME,
} from './constants.js';

const PREV_MENU_MSG_ID_STATE_NAME = 'prevMsgId';

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
	// if menu text in md v2
	menuTextInMd = false;

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

	get db() {
		return this.router.db;
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
	// switch which means redraw menu when it should be rendered
	_redrawMenu;

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

	// DbCrud
	get db() {
		return this.c.ctx[CTX_KEYS.DB_CRUD];
	}

	// app config from db
	get config() {
		return this.c.ctx[CTX_KEYS.config];
	}

	constructor(c, initialPages) {
		this.c = c;
		this.pages = initialPages;
	}

	$handleMessage = async (c) => {
		try {
			await this._handleMessage();
		} catch (e) {
			if (c.ctx[CTX_KEYS.APP_DEBUG]) {
				await c.reply(
					`ERROR: handling income message ${e}\n\nmessage:\n${JSON.stringify(c.msg)}\n\nstate:\n${JSON.stringify(this.state)}`,
				);
			}

			throw e;
		}
	};

	$handleQueryData = async (c) => {
		try {
			await this._handleQueryData();
		} catch (e) {
			if (c.ctx[CTX_KEYS.APP_DEBUG]) {
				await c.reply(
					`ERROR: handling query data ${e}\n\nmessage:\n${JSON.stringify(c.msg)}\n\nstate:\n${JSON.stringify(this.state)}`,
				);
			}

			throw e;
		}
	};

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
		this._redrawMenu = true;
	}

	async reload() {
		if (!this.currentPath)
			throw new Error(`ERROR: Can't reload because there isn't current page`);

		return this.go();
	}

	// on command start - just draw the menu
	async start() {
		this.redrawMenu();
		await this.go(HOME_PAGE);

		return this._theEndOfRequest();
	}

	async go(pathTo) {
		try {
			const msg = await this._switchPage(pathTo);

			if (msg) return this.reply(msg);
		} catch (e) {
			await this.reply(String(e));

			throw e;
		}

		const menu = (await this.currentPage.renderMenu?.()) || [];

		return this._sendMenu(renderMenuKeyboard(menu));
	}

	async _handleMessage() {
		// it loads current page
		try {
			const msg = await this._switchPage();

			if (msg) return this.reply(msg);
		} catch (e) {
			await this.reply(String(e));

			throw e;
		}
		// redraw menu after user message
		this.redrawMenu();

		await this.currentPage.onMessage?.();
		// really the end of request
		return this._theEndOfRequest();
	}

	async _handleQueryData() {
		const data = this.c.update.callback_query.data;
		const [marker, btnId, ...bntPayloadRest] = data.split('|');
		// do not handle not menu queries
		if (marker !== QUERY_MARKER) return;

		const btnPayload = bntPayloadRest.length
			? parseJsonSafelly(bntPayloadRest.join('|'))
			: undefined;

		// it loads current page
		try {
			const msg = await this._switchPage();

			if (msg) return this.reply(msg);
		} catch (e) {
			await this.reply(String(e));

			throw e;
		}

		const prevPath = this.currentPath;
		const result = await this.currentPage.onButtonPress?.(btnId, btnPayload);

		if (result === false)
			return this.reply(
				`ERROR: Can't find button handler "${btnId}" on page "${prevPath}"`,
			);

		// really the end of request
		return this._theEndOfRequest();
	}

	async _switchPage(newPath) {
		await this.currentPage?.unmount?.();
		const isSessionLost = await this._loadSession(newPath);

		if (isSessionLost) return `${t(this.c, 'sessionLost')} /start`;

		// switch to new path or use current page (reload)
		const pathTo = newPath || this.state.currentPath;

		if (!pathTo)
			throw new Error(`ERROR: No path. Start from the beginning /start`);
		else if (!this.pages[pathTo]) throw new Error(`Wrong path "${pathTo}"`);

		this._state.currentPath = pathTo;
		// make current page instance
		this.currentPage = new this.pages[pathTo](this, pathTo);

		await this.currentPage.mount?.();
	}

	async _loadSession(newPath) {
		// in case switching page on .go()
		if (this.state) return;
		else if (this.state === null) {
			throw new Error(`ERROR: Request has been already finished`);
		}

		this._loadedSession = this.c.ctx[CTX_KEYS.session];
		this._state = this._loadedSession || {};

		// TODO: сработает только при переходе на главную, что бесмылсено

		// If stale or absent session and not home page then suggest to start
		// If home page and stale session it is OK
		if (!this._loadedSession && newPath !== HOME_PAGE) return true;
	}

	async _theEndOfRequest() {
		// save session each time request finish because the session is always different
		await saveToCache(
			this.c,
			SESSION_CACHE_NAME,
			this.state,
			SESSION_STATE_TTL_SEC,
		);

		this._state = null;
	}

	async _sendMenu(keyboard) {
		const c = this.c;
		const prevMsgId = this.state[PREV_MENU_MSG_ID_STATE_NAME];
		const options = {
			reply_markup: keyboard,
		};
		const text = this.currentPage.text;

		if (this.currentPage.menuTextInMd) options.parse_mode = 'MarkdownV2';

		let msgId;
		// try to update previous message
		if (!this._redrawMenu && prevMsgId) {
			try {
				const { message_id } = await c.api.editMessageText(
					this.chatWithBotId,
					prevMsgId,
					text,
					options,
				);

				msgId = message_id;
			} catch (e) {
				// skip error. means need to create a new post
			}
		}
		// if can't edit message then delete previous and create a new one
		if (!msgId) {
			const [, createMenuResult] = await Promise.all([
				// remove prev menu message
				prevMsgId &&
				(async () => {
					try {
						await c.api.deleteMessage(this.chatWithBotId, prevMsgId);
					} catch (e) {
						// ignore error if can't find message to delete
					}
				})(),
				// print a new menu
				await c.reply(text, options),
			]);

			msgId = createMenuResult.message_id;
		}

		this._redrawMenu = null;
		this.state[PREV_MENU_MSG_ID_STATE_NAME] = msgId;
	}
}
