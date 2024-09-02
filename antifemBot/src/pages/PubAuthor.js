import { PubPageBase } from '../PubPageBase.js';
import { t, makeStatePreview, defineMenu } from '../helpers.js';
import { APP_CFG_KEYS, PUB_KEYS } from '../constants.js';

export class PubAuthor extends PubPageBase {
	async renderMenu() {
		const c = this.router.c;
		const authors = this.config[APP_CFG_KEYS.authors];

		this.text = `${makeStatePreview(c, this.state.pub)}\n\n${t(c, 'selectAuthorDescr')}`;

		return defineMenu([
			// TODO: разбить по 2 шт на строку
			...authors.map((author) => [
				{
					id: author,
					label: author,
					payload: author,
					cb: (payload) => this.go('pub-tags', { [PUB_KEYS.author]: payload }),
				},
			]),
			[
				{
					id: 'withoutAuthorBtn',
					label: t(c, 'withoutAuthorBtn'),
					cb: () => this.go('pub-tags', { [PUB_KEYS.author]: null }),
				},
			],
			[
				{
					id: 'backBtn',
					label: t(c, 'backBtn'),
					cb: () => this.go('pub-content'),
				},
				{
					id: 'toHomeBtn',
					label: t(c, 'toHomeBtn'),
					cb: () => this.go('home'),
				},
				{
					id: 'nextBtn',
					label: t(c, 'nextBtn'),
					cb: () => this.go('pub-tags'),
				},
			],
		]);
	}

	async onButtonPress(btnId, payload) {
		switch (btnId) {
			case 'backBtn':
				return this.router.go('');
			case 'toHomeBtn':
				return this.router.go('home');
			case 'nextBtn':
				return this.router.go('');
			default:
				return false;
		}
	}

	async onMessage() {
		const c = this.router.c;

		if (!c.msg.text) return;

		await this.go('pub-tags', { [PUB_KEYS.author]: c.msg.text.trim() });
	}
}
