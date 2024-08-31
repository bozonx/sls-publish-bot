import { PageBase } from '../PageRouter.js';
import { CTX_KEYS, APP_CFG_KEYS } from '../constants.js';
import { t, makeStatePreview, defineMenu } from '../helpers.js';

export class PubAuthor extends PageBase {
	async mount() {
		const c = this.pager.c;
		const authors = c.ctx[CTX_KEYS.APP_CFG][APP_CFG_KEYS.AUTHORS];

		this.text = `${makeStatePreview(c, this.payload.state)}\n\n${t(c, 'selectAuthorDescr')}`;
		this.menu = defineMenu([
			// TODO: разбить по 2 шт на строку
			...authors.map((author) => [
				{
					id: author,
					label: author,
					cb: this.pager.go('pub-tags', { author }),
				},
			]),
			[
				{
					id: 'withoutAuthorBtn',
					label: t(c, 'withoutAuthorBtn'),
					cb: () => this.pager.go('pub-tags'),
				},
			],
			[
				{
					id: 'toHomeBtn',
					label: t(c, 'toHomeBtn'),
					cb: () => this.pager.go('home', null),
				},
			],
		]);
	}

	async onMessage() {
		const c = this.pager.c;

		if (!c.msg.text) return;

		await this.pager.go('pub-tags', { author: c.msg.text.trim() });
	}
}
