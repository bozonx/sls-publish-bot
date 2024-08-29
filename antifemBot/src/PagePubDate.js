import { t } from './helpers.js';
import { PageBase } from './Pager.js';

export class PagePubDate extends PageBase {
	async init() {
		// only first time init on app start
	}

	async mount(c, payload) {
		this.text = t(c, 'selectDate');

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
						c.pager.go('pub-tags');
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

		await c.pager.go('pub-hour');

		// await c.reply(t(c, 'textAccepted'))
	}
}
