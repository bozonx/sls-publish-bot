import { PageBase } from '../PageRouter.js';
import {
	t,
	defineMenu,
	makeCurrentDateTimeStr,
	makePostItemLabel,
} from '../helpers/helpers.js';
import { convertDbPostToPubState } from '../helpers/publishHelpres.js';
import {
	DEFAULT_BTN_ITEM_ID,
	HOME_PAGE,
	EDIT_ITEM_NAME,
	DB_TABLE_NAMES,
	POST_KEYS,
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
			{
				[POST_KEYS.pubMsgId]: null,
				NOT: {
					[POST_KEYS.pubTimestampMinutes]: null,
				},
			},
			[{ [POST_KEYS.pubTimestampMinutes]: 'asc' }],
		);
		// remove editing state
		delete this.state[EDIT_ITEM_NAME];

		this.text = items.length
			? t(c, 'scheduledListDescr') + '\n\n' + makeCurrentDateTimeStr(c)
			: t(c, 'scheduledEmptyListDescr');

		return defineMenu([
			...items.map((i) => [
				{
					id: DEFAULT_BTN_ITEM_ID,
					label: makePostItemLabel(c, i),
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

			this.state[EDIT_ITEM_NAME] = convertDbPostToPubState(dbItem);

			return this.router.go('scheduled-item');
		}

		switch (btnId) {
			case 'toHomeBtn':
				return this.router.go(HOME_PAGE);
			default:
				return false;
		}
	}
}
