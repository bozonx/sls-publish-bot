import { PubPageBase } from '../PubPageBase.js';
import { t, makeStatePreview, defineMenu } from '../helpers/helpers.js';
import {
	createPost,
	printPubToAdminChannel,
} from '../helpers/publishHelpres.js';
import { PUB_KEYS, HOME_PAGE, USER_KEYS } from '../constants.js';

export class PubConfirm extends PubPageBase {
	async renderMenu() {
		const c = this.router.c;
		// show preview
		await this.printFinalPost(this.me[USER_KEYS.tgChatId], this.state.pub);

		const shortPubState = {
			[PUB_KEYS.date]: this.state.pub[PUB_KEYS.date],
			[PUB_KEYS.time]: this.state.pub[PUB_KEYS.time],
			[PUB_KEYS.template]: this.state.pub[PUB_KEYS.template],
		};

		this.text = `${await makeStatePreview(c, shortPubState)}\n\n${t(c, 'pubConfirmDescr')}`;

		return defineMenu([
			[
				{
					id: 'backBtn',
					label: t(c, 'backBtn'),
				},
				{
					id: 'cancelBtn',
					label: t(c, 'cancelBtn'),
				},
			],
			[
				{
					id: 'pubConfirmBtn',
					label: '🗓️ ' + t(c, 'pubConfirmBtn'),
				},
			],
		]);
	}

	async onButtonPress(btnId) {
		const c = this.router.c;

		switch (btnId) {
			case 'backBtn':
				return this.go('pub-time');
			case 'cancelBtn':
				return this.go(HOME_PAGE);
			case 'pubConfirmBtn':
				const item = await createPost(c, this.state.pub);

				await printPubToAdminChannel(c, item);
				await this.reply(t(c, 'wasSuccessfullyScheduled'));

				return this.go(HOME_PAGE);
			default:
				return false;
		}
	}
}
