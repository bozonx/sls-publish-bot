import { t } from './helpers.js';
import { PageBase } from './Pager.js';
import { APP_CONFIG_KEYS } from './constants.js';
import { makePayloadPreview } from './helpers.js';

export class PagePubAuthor extends PageBase {
	payload;

	async init() {
		// only first time init on app start
	}

	async mount(c, payload) {
		this.payload = payload;
		this.text = `${makePayloadPreview(c, payload)}\n\n${t(c, 'selectAuthor')}`;

		const authors = c.config.appCfg[APP_CONFIG_KEYS.AUTHORS];

		if (authors?.length) {
			// TODO: разбить по 2 шт на строку
			for (const author of authors) {
				this.menu.push([
					[
						author,
						() => {
							c.pager.go('pub-tags', {
								...payload,
								author,
							});
						},
					],
				]);
			}
		}

		this.menu = [
			...this.menu,
			// row
			[
				[
					t(c, 'noAuthor'),
					(c) => {
						// c.pager.go('home');
					},
				],
			],
			[
				// button
				[
					t(c, 'toHome'),
					(c) => {
						c.pager.go('home');
					},
				],
				[
					t(c, 'back'),
					(c) => {
						c.pager.go('pub-text', payload);
					},
				],
			],
		];
	}

	async unmount(c) {
		//
	}

	async message(c) {
		await c.pager.go('pub-tags', {
			...this.payload,
			author: c.msg.text,
		});
	}
}
