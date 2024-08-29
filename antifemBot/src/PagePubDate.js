import { t } from './helpers.js';
import { PageBase } from './Pager.js';
import { makePayloadPreview, nowPlusDay } from './helpers.js';

export class PagePubDate extends PageBase {
	payload;

	async init() {
		// only first time init on app start
	}

	async mount(c, payload) {
		this.payload = payload;
		this.text = `${makePayloadPreview(c, payload)}\n\n${t(c, 'selectDate')}`;

		const dayHandler = (plusDay) => {
			return async (c) => {
				await c.pager.go('pub-hour', {
					...payload,
					date: nowPlusDay(plusDay),
				});
			};
		};

		this.menu = [
			[
				[t(c, 'today'), dayHandler(0)],
				[t(c, 'tomorrow'), dayHandler(1)],
				[t(c, 'afterTomorrow'), dayHandler(2)],
			],
			// TODO: add days of week
			// row
			[
				// button
				[t(c, 'toHome'), dayHandler(0)],
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
		// console.log(1111, c);
		// await c.pager.go('pub-hour', this.payload);
		// await c.reply(t(c, 'textAccepted'))
	}
}
