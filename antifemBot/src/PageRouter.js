import { InlineKeyboard } from 'grammy';

const QUERY_MARKER = 'PageRouter';

export class PageBase {
	pager;
	path;
	payload;
	// description of menu
	text;
	menu = [];

	constructor(pager, path) {
		this.pager = pager;
		this.path = path;
	}

	setPayload(payload) {
		this.payload = payload;
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
	async go(pathTo, newPartialState) {
		if (!this.currentPage) return this.c.reply('No current page');

		const { prevMenuMsgId, state: oldState } = this.currentPage.payload;
		await this.currentPage?.unmount();

		if (!this.pages[pathTo]) return this.c.reply(`Wrong path "${pathTo}"`);

		this.currentPage = this.pages[pathTo];

		const newPayload = {
			state: {
				...(oldState || {}),
				...(newPartialState || {}),
			},
		};

		this.currentPage.setPayload(newPayload);
		await this.currentPage.mount();
		// remove prev menu message
		if (prevMenuMsgId) {
			await this.c.api.deleteMessage(this.c.chatId, prevMenuMsgId);
		}

		await this._renderMenu(newPayload);

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
		return this.pages[pathTo]?.menu?.[rowIndex]?.[btnIndex]?.[1](payload);
	};

	_handleMessage = (c) => {
		return this.currentPage?.message?.();
	};

	async _renderMenu(payload) {
		const menu = this.currentPage?.menu;

		if (!menu) return;

		const keyboard = new InlineKeyboard();

		for (const rowIndex in menu) {
			for (const btnIndex in menu[rowIndex]) {
				const [text] = menu[rowIndex][btnIndex];
				// TODO: как передать message_id ???
				const payloadStr = JSON.stringify(payload);

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
