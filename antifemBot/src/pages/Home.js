import { PageBase } from '../PageRouter.js';
import { t, isAdminUser, makeContentState, defineMenu } from '../helpers.js';

export class Home extends PageBase {
	async mount() {
		const c = this.router.c;
		const isAdmin = isAdminUser(c, c.msg.chat.id);
		// clear pub state
		this.state.pub = {};

		this.text = t(c, 'homeDescr');
		this.menu = defineMenu([
			[
				{
					id: 'manageTagsBtn',
					label: t(c, 'manageTagsBtn'),
					cb: () => this.router.go('tags-manager'),
				},
			],
			[
				{
					id: 'manageScheduledBtn',
					label: t(c, 'manageScheduledBtn'),
					cb: () => this.router.go('scheduled-list'),
				},
			],
			isAdmin && [
				{
					id: 'editConfigBtn',
					label: t(c, 'editConfigBtn'),
					cb: () => this.router.go('config-manager'),
				},
			],
			isAdmin && [
				{
					id: 'manageUsersBtn',
					label: t(c, 'manageUsersBtn'),
					cb: () => this.router.go('users-manager'),
				},
			],
		]);
	}

	async onMessage() {
		const c = this.router.c;
		const pubState = makeContentState(c);

		if (!pubState) return c.reply('ERROR: Wrong type of post');

		this.state.pub = pubState;

		return this.router.go('pub-content');
	}
}
