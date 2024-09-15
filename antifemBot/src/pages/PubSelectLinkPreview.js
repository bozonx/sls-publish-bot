import { PubPageBase } from '../PubPageBase.js';
import { t, defineMenu } from '../helpers/helpers.js';
import { getLinksFromHtml } from '../helpers/converters.js';
import { PUB_KEYS, DEFAULT_BTN_ITEM_ID } from '../constants.js';

export class PubSelectLinkPreview extends PubPageBase {
	async renderMenu() {
		const c = this.router.c;

		this.text = t(c, 'selectLinkPreview');

		const links = getLinksFromHtml(this.state.pub[PUB_KEYS.textHtml]);

		return defineMenu([
			...links.map((link) => [
				{
					id: DEFAULT_BTN_ITEM_ID,
					label: link,
					payload: link,
				},
			]),
			[
				{
					id: 'linkPreviewOffBtn',
					label: t(c, 'linkPreviewOffBtn'),
				},
			],
			[
				{
					id: 'cancelBtn',
					label: t(c, 'cancelBtn'),
				},
			],
		]);
	}

	async onButtonPress(btnId, payload) {
		if (btnId === DEFAULT_BTN_ITEM_ID) {
			return this.go('pub-post-setup', {
				[PUB_KEYS.previewLink]: payload,
			});
		}

		switch (btnId) {
			case 'linkPreviewOffBtn':
				return this.go('pub-post-setup', {
					[PUB_KEYS.previewLink]: null,
				});
			case 'cancelBtn':
				return this.go('pub-post-setup');
			default:
				return false;
		}
	}
}
