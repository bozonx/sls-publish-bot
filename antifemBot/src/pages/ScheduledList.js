import _ from 'lodash';
import { PageBase } from '../PageRouter.js';
import { t, loadFromKv, defineMenu } from '../helpers.js';
import { KV_KEYS, PUB_KEYS } from '../constants.js';

export class ScheduledList extends PageBase {
	async renderMenu() {
		const c = this.router.c;
		const items = (await loadFromKv(c, KV_KEYS.scheduled, [])).sort(
			(a, b) =>
				new Date(`${a.date}T${a.hour}:00Z`) -
				new Date(`${b.date}T${b.hour}:00Z`),
		);

		delete this.state.scheduledItem;

		this.text = items.length
			? t(c, 'scheduledListDescr')
			: t(c, 'scheduledEmptyListDescr');

		return defineMenu([
			...items.map((i) => [
				{
					// TODO: можно и не сохранять id
					id: 'ITEM-' + i.id,
					label:
						`${i[PUB_KEYS.date]} ${i[PUB_KEYS.hour]}:00 ${i[PUB_KEYS.text]?.substring(0, 20)}`.trim(),
					payload: i.id,
				},
			]),
			[
				{
					id: 'toHomeBtn',
					label: t(c, 'toHomeBtn'),
				},
			],
		]);
	}

	async onButtonPress(btnId, payload) {
		if (btnId.indexOf('ITEM-') === 0) {
			this.state.scheduledItem = payload;

			return this.router.go('scheduled-item');
		}

		switch (btnId) {
			case 'toHomeBtn':
				return this.router.go('home');
			default:
				return false;
		}
	}
}
