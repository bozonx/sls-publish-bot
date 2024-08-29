import { t } from './helpers.js';
import { PageBase } from './Pager.js';

export class PagePubTags extends PageBase {
	async init() {
		// only first time init on app start
	}

	async mount(c, payload) {
		this.text = t(c, 'selectTags');

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
						c.pager.go('pub-author');
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

		await c.pager.go('pub-date');

		// await c.reply(t(c, 'textAccepted'))
	}
}
