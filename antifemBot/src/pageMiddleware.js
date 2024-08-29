import { InlineKeyboard } from 'grammy';

export class PageBase {
	pager;
	text;
	menu = [];

	constructor(pager) {
		this.pager = pager;
	}
}

// export function pageMiddleware(bot) {
// 	return async (c, next) => {
// 		const pager = new Pager(c);
//
// 		c.pager = pager;
//
// 		console.log(11111, 'once???');
//
// 		bot.on('callback_query:data', pager._handleQueryData);
// 		bot.on('message', pager._handleMessage);
//
// 		return next();
// 	};
// }

export class Pager {
	c;
	pages = {};
	currentPath;
	currentPage;

	constructor(initialPages) {
		this.pages = initialPages;
	}

	register(pathTo, page) {
		this.pages[pathTo] = page;
	}

	async go(pathTo, payload) {
		this.currentPath = pathTo;

		if (this.pages[pathTo]) {
			this.currentPage = new this.pages[pathTo](this);

			await this.currentPage.init(this.c, payload);

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

	_handleQueryData = (c) => {
		const data = c.update.callback_query.data;
		const [pager, pathTo, rowIndex, btnIndex] = data.split('|');

		console.log(2222, pathTo, rowIndex, btnIndex, this.pages[pathTo]);

		// TODO: add payload

		this.pages[pathTo]?.menu?.[rowIndex]?.[btnIndex]?.[1](c);
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

		await this.c.reply(this.currentPage.text, { reply_markup: kb });

		// if (menu.length === 1) {
		// 	// use only one row
		// 	for (const btn of menu[0]) {
		// 		kb.text(btn[0]);
		// 	}
		// } else {
		// 	for (const row of menu) {
		// 		for (const btn of row) {
		// 			kb.text(btn[0]);
		// 		}
		//
		// 	}
		// }
	}
}
