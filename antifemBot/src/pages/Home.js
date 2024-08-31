import _ from 'lodash';
import { PageBase } from '../routerouter.js';
import { t, isAdminUser, makeContentState, defineMenu } from '../helpers.js';

export class Home extends PageBase {
	async mount() {
		const c = this.router.c;
		const isAdmin = isAdminUser(c, c.msg.chat.id);
		// clear state
		if (!_.isEmpty(this.state)) await this.router.resetState();

		this.text = t(c, 'homeDescr');
		this.menu = defineMenu([
			[
				{
					id: 'manageTagsBtn',
					label: t(c, 'manageTagsBtn'),
					cb: () => this.router.go('tags-manager'),
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

		return this.router.go('pub-content', { pub: pubState });
	}
}
