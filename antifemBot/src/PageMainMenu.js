import { t } from './helpers.js';
import { PageBase } from './SimpleRouter.js';

export class PageMainMenu extends PageBase {
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
