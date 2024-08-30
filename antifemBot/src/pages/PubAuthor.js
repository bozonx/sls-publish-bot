import { t } from './helpers.js';
import { PageBase } from '../PageRouter.js';
import { CTX_KEYS, APP_CFG_KEYS } from './constants.js';
import { makePayloadPreview } from './helpers.js';

export class PagePubAuthor extends PageBase {
	async mount() {
		const c = this.pager.c;
		const authors = c.ctx[CTX_KEYS.APP_CFG][APP_CFG_KEYS.AUTHORS];

		this.text = `${makePayloadPreview(c, payload)}\n\n${t(c, 'selectAuthor')}`;
		this.menu = [];

		if (authors?.length) {
			// TODO: разбить по 2 шт на строку
			for (const author of authors) {
				this.menu.push([[author, () => this.pager.go('pub-tags', { author })]]);
			}
		}

		this.menu = [
			...this.menu,
			[[t(c, 'noAuthor'), () => this.pager.go('pub-tags')]],
			[[t(c, 'toHome'), () => this.pager.go('home', null)]],
		];
	}

	async message(c) {
		const c = this.pager.c;

		if (!c.msg.text) return;

		await this.pager.go('pub-tags', { author: c.msg.text.trim() });
	}
}
