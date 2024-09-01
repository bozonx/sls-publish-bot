import { PubPageBase } from '../PubPageBase.js';
import { t, makeStatePreview, defineMenu } from '../helpers.js';
import { generatePostText, publishFinalPost } from '../publishHelpres.js';
import { PUB_KEYS } from '../constants.js';

export class PubConfirm extends PubPageBase {
	async mount() {
		const c = this.router.c;

		const shortPubState = {
			[PUB_KEYS.date]: this.state.pub[PUB_KEYS.date],
			[PUB_KEYS.hour]: this.state.pub[PUB_KEYS.hour],
			[PUB_KEYS.template]: this.state.pub[PUB_KEYS.template],
		};

		this.text = `${makeStatePreview(c, shortPubState)}\n\n${t(c, 'pubConfirmDescr')}`;
		this.menu = defineMenu([
			[
				{
					id: 'backBtn',
					label: t(c, 'backBtn'),
					cb: () => this.go('pub-post-setup'),
				},
				{
					id: 'toHomeBtn',
					label: t(c, 'toHomeBtn'),
					cb: () => this.go('home'),
				},
				{
					id: 'pubConfirmBtn',
					label: '🗓️ ' + t(c, 'pubConfirmBtn'),
					cb: this._finalPublication,
				},
			],
		]);

		return this._printPreview();
	}

	async _printPreview() {
		const c = this.router.c;
		const text = generatePostText(c, this.state.pub);

		await publishFinalPost(
			c,
			c.msg.chat.id,
			text,
			this.state.pub[PUB_KEYS.preview],
		);
	}

	_finalPublication = async () => {
		const c = this.router.c;

		return c.reply('final');
	};
}
