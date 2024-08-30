import { InlineKeyboard } from 'grammy';

const QUERY_MARKER = 'PageRouter';

export class PageBase {
	pager;
	path;
	// description of menu
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
	currentPage;

	get currentPath() {
		return this.currentPath?.path;
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

	// TODO: как передать prevMenuMsgId ???
	async go(pathTo, { prevMenuMsgId, state }) {
		await this.currentPage?.unmount(this.c);

		if (!this.pages[pathTo]) return this.c.reply(`Wrong path "${pathTo}"`);

		this.currentPage = this.pages[pathTo];

		await this.currentPage.mount(this.c, state);
		// remove prev menu message
		if (prevMenuMsgId) {
			await this.c.api.deleteMessage(this.c.chatId, prevMenuMsgId);
		}

		await this._renderMenu(state);

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
		const [marker, pathTo, rowIndex, btnIndex, ...payloadRest] =
			data.split('|');

		if (marker !== QUERY_MARKER) return;

		const payload = (state?.length && JSON.parse(payloadRest.join('|'))) || [];
		// run menu button handler
		return this.pages[pathTo]?.menu?.[rowIndex]?.[btnIndex]?.[1](c, payload);
	};

	_handleMessage = (c) => {
		return this.currentPage?.message?.(c);
	};

	async _renderMenu(state) {
		const menu = this.currentPage?.menu;

		if (!menu) return;

		const keyboard = new InlineKeyboard();

		for (const rowIndex in menu) {
			for (const btnIndex in menu[rowIndex]) {
				const [text] = menu[rowIndex][btnIndex];
				// TODO: как передать message_id ???
				const payloadStr = JSON.stringify({ state });

				keyboard.text(
					text,
					`${QUERY_MARKER}|${this.currentPath}|${rowIndex}|${btnIndex}|${payloadStr}`,
				);
			}

			keyboard.row();
		}

		const { message_id } = await this.c.reply(this.currentPage.text, {
			reply_markup: keyboard,
		});

		// TODO: как передать message_id ???
		// this.prevMenuMessageId = message_id;
	}
}
