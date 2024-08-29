import { t } from './helpers.js';
import { PageBase } from './Pager.js';

export class PagePubConfirm extends PageBase {
	async init() {
		// only first time init on app start
	}

	async mount(c, payload) {
		this.text = t(c, 'pubConfirm');

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
						c.pager.go('pub-time');
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
