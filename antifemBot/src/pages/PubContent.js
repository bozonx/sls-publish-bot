import { t } from './helpers.js';
import { PageBase } from '../PageRouter.js';

export class PubContent extends PageBase {
	async mount() {
		const c = this.pager.c;
		// const { state } = this.payload;
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

	async message() {
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
