import { PubPageBase } from '../PubPageBase.js';
import { t, defineMenu, getLinkIds } from '../helpers/helpers.js';
import { PUB_KEYS, DEFAULT_BTN_ITEM_ID } from '../constants.js';

export class PubSelectLinkPreview extends PubPageBase {
	async renderMenu() {
		const c = this.router.c;

		this.text = t(c, 'selectLinkPreview');

		const linkIds = getLinkIds(this.state.pub[PUB_KEYS.entities]);

		return defineMenu([
			...linkIds.map((index) => [
				{
					id: DEFAULT_BTN_ITEM_ID,
					label:
						this.state.pub[PUB_KEYS.entities][index]?.url || '!WRONG ITEM!',
					payload: index,
				},
			]),
			[
				{
					id: 'cancelBtn',
					label: t(c, 'cancelBtn'),
				},
			],
		]);
	}

	async onButtonPress(btnId, payload) {
		const c = this.router.c;

		if (btnId === DEFAULT_BTN_ITEM_ID) {
			const item = this.state.pub[PUB_KEYS.entities][Number(payload)];

			if (!item) return c.reply(`ERROR: Can't find the item`);

			// this.state.pub[PUB_KEYS.previewLink] = item.url;

			return this.go('pub-post-setup', {
				[PUB_KEYS.previewLink]: item.url,
			});
		}

		switch (btnId) {
			case 'cancelBtn':
				return this.go('pub-post-setup');
			default:
				return false;
		}
	}
}
