import { t } from './helpers.js';
import { PageBase } from './Pager.js';
import { makePayloadPreview } from './helpers.js';

export class PagePubHour extends PageBase {
	payload;

	async init() {
		// only first time init on app start
	}

	async mount(c, payload) {
		this.payload = payload;
		this.text = `${makePayloadPreview(c, payload)}\n\n${t(c, 'selectHour')}`;

		const hourHandler = (hour) => {
			return async (c) => {
				await c.pager.go('pub-confirm', {
					...payload,
					hour,
				});
			};
		};

		this.menu = [
			[
				['7', hourHandler(7)],
				['8', hourHandler(8)],
				['9', hourHandler(9)],
				['10', hourHandler(10)],
				['11', hourHandler(11)],
			],
			[
				['12', hourHandler(12)],
				['13', hourHandler(13)],
				['14', hourHandler(14)],
				['15', hourHandler(15)],
				['16', hourHandler(16)],
			],
			[
				['17', hourHandler(17)],
				['18', hourHandler(18)],
				['19', hourHandler(19)],
				['20', hourHandler(20)],
				['21', hourHandler(21)],
			],
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
						c.pager.go('pub-date', payload);
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
		// console.log(1111, c);
		// await c.pager.go('pub-confirm', this.payload);
		// await c.reply(t(c, 'textAccepted'))
	}
}
