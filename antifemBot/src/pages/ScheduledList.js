import { PageBase } from '../PageRouter.js';
import { t, defineMenu } from '../helpers/helpers.js';
import { applyStringTemplate } from '../helpers/lib.js';
import { convertDbScheduledToPubState } from '../helpers/publishHelpres.js';
import {
	makeHumanRuDateCompact,
	getTimeStr,
	makeIsoLocaleDate,
} from '../helpers/dateTimeHelpers.js';
import {
	DEFAULT_BTN_ITEM_ID,
	HOME_PAGE,
	EDIT_ITEM_NAME,
	DB_TABLE_NAMES,
	POST_KEYS,
	CTX_KEYS,
} from '../constants.js';

export class ScheduledList extends PageBase {
	async renderMenu() {
		const c = this.router.c;
		const items = await this.db.getAll(
			DB_TABLE_NAMES.Post,
			{
				[POST_KEYS.id]: true,
				[POST_KEYS.name]: true,
				[POST_KEYS.pubTimestampMinutes]: true,
			},
			undefined,
			[{ [POST_KEYS.pubTimestampMinutes]: 'asc' }],
		);
		// remove editing state
		delete this.state[EDIT_ITEM_NAME];

		this.text = items.length
			? applyStringTemplate(t(c, 'scheduledListDescr'), {
					TIME_ZONE: t(c, 'msk'),
				})
			: t(c, 'scheduledEmptyListDescr');

		return defineMenu([
			...items.map((i) => [
				{
					id: DEFAULT_BTN_ITEM_ID,
					label: this._makeItemLabel(i),
					payload: i[POST_KEYS.id],
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
			const dbItem = await this.db.getItem(DB_TABLE_NAMES.Post, itemId);

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
		const itemName = dbItem[POST_KEYS.name];

		if (!itemName) return t(c, 'itemHasNoContent');

		const itemPubMinutes = dbItem[POST_KEYS.pubTimestampMinutes];
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
					makeIsoLocaleDate(
						itemPubMinutes * 60 * 1000,
						c.ctx[CTX_KEYS.PUBLICATION_TIME_ZONE],
					),
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
