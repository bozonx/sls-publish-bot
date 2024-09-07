import { PageBase } from '../PageRouter.js';
import { t, defineMenu } from '../helpers/helpers.js';
import {
	makeIsoDateFromPubState,
	makeHumanRuDateCompact,
	isPastDateTime,
} from '../helpers/dateTimeHelpers.js';
import {
	KV_KEYS,
	PUB_KEYS,
	DEFAULT_BTN_ITEM_ID,
	HOME_PAGE,
	EDIT_ITEM_NAME,
	PUBLISHING_MINUS_MINUTES,
} from '../constants.js';

const LABEL_LENGTH = 50;

export class ScheduledList extends PageBase {
	async renderMenu() {
		const c = this.router.c;
		// TODO: remake
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
					id: 'toHomeBtn',
					label: t(c, 'toHomeBtn'),
				},
			],
		]);
	}

	async onButtonPress(btnId, payload) {
		if (btnId === DEFAULT_BTN_ITEM_ID) {
			const itemId = payload;
			// TODO: remake
			const allItems = await loadFromKv(this.router.c, KV_KEYS.scheduled, []);

			this.state[EDIT_ITEM_NAME] = allItems.find((i) => i.id === itemId);

			if (!this.state[EDIT_ITEM_NAME])
				return this.reply(`ERROR: Can't find scheduled item "${itemId}"`);

			return this.router.go('scheduled-item');
		}

		switch (btnId) {
			case 'toHomeBtn':
				return this.router.go(HOME_PAGE);
			default:
				return false;
		}
	}

	makeItemLabel(item) {
		const text = item[PUB_KEYS.text]
			?.trim()
			.substring(0, LABEL_LENGTH)
			.trim()
			.replace(/\n/g, '')
			.replace(/[\s]{2,}/g, ' ');

		if (
			isPastDateTime(
				item[PUB_KEYS.date],
				item[PUB_KEYS.time],
				PUBLISHING_MINUS_MINUTES,
			)
		) {
			return `${t(this.router.c, 'staleMark')} ${text}`;
		}

		const dateStr = makeHumanRuDateCompact(this.c, item[PUB_KEYS.date]);
		const time = item[PUB_KEYS.time];

		return `${dateStr} ${time} ${text}`;
	}
}
