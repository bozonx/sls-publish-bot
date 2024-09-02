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
					id: 'ITEM',
					label: author,
					payload: author,
				},
			]),
			[
				{
					id: 'withoutAuthorBtn',
					label: t(c, 'withoutAuthorBtn'),
				},
			],
			[
				{
					id: 'backBtn',
					label: t(c, 'backBtn'),
				},
				{
					id: 'cancelBtn',
					label: t(c, 'cancelBtn'),
				},
				{
					id: 'nextBtn',
					label: t(c, 'nextBtn'),
				},
			],
		]);
	}

	async onButtonPress(btnId, payload) {
		if (btnId === 'ITEM') {
			return this.go('pub-tags', { [PUB_KEYS.author]: payload });
		}

		switch (btnId) {
			case 'withoutAuthorBtn':
				return this.go('pub-tags', { [PUB_KEYS.author]: null });
			case 'backBtn':
				return this.go('pub-content');
			case 'cancelBtn':
				return this.go('home');
			case 'nextBtn':
				return this.go('pub-tags');
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
