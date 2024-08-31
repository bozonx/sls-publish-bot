import { PageBase } from '../PageRouter.js';
import { t, makeContentState, defineMenu } from '../helpers.js';

export class PubContent extends PageBase {
	async mount() {
		const c = this.pager.c;

		this.text = t(c, 'uploadContentDescr');

		this.menu = defineMenu([
			[
				{
					id: 'toHomeBtn',
					label: t(c, 'toHomeBtn'),
					cb: () => this.pager.go('home', null),
				},
				// TODO: не показывать эту кнопку если текст слишком большой или слишком много медиа
				// TODO: либо вобще ничего нет
				{
					id: 'nextBtn',
					label: t(c, 'nextBtn'),
					cb: () => this.pager.go('pub-author'),
				},
			],
		]);
	}

	async message() {
		const c = this.pager.c;

		const state = makeContentState(c);

		if (!state) return c.reply('ERROR: Wrong type of post');

		return this.pager.go('pub-author', state);
	}
}
