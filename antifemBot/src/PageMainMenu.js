import { t } from './helpers.js';
import { PageBase } from './PageRouter.js';

export class PageMainMenu extends PageBase {
	async mount(c, state) {
		const isMainAdmin =
			c.msg.chat.id === Number(c.config.MAIN_ADMIN_TG_USER_ID);

		this.text = t(c, 'mainMenu');

		this.menu = [
			// row
			[
				// button
				[
					t(c, 'publishPost'),
					async (c, payload) => {
						await c.pager.go('pub-text', payload);
					},
				],
			],
			[
				[
					t(c, 'manageTagsBtn'),
					(c) => {
						c.pager.go('tag-manager');
					},
				],
			],
		];

		if (isMainAdmin) {
			this.menu.push([
				[
					t(c, 'editConfigBtn'),
					(c) => {
						c.pager.go('config');
					},
				],
			]);
		}
	}
}
