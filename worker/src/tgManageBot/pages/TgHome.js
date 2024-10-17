import { PageBase } from '../PageRouter.js';
import { t, defineMenu, makeBlogAndSmName } from '../helpers/helpers.js';
import { makeStateFromMessage } from '../helpers/publishHelpres.js';
import { EDIT_ITEM_NAME, MAIN_HOME } from '../constants.js';
// import { handleScheduled } from '../indexShedullerPublisher.js';

export class TgHome extends PageBase {
	async renderMenu() {
		const c = this.router.c;
		// clear pub state
		delete this.state.pub;

		this.text =
			makeBlogAndSmName(this.state.sm.name, this.state.sm.blog.name) +
			`\n\n` +
			t(c, 'homeDescr');

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
			// [
			// 	{
			// 		id: 'publishedBtn',
			// 		label: t(c, 'publishedBtn'),
			// 	},
			// 	{
			// 		id: 'conservedBtn',
			// 		label: t(c, 'conservedBtn'),
			// 	},
			// ],
			// [
			// 	{
			// 		id: 'manageTagsBtn',
			// 		label: t(c, 'manageTagsBtn'),
			// 	},
			// ],

			[
				{
					id: 'backBtn',
					label: t(c, 'backToSelectBlog'),
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

				return this.go('pub-content');
			case 'manageScheduledBtn':
				return this.go('scheduled-list');
			case 'backBtn':
				return this.go(MAIN_HOME);

			// case 'manageTagsBtn':
			// 	return this.go('tags-manager');
			// case 'publishedBtn':
			// 	return this.go('published-list');
			// case 'conservedBtn':
			// 	return this.go('conserved-list');
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

		return this.go('pub-content');
	}
}
