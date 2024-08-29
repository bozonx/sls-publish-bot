import { t } from './helpers.js';
import { PageBase } from './Pager.js';
import { makePayloadPreview } from './helpers.js';

export class PagePubConfirm extends PageBase {
	payload;

	async init() {
		// only first time init on app start
	}

	async mount(c, payload) {
		this.payload = payload;
		this.text = `${makePayloadPreview(c, payload)}\n\n${t(c, 'pubConfirm')}`;

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
						c.pager.go('pub-hour', payload);
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
	}
}
