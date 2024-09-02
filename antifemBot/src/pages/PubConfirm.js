import ShortUniqueId from 'short-unique-id';
import { PubPageBase } from '../PubPageBase.js';
import {
	t,
	makeStatePreview,
	defineMenu,
	saveToKv,
	loadFromKv,
} from '../helpers.js';
import {
	generatePostText,
	publishFinalPost,
	printFinalPost,
} from '../publishHelpres.js';
import { PUB_KEYS, CTX_KEYS, KV_KEYS } from '../constants.js';

export class PubConfirm extends PubPageBase {
	async renderMenu() {
		const c = this.router.c;

		const shortPubState = {
			[PUB_KEYS.date]: this.state.pub[PUB_KEYS.date],
			[PUB_KEYS.hour]: this.state.pub[PUB_KEYS.hour],
			[PUB_KEYS.template]: this.state.pub[PUB_KEYS.template],
		};

		await this._printPreview();

		this.text = `${makeStatePreview(c, shortPubState)}\n\n${t(c, 'pubConfirmDescr')}`;

		return defineMenu([
			[
				{
					id: 'backBtn',
					label: t(c, 'backBtn'),
				},
				{
					id: 'toHomeBtn',
					label: t(c, 'toHomeBtn'),
				},
				{
					id: 'pubConfirmBtn',
					label: '🗓️ ' + t(c, 'pubConfirmBtn'),
				},
			],
		]);
	}

	async onButtonPress(btnId, payload) {
		switch (btnId) {
			case 'backBtn':
				return this.go('pub-post-setup');
			case 'toHomeBtn':
				return this.go('home');
			case 'pubConfirmBtn':
				return this._finalPublication();
			default:
				return false;
		}
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
		const uid = new ShortUniqueId({ length: 10 });
		const item = { id: uid.rnd(), ...this.state.pub };
		const allScheduled = await loadFromKv(c, KV_KEYS.scheduled);
		const prepared = [...allScheduled, item];
		const infoMsgPostParams = {
			[PUB_KEYS.date]: this.state.pub[PUB_KEYS.date],
			[PUB_KEYS.hour]: this.state.pub[PUB_KEYS.hour],
			[PUB_KEYS.publisher]: this.me.name,
		};
		const infoMsg =
			t(c, 'infoMsgToAdminChannel') +
			`\n\n${makeStatePreview(c, infoMsgPostParams)}`.replace(
				/([:.\(\)])/g,
				'\\$1',
			);

		console.log('========== _finalPublication', item);

		await saveToKv(c, KV_KEYS.scheduled, prepared);
		// publication
		const { message_id } = await publishFinalPost(
			c,
			c.ctx[CTX_KEYS.CHAT_OF_ADMINS_ID],
			generatePostText(c, item),
			this.state.pub[PUB_KEYS.preview],
		);
		// info post
		await publishFinalPost(
			c,
			c.ctx[CTX_KEYS.CHAT_OF_ADMINS_ID],
			infoMsg,
			this.state.pub[PUB_KEYS.preview],
			message_id,
		);

		return this.go('home');
	};
}
