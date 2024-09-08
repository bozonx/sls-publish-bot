import { PageBase } from '../PageRouter.js';
import { t, defineMenu } from '../helpers/helpers.js';
import { convertDbScheduledToPubState } from '../helpers/publishHelpres.js';
import {
	makeHumanRuDateCompact,
	getTimeStr,
	makeIsoDate,
} from '../helpers/dateTimeHelpers.js';
import {
	DEFAULT_BTN_ITEM_ID,
	HOME_PAGE,
	EDIT_ITEM_NAME,
	DB_TABLE_NAMES,
	PUB_SCHEDULED_KEYS,
	CTX_KEYS,
} from '../constants.js';

export class ScheduledList extends PageBase {
	async renderMenu() {
		const c = this.router.c;
		const items = await this.db.getAll(
			DB_TABLE_NAMES.PubScheduled,
			{
				[PUB_SCHEDULED_KEYS.id]: true,
				[PUB_SCHEDULED_KEYS.name]: true,
				[PUB_SCHEDULED_KEYS.pubTimestampMinutes]: true,
			},
			undefined,
			[{ [PUB_SCHEDULED_KEYS.pubTimestampMinutes]: 'asc' }],
		);
		// remove editing state
		delete this.state[EDIT_ITEM_NAME];

		this.text = items.length
			? t(c, 'scheduledListDescr')
			: t(c, 'scheduledEmptyListDescr');

		return defineMenu([
			...items.map((i) => [
				{
					id: DEFAULT_BTN_ITEM_ID,
					label: this._makeItemLabel(i),
					payload: i[PUB_SCHEDULED_KEYS.id],
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
			const itemId = Number(payload);
			const dbItem = await this.db.getItem(DB_TABLE_NAMES.PubScheduled, itemId);

			this.state[EDIT_ITEM_NAME] = convertDbScheduledToPubState(dbItem);

			return this.router.go('scheduled-item');
		}

		switch (btnId) {
			case 'toHomeBtn':
				return this.router.go(HOME_PAGE);
			default:
				return false;
		}
	}

	_makeItemLabel(dbItem) {
		const c = this.router.c;
		const itemName = dbItem[PUB_SCHEDULED_KEYS.name];

		if (!itemName) return t(c, 'itemHasNoContent');

		const itemPubMinutes = dbItem[PUB_SCHEDULED_KEYS.pubTimestampMinutes];
		const curTimeMinutes = new Date().getTime() / 1000 / 60;
		// if staled - use stale mark
		let dateTimeLabel = t(this.router.c, 'staleMark');

		if (
			itemPubMinutes >
			curTimeMinutes - c.ctx[CTX_KEYS.PUBLISHING_MINUS_MINUTES]
		) {
			// means actual - else use date and time
			dateTimeLabel =
				makeHumanRuDateCompact(
					this.c,
					makeIsoDate(0, itemPubMinutes * 60 * 1000),
				) +
				' ' +
				getTimeStr(
					c.ctx[CTX_KEYS.PUBLICATION_TIME_ZONE],
					itemPubMinutes * 60 * 1000,
				);
		}

		return `${dateTimeLabel} ${itemName}`;
	}
}
