import { t } from './helpers.js';
import { PageBase } from './Pager.js';

export class PagePubText extends PageBase {
	async init() {
		// only first time init on app start
	}

	async mount(c, payload) {
		this.text = t(c, 'giveMeText');

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
			],
		];
	}

	async unmount(c) {
		//
	}

	async message(c) {
		let payload;

		console.log(2222, c.msg);

		// TODO: captions parse to md with entities
		// TODO: media group

		if (c.msg.video) {
			payload = {
				text: c.msg.caption,
				video: c.msg.video,
			};
		} else if (c.msg.photo) {
			payload = {
				text: c.msg.caption,
				photo: c.msg.photo,
			};
		} else if (c.msg.text) {
			payload = {
				text: c.msg.text,
			};
		} else {
			return c.reply('ERROR: Wrong type of post');
		}

		await c.pager.go('pub-author', payload);
	}
}
