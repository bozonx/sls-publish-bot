import { PubPageBase } from '../PubPageBase.js';
import { t, makeContentState, defineMenu } from '../helpers.js';

export class PubContent extends PubPageBase {
	async mount() {
		const c = this.router.c;

		this.text = t(c, 'uploadContentDescr');
		this.menu = defineMenu([
			[
				{
					id: 'toHomeBtn',
					label: t(c, 'toHomeBtn'),
					cb: () => this.router.go('home'),
				},
				// TODO: не показывать эту кнопку если текст слишком большой или слишком много медиа
				// TODO: либо вобще ничего нет
				{
					id: 'nextBtn',
					label: t(c, 'nextBtn'),
					cb: () => this.router.go('pub-author'),
				},
			],
		]);
	}

	async onMessage() {
		const c = this.router.c;

		const pubState = makeContentState(c);

		if (!pubState) return c.reply('ERROR: Wrong type of post');

		return this.router.go('pub-author', pubState);
	}
}
