import { PageBase } from '../PageRouter.js';
import { t, isAdminUser, makeContentState, defineMenu } from '../helpers.js';

export class Home extends PageBase {
	async mount() {
		const c = this.pager.c;
		const isAdmin = isAdminUser(c, c.msg.chat.id);
		// clear state
		await this.pager.setState({});

		this.text = t(c, 'homeDescr');
		this.menu = defineMenu([
			[
				{
					id: 'manageTagsBtn',
					label: t(c, 'manageTagsBtn'),
					cb: () => this.pager.go('tags-manager'),
				},
			],
			isAdmin && [
				{
					id: 'editConfigBtn',
					label: t(c, 'editConfigBtn'),
					cb: () => this.pager.go('config-manager'),
				},
			],
			isAdmin && [
				{
					id: 'manageUsersBtn',
					label: t(c, 'manageUsersBtn'),
					cb: () => this.pager.go('users-manager'),
				},
			],
		]);
	}

	async onMessage() {
		const c = this.pager.c;

		const pubState = makeContentState(c);

		if (!pubState) return c.reply('ERROR: Wrong type of post');

		return this.pager.go('pub-content', { pub: state });
	}
}
