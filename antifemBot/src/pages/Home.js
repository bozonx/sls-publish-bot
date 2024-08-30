import { PageBase } from '../PageRouter.js';
import { t, isAdminUser, makeContentState } from '../helpers.js';

export class Home extends PageBase {
	async mount() {
		const c = this.pager.c;
		const isAdmin = isAdminUser(c, c.msg.chat.id);

		this.text = t(c, 'homeDescr');

		this.menu = [
			[[t(c, 'manageTagsBtn'), () => this.pager.go('tags-manager')]],
		];

		if (isAdmin) {
			this.menu = [
				...this.menu,
				[[t(c, 'editConfigBtn'), () => this.pager.go('config-manager')]],
				[[t(c, 'manageUsersBtn'), () => this.pager.go('users-manager')]],
			];
		}
	}

	async message() {
		const c = this.pager.c;

		const state = makeContentState(c);

		if (!state) return c.reply('ERROR: Wrong type of post');

		return this.pager.go('pub-content', state);
	}
}
