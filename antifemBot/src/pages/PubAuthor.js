import { PubPageBase } from '../PubPageBase.js';
import { CTX_KEYS, APP_CFG_KEYS, STATE_KEYS } from '../constants.js';
import { t, makeStatePreview, defineMenu } from '../helpers.js';

export class PubAuthor extends PubPageBase {
	async mount() {
		const c = this.router.c;
		const authors = c.ctx[CTX_KEYS.CONFIG][APP_CFG_KEYS.AUTHORS];

		this.text = `${makeStatePreview(c, this.state)}\n\n${t(c, 'selectAuthorDescr')}`;
		this.menu = defineMenu([
			// TODO: разбить по 2 шт на строку
			// TODO: использовать payload
			...authors.map((author) => [
				{
					id: author,
					label: author,
					cb: this.go('pub-tags', { [STATE_KEYS.author]: author }),
				},
			]),
			[
				{
					id: 'withoutAuthorBtn',
					label: t(c, 'withoutAuthorBtn'),
					cb: () => this.go('pub-tags'),
				},
			],
			[
				{
					id: 'toHomeBtn',
					label: t(c, 'toHomeBtn'),
					cb: () => this.go('home'),
				},
			],
		]);
	}

	async onMessage() {
		const c = this.router.c;

		if (!c.msg.text) return;

		await this.go('pub-tags', { [STATE_KEYS.author]: c.msg.text.trim() });
	}
}
