import { t } from './helpers.js';
import { PageBase } from './Pager.js';
import { makePayloadPreview } from './helpers.js';

export class PagePubDate extends PageBase {
	payload;

	async init() {
		// only first time init on app start
	}

	async mount(c, payload) {
		this.payload = payload;
		this.text = `${makePayloadPreview(c, payload)}\n\n${t(c, 'selectDate')}`;

		this.menu = [
			// row
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
						c.pager.go('pub-tags', payload);
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

		await c.pager.go('pub-hour', this.payload);

		// await c.reply(t(c, 'textAccepted'))
	}
}
