import { t } from './helpers.js';
import { PageBase } from './Pager.js';
import { makePayloadPreview } from './helpers.js';

export class PagePubTags extends PageBase {
	payload;

	async init() {
		// only first time init on app start
	}

	async mount(c, payload) {
		console.log(1111, payload);

		this.payload = payload;
		this.text = `${makePayloadPreview(c, payload)}\n\n${t(c, 'selectTags')}`;

		this.menu = [
			// row
			[
				[
					t(c, 'noTags'),
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
						c.pager.go('pub-author', payload);
					},
				],
			],
		];
	}

	async unmount(c) {
		//
	}

	async message(c) {
		//
		console.log(1111, c);

		await c.pager.go('pub-date', this.payload);

		// await c.reply(t(c, 'textAccepted'))
	}
}
