import { PageBase } from '../PageRouter.js';
import { USER_KEYS } from '../constants.js';
import { t, defineMenu } from '../helpers.js';
import { makeStateFromMessage } from '../publishHelpres.js';

export class Home extends PageBase {
	async renderMenu() {
		const c = this.router.c;
		const isAdmin = this.me[USER_KEYS.isAdmin];
		// clear pub state
		this.state.pub = {};
		this.text = t(c, 'homeDescr');

		return defineMenu([
			[
				{
					id: 'sendTextInMdV1Btn',
					label: t(c, 'sendTextInMdV1Btn'),
				},
			],
			[
				{
					id: 'manageTagsBtn',
					label: t(c, 'manageTagsBtn'),
				},
			],
			[
				{
					id: 'manageScheduledBtn',
					label: t(c, 'manageScheduledBtn'),
				},
			],
			isAdmin && [
				{
					id: 'editConfigBtn',
					label: t(c, 'editConfigBtn'),
				},
			],
			isAdmin && [
				{
					id: 'manageUsersBtn',
					label: t(c, 'manageUsersBtn'),
				},
			],
		]);
	}

	async onButtonPress(btnId) {
		switch (btnId) {
			case 'sendTextInMdV1Btn':
				this.state.mdV1Mode = true;

				return this.router.go('pub-content');
			case 'manageTagsBtn':
				return this.router.go('tags-manager');
			case 'manageScheduledBtn':
				return this.router.go('scheduled-list');
			case 'editConfigBtn':
				return this.router.go('config-manager');
			case 'manageUsersBtn':
				return this.router.go('users-manager');
			default:
				return false;
		}
	}

	async onMessage() {
		const c = this.router.c;
		const pubState = makeStateFromMessage(c);

		if (!pubState) return this.reply(t(c, 'wrongTypeOfPost'));

		this.state.pub = pubState;

		return this.router.go('pub-content');
	}
}
