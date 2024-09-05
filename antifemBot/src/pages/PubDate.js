import { PubPageBase } from '../PubPageBase.js';
import { t, makeStatePreview, defineMenu } from '../helpers.js';
import {
	PUB_KEYS,
	HOME_PAGE,
	EDIT_ITEM_NAME,
	DEFAULT_PUB_PLUS_DAY,
} from '../constants.js';
import { saveEditedScheduledPost } from '../publishHelpres.js';
import { isEmptyObj, applyStringTemplate } from '../lib.js';
import {
	isValidShortDate,
	shortRuDateToFullIsoDate,
	makeIsoDayFromNow,
	makeShortDateFromIsoDate,
	getShortWeekDay,
	isPastDate,
} from '../dateTimeHelpers.js';

export class PubDate extends PubPageBase {
	async renderMenu() {
		const c = this.router.c;
		// copy state to edit in edit mode
		if (this.state[EDIT_ITEM_NAME] && isEmptyObj(this.state.pub))
			this.state.pub = this.state[EDIT_ITEM_NAME];

		// default date is tomorrow
		if (!this.state.pub[PUB_KEYS.date])
			this.state.pub[PUB_KEYS.date] = makeIsoDayFromNow(DEFAULT_PUB_PLUS_DAY);

		const descr = applyStringTemplate(t(c, 'selectDateDescr'), {
			TIME_ZONE: t(c, 'msk'),
		});

		this.text = `${makeStatePreview(c, this.state.pub)}\n\n${descr}`;

		const daysBtn = [];

		for (let i = 3; i <= 6; i++) {
			const isoDateStr = makeIsoDayFromNow(i);
			const shortDate = makeShortDateFromIsoDate(isoDateStr);
			const shortWeekDayStr = getShortWeekDay(isoDateStr);

			daysBtn.push({
				id: 'DAY',
				label: `${shortWeekDayStr} ${shortDate}`,
				payload: i,
			});
		}

		return defineMenu([
			[
				{
					id: 'DAY',
					label: t(c, 'closestDays')[0],
					payload: 0,
				},
				{
					id: 'DAY',
					label: t(c, 'closestDays')[1],
					payload: 1,
				},
				{
					id: 'DAY',
					label: t(c, 'closestDays')[2],
					payload: 2,
				},
			],
			[...daysBtn],
			[
				{
					id: 'backBtn',
					label: t(c, 'backBtn'),
				},
				{
					id: 'cancelBtn',
					label: t(c, 'cancelBtn'),
				},
				this.state[EDIT_ITEM_NAME] && {
					id: 'saveBtn',
					label: t(c, 'saveBtn'),
				},
				{
					id: 'nextBtn',
					label: t(c, 'nextBtn'),
				},
			],
		]);
	}

	async onButtonPress(btnId, payload) {
		if (btnId === 'DAY') {
			return this.go('pub-time', {
				[PUB_KEYS.date]: makeIsoDayFromNow(payload),
			});
		}

		switch (btnId) {
			case 'backBtn':
				return this.go('pub-post-setup');
			case 'cancelBtn':
				if (this.state[EDIT_ITEM_NAME]) return this.go('scheduled-item');

				return this.go(HOME_PAGE);
			case 'nextBtn':
				return this.go('pub-time');
			case 'saveBtn':
				return saveEditedScheduledPost(this.router);
			default:
				return false;
		}
	}

	async onMessage() {
		const c = this.router.c;

		if (!c.msg.text) {
			await this.reply('No text');

			return this.reload();
		}

		const preparedDateStr = c.msg.text.trim().replace(/\s/g, '.');

		if (isValidShortDate(preparedDateStr)) {
			const isoDateStr = shortRuDateToFullIsoDate(preparedDateStr);

			if (isPastDate(isoDateStr)) return this.reply(t(c, 'dateIsPastMessage'));

			return this.go('pub-time', { [PUB_KEYS.date]: isoDateStr });
		} else {
			await this.reply(t(c, 'wrongDateFormat'));

			return this.reload();
		}
	}
}
