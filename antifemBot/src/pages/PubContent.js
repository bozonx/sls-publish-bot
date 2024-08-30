import { t } from './helpers.js';
import { PageBase } from '../PageRouter.js';
import { makeContentState } from './helpers.js';

export class PubContent extends PageBase {
	async mount() {
		const c = this.pager.c;

		this.text = t(c, 'uploadContentDescr');

		this.menu = [
			// TODO: не показывать эту кнопку если текст слишком большой или слишком много медиа
			// TODO: либо вобще ничего нет
			[[t(c, 'next'), () => this.pager.go('pub-author')]],
			[[t(c, 'toHomeBtn'), () => this.pager.go('home', null)]],
		];
	}

	async message() {
		const c = this.pager.c;

		const state = makeContentState(c);

		if (!state) return c.reply('ERROR: Wrong type of post');

		return this.pager.go('pub-author', state);
	}
}
