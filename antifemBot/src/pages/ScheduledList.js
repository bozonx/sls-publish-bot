import { PageBase } from '../PageRouter.js';
import { t, loadFromKv, defineMenu } from '../helpers.js';
import {
	KV_KEYS,
	PUB_KEYS,
	DEFAULT_BTN_ITEM_ID,
	HOME_PAGE,
	EDIT_ITEM_NAME,
} from '../constants.js';
import {
	makeIsoDateFromPubState,
	makeHumanRuDateCompact,
} from '../dateTimeHelpers.js';

export class ScheduledList extends PageBase {
	async renderMenu() {
		const c = this.router.c;
		const items = (await loadFromKv(c, KV_KEYS.scheduled, [])).sort(
			(a, b) =>
				new Date(makeIsoDateFromPubState(a)) -
				new Date(makeIsoDateFromPubState(b)),
		);

		delete this.state[EDIT_ITEM_NAME];

		this.text = items.length
			? t(c, 'scheduledListDescr')
			: t(c, 'scheduledEmptyListDescr');

		return defineMenu([
			...items.map((i) => [
				{
					id: DEFAULT_BTN_ITEM_ID,
					label: this.makeItemLabel(i),
					payload: i.id,
				},
			]),
			[
				{
					id: 'backBtn',
					label: t(c, 'backBtn'),
				},
			],
		]);
	}

	async onButtonPress(btnId, payload) {
		if (btnId === DEFAULT_BTN_ITEM_ID) {
			const itemId = payload;
			const allItems = await loadFromKv(this.router.c, KV_KEYS.scheduled, []);

			this.state[EDIT_ITEM_NAME] = allItems.find((i) => i.id === itemId);

			if (!this.state[EDIT_ITEM_NAME])
				return this.reply(`ERROR: Can't find scheduled item "${itemId}"`);

			return this.router.go('scheduled-item');
		}

		switch (btnId) {
			case 'backBtn':
				return this.router.go(HOME_PAGE);
			default:
				return false;
		}
	}

	makeItemLabel(item) {
		const dateStr = makeHumanRuDateCompact(this.c, item[PUB_KEYS.date]);
		const time = item[PUB_KEYS.time];
		const text = item[PUB_KEYS.text]?.trim().substring(0, 30).trim();

		return `${dateStr} ${time} ${text}`;
	}
}
