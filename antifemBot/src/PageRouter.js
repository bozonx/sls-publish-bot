import { InlineKeyboard } from 'grammy';

const QUERY_MARKER = 'PageRouter';

export class PageBase {
	pager;
	path;
	text;
	menu = [];

	constructor(pager, path) {
		this.pager = pager;
		this.path = path;
	}

	// It runs only first time init on app start. It means for all the users
	async init() {}

	// It runs when a route of certain user has been changed
	async mount(c, payload) {}

	// It runs when a route is changing
	async unmount(c) {}

	// It runs on each income message while this page is active
	async message(c) {}
}

export async function makeRouter(initialPages) {
	const router = new SimpleRouter(initialPages);

	await router.init();

	return router;
}

class PageRouter {
	c;
	pages = {};
	currentPath;
	currentPage;
	prevMenuMessageId;

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

	async go(pathTo, state) {
		await this.currentPage?.unmount(this.c);

		if (!this.pages[pathTo]) return this.c.reply(`Wrong path "${pathTo}"`);

		this.currentPath = pathTo;
		this.currentPage = this.pages[pathTo];

		await this.currentPage.mount(this.c, payload);

		// remove prev menu message
		if (this.prevMenuMessageId) {
			// TODO: Это должно быть по сессиям !!!!
			await this.c.api.deleteMessage(this.c.chatId, this.prevMenuMessageId);
		}

		await this._renderMenu();

		// The end of request
	}

	middleware = async (c, next) => {
		this.c = c;
		c.pager = this;

		return next();
	};

	_handleQueryData = async (c) => {
		// The start of request
		const data = c.update.callback_query.data;
		const [marker, pathTo, rowIndex, btnIndex, ...stateRest] = data.split('|');

		if (marker !== QUERY_MARKER) return;

		const state = (state?.length && JSON.parse(stateRest.join('|'))) || [];

		await this.pages[pathTo]?.menu?.[rowIndex]?.[btnIndex]?.[1](c, state);
	};

	// TODO: remake!!!!
	_handleMessage = async (c) => {
		await this.currentPage?.message?.(c);
	};

	// TODO: remake!!!!
	async _renderMenu() {
		const menu = this.currentPage?.menu;

		if (!menu) return;

		const kb = new InlineKeyboard();

		for (const rowIndex in menu) {
			for (const btnIndex in menu[rowIndex]) {
				const [text] = menu[rowIndex][btnIndex];

				kb.text(
					text,
					`${QUERY_MARKER}|${this.currentPath}|${rowIndex}|${btnIndex}`,
				);
			}

			kb.row();
		}

		const { message_id } = await this.c.reply(this.currentPage.text, {
			reply_markup: kb,
		});

		this.prevMenuMessageId = message_id;
	}
}
