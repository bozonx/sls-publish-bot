import { t } from './helpers.js';
import { PageBase } from './pageMiddleware.js';

export class MainMenuPage extends PageBase {
	async init() {
		// only first time init on app start
	}

	async mount(c, payload) {
		const isMainAdmin =
			c.msg.chat.id === Number(c.config.MAIN_ADMIN_TG_USER_ID);

		this.text = t(c, 'mainMenu');

		this.menu = [
			// row
			[
				// button
				[
					t(c, 'publishPost'),
					(c) => {
						c.pager.go('pub-text');
					},
				],
			],
		];

		if (isMainAdmin) {
			this.menu.push([
				[
					t(c, 'editConfig'),
					(c) => {
						c.reply('edit config');
					},
				],
			]);
		}
	}

	async unmount(c) {
		//
	}

	async message(c) {
		//
		console.log(1111, c);
	}
}

// import { InlineKeyboard, Keyboard } from 'grammy';
// import { Menu } from '@grammyjs/menu';
// import { t } from './helpers.js';
//
// const PUBLISH_POST_ACTION = 'PUBLISH_POST_ACTION';
// const EDIT_CONFIG_ACTION = 'EDIT_CONFIG_ACTION';
//
// export const mainMenu = {
// 	async init(c) {
// 		const isMainAdmin =
// 			c.msg.from.id === Number(c.config.MAIN_ADMIN_TG_USER_ID);
// 		// const keyboard = new InlineKeyboard()
// 		// 	// .placeholder('pppp')
// 		// 	.text(t(c, 'publishPost'), PUBLISH_POST_ACTION);
//
// 		// c.menu.text('aaaa', (c) => c.reply('aaaa'));
//
// 		// c.menu.update();
//
// 		// if (isMainAdmin) {
// 		// 	keyboard.row().text(t(c, 'editConfig'), EDIT_CONFIG_ACTION);
// 		// }
//
// 		const { message_id } = await c.api.sendMessage(c.chatId, t(c, 'mainMenu'), {
// 			// reply_markup: c.menu,
// 			// reply_markup: new InlineKeyboard()
// 			// .login('login', 'https://p-libereco.org')
// 			// .url('login', 'https://p-libereco.org')
// 			// .text(t(ctx, 'loginToSite'), LOGIN_TO_SITE_ACTION)
// 			// .webApp('web', ctx.config.webAppUrl),
// 		});
//
// 		c.session.route = 'main-menu';
// 	},
// 	route(router) {
// 		router
// 			.route('main-menu', async (c) => {
// 				c.reply('rrrr');
//
// 				console.log(111, c);
// 				// c.session.route = 'other-key';
//
// 				/* ... */
// 			})
// 			.on('message:text', async (c) => {
// 				console.log(222, c);
// 				c.reply('tttt');
// 			});
// 	},
// };
