import _ from 'lodash';
import { PageBase } from '../PageRouter.js';
import { t, loadFromKv, defineMenu } from '../helpers.js';
import { KV_KEYS, PUB_KEYS } from '../constants.js';

export class ScheduledList extends PageBase {
	async mount() {
		const c = this.router.c;
		const items = await loadFromKv(c, KV_KEYS.scheduled, []);

		delete this.state.scheduledItem;

		// TODO: если список пустой - написать

		this.text = t(c, 'scheduledListDescr');
		this.menu = defineMenu([
			...items.map((i) => [
				{
					id: i.id,
					label:
						`${i[PUB_KEYS.date]} ${i[PUB_KEYS.text]?.substring(0, 20)}`.trim(),
					payload: i.id,
					cb: async (payload) => {
						this.state.scheduledItem = payload;

						return this.router.go('scheduled-item');
					},
				},
			]),
			[
				{
					id: 'toHomeBtn',
					label: t(c, 'toHomeBtn'),
					cb: () => this.router.go('home'),
				},
			],
		]);
	}
}
