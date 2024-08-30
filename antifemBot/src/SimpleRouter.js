import { InlineKeyboard } from 'grammy';

export class PageBase {
	pager;
	path;
	text;
	menu = [];

	constructor(pager, path) {
		this.pager = pager;
		this.path = path;
	}

	// It runs only first time init on app start
	async init() {}

	// It runs when a route has been changed
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

class SimpleRouter {
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

	async go(pathTo, payload) {
		await this.currentPage?.unmount(this.c);

		this.currentPage = undefined;
		this.currentPath = undefined;

		// remove prev menu message
		if (this.prevMenuMessageId) {
			await this.c.api.deleteMessage(this.c.chatId, this.prevMenuMessageId);
		}

		this.currentPath = pathTo;

		if (this.pages[pathTo]) {
			this.currentPage = this.pages[pathTo];

			await this.currentPage.mount(this.c, payload);
			await this._renderMenu();
		} else {
			await this.c.reply(`Wrong path "${pathTo}"`);
		}
	}

	middleware = async (c, next) => {
		this.c = c;
		// it runs on every request
		c.pager ??= this;

		return next();
	};

	_handleQueryData = async (c) => {
		const data = c.update.callback_query.data;
		const [pager, pathTo, rowIndex, btnIndex] = data.split('|');

		await this.pages[pathTo]?.menu?.[rowIndex]?.[btnIndex]?.[1](c);
	};

	_handleMessage = async (c) => {
		await this.currentPage?.message?.(c);
	};

	async _renderMenu() {
		const menu = this.currentPage?.menu;

		if (!menu) return;

		const kb = new InlineKeyboard();

		for (const rowIndex in menu) {
			for (const btnIndex in menu[rowIndex]) {
				const [text] = menu[rowIndex][btnIndex];

				kb.text(text, `pager|${this.currentPath}|${rowIndex}|${btnIndex}`);
			}

			kb.row();
		}

		const { message_id } = await this.c.reply(this.currentPage.text, {
			reply_markup: kb,
		});

		this.prevMenuMessageId = message_id;
	}
}
