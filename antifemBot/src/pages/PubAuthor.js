import { t } from './helpers.js';
import { PageBase } from '../PageRouter.js';
import { CTX_KEYS, APP_CFG_KEYS } from './constants.js';
import { makePayloadPreview } from './helpers.js';

export class PagePubAuthor extends PageBase {
	async mount(state) {
		const c = this.pager.c;
		const authors = c.ctx[CTX_KEYS.APP_CFG][APP_CFG_KEYS.AUTHORS];

		this.state = state;
		this.text = `${makePayloadPreview(c, payload)}\n\n${t(c, 'selectAuthor')}`;
		this.menu = [];

		if (authors?.length) {
			// TODO: разбить по 2 шт на строку
			for (const author of authors) {
				this.menu.push([
					[author, (p) => c.pager.go(p, 'pub-tags', { author })],
				]);
			}
		}

		this.menu = [
			...this.menu,
			[[t(c, 'noAuthor'), (p) => c.pager.go(p, 'pub-tags')]],
			[[t(c, 'toHome'), (p) => c.pager.go(p, 'home')]],
		];
	}

	async message(c) {
		await c.pager.go({ state: this.state }, 'pub-tags', {
			author: c.msg.text,
		});
	}
}
