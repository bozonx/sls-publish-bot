import ShortUniqueId from 'short-unique-id';
import { PubPageBase } from '../PubPageBase.js';
import {
	t,
	makeStatePreview,
	defineMenu,
	saveToKv,
	loadFromKv,
} from '../helpers.js';
import { PUB_KEYS, CTX_KEYS, KV_KEYS, USER_KEYS } from '../constants.js';

export class PubConfirm extends PubPageBase {
	async renderMenu() {
		const c = this.router.c;
		// show preview
		await this.printFinalPost(this.me[USER_KEYS.id], this.state.pub);

		const shortPubState = {
			[PUB_KEYS.date]: this.state.pub[PUB_KEYS.date],
			[PUB_KEYS.time]: this.state.pub[PUB_KEYS.time],
			[PUB_KEYS.template]: this.state.pub[PUB_KEYS.template],
		};

		this.text = `${makeStatePreview(c, shortPubState)}\n\n${t(c, 'pubConfirmDescr')}`;

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
			case 'cancelBtn':
				return this.go('home');
			case 'pubConfirmBtn':
				return this._finalPublication();
			default:
				return false;
		}
	}

	_finalPublication = async () => {
		const c = this.router.c;
		const uid = new ShortUniqueId({ length: 10 });
		const item = { id: uid.rnd(), ...this.state.pub };
		const allScheduled = await loadFromKv(c, KV_KEYS.scheduled);
		const prepared = [...allScheduled, item];

		// const infoMsg =
		// 	t(c, 'infoMsgToAdminChannel') +
		// 	`\n\n${makeStatePreview(c, infoMsgPostParams)}`;
		// 		.replace(
		// 	/([:.\(\)])/g,
		// 	'\\$1',
		// );

		console.log('========== _finalPublication', item);

		await saveToKv(c, KV_KEYS.scheduled, prepared);
		// publication
		const { message_id } = await this.printFinalPost(
			c.ctx[CTX_KEYS.CHAT_OF_ADMINS_ID],
			item,
		);
		// info post
		const infoMsgPostParams = {
			[PUB_KEYS.date]: this.state.pub[PUB_KEYS.date],
			[PUB_KEYS.time]: this.state.pub[PUB_KEYS.time],
			[PUB_KEYS.publisher]: this.me.name,
		};

		await c.api.sendMessage(
			c.ctx[CTX_KEYS.CHAT_OF_ADMINS_ID],
			t(c, 'infoMsgToAdminChannel') +
			`\n\n${makeStatePreview(c, infoMsgPostParams)}`,
			{ reply_parameters: { message_id } },
		);

		return this.go('home');
	};
}
