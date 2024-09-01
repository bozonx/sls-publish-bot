import { PubPageBase } from '../PubPageBase.js';
import { t, makeStatePreview, defineMenu } from '../helpers.js';
import { generatePostText, publishFinalPost } from '../publishHelpres.js';
import { STATE_KEYS } from '../constants.js';

export class PubConfirm extends PubPageBase {
	async mount() {
		const c = this.router.c;

		const shortState = {
			[STATE_KEYS.date]: this.state.pub[STATE_KEYS.date],
			[STATE_KEYS.hour]: this.state.pub[STATE_KEYS.hour],
			[STATE_KEYS.template]: this.state.pub[STATE_KEYS.template],
		};

		this.text = `${makeStatePreview(c, shortState)}\n\n${t(c, 'pubConfirmDescr')}`;
		this.menu = defineMenu([
			[
				{
					id: 'toHomeBtn',
					label: t(c, 'toHomeBtn'),
					cb: () => this.go('home'),
				},
				{
					id: 'backBtn',
					label: t(c, 'backBtn'),
					cb: () => this.go('pub-post-setup'),
				},
				{
					id: 'pubConfirmBtn',
					label: '🗓️ ' + t(c, 'pubConfirmBtn'),
					cb: this._finalPublication,
				},
			],
		]);

		await this._printPreview();
	}

	async _printPreview() {
		const c = this.router.c;
		const text = generatePostText(c, this.state.pub);

		await publishFinalPost(
			c,
			c.msg.chat.id,
			text,
			this.state.pub[STATE_KEYS.preview],
		);
	}

	_finalPublication = async () => {
		const c = this.router.c;

		return c.reply('final');
	};
}
