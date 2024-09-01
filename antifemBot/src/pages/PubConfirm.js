import ShortUniqueId from 'short-unique-id';
import { PubPageBase } from '../PubPageBase.js';
import { t, makeStatePreview, defineMenu } from '../helpers.js';
import { generatePostText, publishFinalPost } from '../publishHelpres.js';
import { PUB_KEYS, CTX_KEYS } from '../constants.js';

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

		await publishFinalPost(
			c,
			c.msg.chat.id,
			generatePostText(c, this.state.pub),
			this.state.pub[PUB_KEYS.preview],
		);
	}

	_finalPublication = async () => {
		const c = this.router.c;
		const uid = new ShortUniqueId();
		const prepared = { id: uid.rnd(), ...this.state.pub };
		const infoMsgPostParams = {
			[PUB_KEYS.date]: this.state.pub[PUB_KEYS.date],
			[PUB_KEYS.hour]: this.state.pub[PUB_KEYS.hour],
		};
		const infoMsg =
			t(c, 'infoMsgToAdminChannel') +
			`:\n\n${makeStatePreview(c, infoMsgPostParams)}`.replace(
				/\[:\.]/g,
				'\\$1',
			);

		await saveToKv(c, KV_KEYS.scheduled, prepared);
		// publication
		const { message_id } = await publishFinalPost(
			c,
			CTX_KEYS.CHAT_OF_ADMINS_ID,
			generatePostText(c, prepared),
			this.state.pub[PUB_KEYS.preview],
		);
		// info post
		await publishFinalPost(
			c,
			CTX_KEYS.CHAT_OF_ADMINS_ID,
			infoMsg,
			this.state.pub[PUB_KEYS.preview],
			message_id,
		);

		console.log('========== _finalPublication', prepared);

		return this.go('home');
	};
}
