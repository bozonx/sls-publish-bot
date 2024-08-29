import { t } from './helpers.js';
import { PageBase } from './Pager.js';

export class PagePubAuthor extends PageBase {
	async init() {
		// only first time init on app start
	}

	async mount(c, payload) {
		const isMainAdmin =
			c.msg.from.id === Number(c.config.MAIN_ADMIN_TG_USER_ID);

		this.text = t(c, 'selectAuthor');

		this.menu = [
			// row
			[
				[
					t(c, 'noAuthor'),
					(c) => {
						// c.pager.go('home');
					},
				],
			],
			[
				// button
				[
					t(c, 'toHome'),
					(c) => {
						c.pager.go('home');
					},
				],
				[
					t(c, 'back'),
					(c) => {
						c.pager.go('pub-text');
					},
				],
			],
		];
	}

	async unmount(c) {
		//
	}

	async message(c) {
		//
		console.log(1111, c);

		await c.pager.go('pub-tags');

		// await c.reply(t(c, 'textAccepted'))
	}
}
