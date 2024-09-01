import { PubPageBase } from '../PubPageBase.js';
import { t, makeContentState, defineMenu } from '../helpers.js';
import {
	convertTgEntitiesToTgMdV2,
	publishFinalPost,
} from '../publishHelpres.js';

export class PubContent extends PubPageBase {
	async mount() {
		const c = this.router.c;

		this.text = t(c, 'uploadContentDescr');
		this.menu = defineMenu([
			[
				{
					id: 'toHomeBtn',
					label: t(c, 'toHomeBtn'),
					cb: () => this.go('home'),
				},
				// TODO: не показывать эту кнопку если текст слишком большой или слишком много медиа
				// TODO: либо вобще ничего нет
				{
					id: 'nextBtn',
					label: t(c, 'nextBtn'),
					cb: () => this.go('pub-author'),
				},
			],
		]);

		await this._printPreview();
	}

	async onMessage() {
		const c = this.router.c;

		const pubState = makeContentState(c);

		if (!pubState) return c.reply('ERROR: Wrong type of post');

		return this.go('pub-author', pubState);
	}

	async _printPreview() {
		const c = this.router.c;
		const text = convertTgEntitiesToTgMdV2(
			this.state.pub.text,
			this.state.pub.entities,
		);

		await publishFinalPost(
			c,
			c.msg.chat.id,
			text,
			Boolean(c.msg.link_preview_options?.url),
		);
	}
}
