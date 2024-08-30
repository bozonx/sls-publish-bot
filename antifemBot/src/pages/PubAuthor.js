import { PageBase } from '../PageRouter.js';
import { CTX_KEYS, APP_CFG_KEYS } from '../constants.js';
import { t, makeStatePreview } from '../helpers.js';

export class PubAuthor extends PageBase {
	async mount() {
		const c = this.pager.c;
		const authors = c.ctx[CTX_KEYS.APP_CFG][APP_CFG_KEYS.AUTHORS];

		this.text = `${makeStatePreview(c, this.payload.state)}\n\n${t(c, 'selectAuthorDescr')}`;
		this.menu = [];

		if (authors?.length) {
			// TODO: разбить по 2 шт на строку
			for (const author of authors) {
				this.menu.push([[author, () => this.pager.go('pub-tags', { author })]]);
			}
		}

		this.menu = [
			...this.menu,
			[[t(c, 'withoutAuthorBtn'), () => this.pager.go('pub-tags')]],
			[[t(c, 'toHomeBtn'), () => this.pager.go('home', null)]],
		];
	}

	async message() {
		const c = this.pager.c;

		if (!c.msg.text) return;

		await this.pager.go('pub-tags', { author: c.msg.text.trim() });
	}
}
