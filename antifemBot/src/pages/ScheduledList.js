import _ from 'lodash';
import { PageBase } from '../PageRouter.js';
import {
	t,
	loadFromKv,
	defineMenu,
	makeIsoDateFromPubState,
} from '../helpers.js';
import { KV_KEYS, PUB_KEYS } from '../constants.js';

export class ScheduledList extends PageBase {
	async renderMenu() {
		const c = this.router.c;
		const items = (await loadFromKv(c, KV_KEYS.scheduled, [])).sort(
			(a, b) =>
				new Date(makeIsoDateFromPubState(a)) -
				new Date(makeIsoDateFromPubState(b)),
		);

		delete this.state.scheduledItem;

		this.text = items.length
			? t(c, 'scheduledListDescr')
			: t(c, 'scheduledEmptyListDescr');

		return defineMenu([
			...items.map((i) => [
				{
					id: 'ITEM',
					label:
						`${i[PUB_KEYS.date]} ${i[PUB_KEYS.time]} ${i[PUB_KEYS.text]?.substring(0, 20)}`.trim(),
					payload: i.id,
				},
			]),
			[
				{
					id: 'cancelBtn',
					label: t(c, 'cancelBtn'),
				},
			],
		]);
	}

	async onButtonPress(btnId, payload) {
		if (btnId === 'ITEM') {
			this.state.scheduledItem = payload;

			return this.router.go('scheduled-item');
		}

		switch (btnId) {
			case 'cancelBtn':
				return this.router.go('home');
			default:
				return false;
		}
	}
}
