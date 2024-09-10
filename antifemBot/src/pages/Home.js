import { PageBase } from '../PageRouter.js';
import { t, defineMenu, isUserAdmin } from '../helpers/helpers.js';
import { makeStateFromMessage } from '../helpers/publishHelpres.js';
import { EDIT_ITEM_NAME } from '../constants.js';
// import { handleScheduled } from '../indexShedullerPublisher.js';

export class Home extends PageBase {
	async renderMenu() {
		const c = this.router.c;
		const isAdmin = isUserAdmin(this.me);
		// clear pub state
		delete this.state.pub;

		this.text = t(c, 'homeDescr');

		delete this.state[EDIT_ITEM_NAME];

		return defineMenu([
			[
				{
					id: 'sendTextInMdV1Btn',
					label: t(c, 'sendTextInMdV1Btn'),
				},
			],
			[
				{
					id: 'manageScheduledBtn',
					label: t(c, 'manageScheduledBtn'),
				},
			],
			[
				{
					id: 'publishedBtn',
					label: t(c, 'publishedBtn'),
				},
				{
					id: 'conservedBtn',
					label: t(c, 'conservedBtn'),
				},
			],
			[
				{
					id: 'manageTagsBtn',
					label: t(c, 'manageTagsBtn'),
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
			// [
			// 	{
			// 		id: 'test',
			// 		label: 'test',
			// 	},
			// ],
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
			case 'publishedBtn':
				return this.router.go('published-list');
			case 'conservedBtn':
				return this.router.go('conserved-list');
			case 'editConfigBtn':
				return this.router.go('config-manager');
			case 'manageUsersBtn':
				return this.router.go('users-manager');
			// case 'test':
			// 	let c = this.router.c;
			// 	return await handleScheduled(
			// 		c.api.token,
			// 		c.ctx.DESTINATION_CHANNEL_ID,
			// 		c.ctx.KV,
			// 	);
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
