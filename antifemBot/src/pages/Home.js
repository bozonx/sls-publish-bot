import { t } from './helpers.js';
import { PageBase } from './PageRouter.js';
import { isAdminUser } from './helpers.js';

export class PageHome extends PageBase {
	async mount(c, state) {
		const isAdmin = isAdminUser(c.msg.chat.id);

		this.text = t(c, 'homeDescr');

		this.menu = [
			[
				[
					t(c, 'manageTagsBtn'),
					(c, payload) => c.pager.go('tag-manager', payload),
				],
			],
		];

		if (isAdmin) {
			this.menu = [
				...this.menu,
				[t(c, 'editConfigBtn'), (c, payload) => c.pager.go('config', payload)],
				[t(c, 'manageUsersBtn'), (c, payload) => c.pager.go('users', payload)],
			];
		}
	}
}
