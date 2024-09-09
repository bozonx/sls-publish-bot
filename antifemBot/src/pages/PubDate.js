import { PubPageBase } from '../PubPageBase.js';
import { t, makeStatePreview, defineMenu } from '../helpers/helpers.js';
import { saveEditedScheduledPost } from '../helpers/publishHelpres.js';
import { isEmptyObj, applyStringTemplate } from '../helpers/lib.js';
import {
	normalizeShortDateToIsoDate,
	todayPlusDaysIsoDate,
	makeShortDateFromIsoDate,
	getShortWeekDay,
	isPastDate,
	isoDateToLongLocaleRuDate,
	makeIsoLocaleDate,
} from '../helpers/dateTimeHelpers.js';
import {
	PUB_KEYS,
	HOME_PAGE,
	EDIT_ITEM_NAME,
	DEFAULT_PUB_PLUS_DAY,
	CTX_KEYS,
} from '../constants.js';

export class PubDate extends PubPageBase {
	async renderMenu() {
		const c = this.router.c;
		// copy state to edit in edit mode
		if (this.state[EDIT_ITEM_NAME] && isEmptyObj(this.state.pub))
			this.state.pub = this.state[EDIT_ITEM_NAME];
		// default date is tomorrow
		this.state.pub = {
			[PUB_KEYS.date]: todayPlusDaysIsoDate(
				DEFAULT_PUB_PLUS_DAY,
				c.ctx[CTX_KEYS.PUBLICATION_TIME_ZONE],
			),
			...this.state.pub,
		};

		const descr =
			applyStringTemplate(t(c, 'selectDateDescr'), {
				TIME_ZONE: t(c, 'msk'),
			}) +
			` ${isoDateToLongLocaleRuDate(makeIsoLocaleDate(undefined, c.ctx[CTX_KEYS.PUBLICATION_TIME_ZONE]))}`;

		this.text = `${await makeStatePreview(c, this.state.pub)}\n\n${descr}`;

		const daysBtn = [];

		for (let i = 3; i <= 6; i++) {
			const isoDateStr = todayPlusDaysIsoDate(
				i,
				c.ctx[CTX_KEYS.PUBLICATION_TIME_ZONE],
			);

			daysBtn.push({
				id: 'DAY',
				label:
					makeShortDateFromIsoDate(isoDateStr) +
					` ${getShortWeekDay(isoDateStr)}`,
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
				[PUB_KEYS.date]: todayPlusDaysIsoDate(
					payload,
					this.router.c.ctx[CTX_KEYS.PUBLICATION_TIME_ZONE],
				),
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

		if (!c.msg.text) await this.reply('No text');

		const preparedDateStr = c.msg.text.trim().replace(/\s/g, '.');
		const isoDateStr = normalizeShortDateToIsoDate(
			preparedDateStr,
			c.ctx[CTX_KEYS.PUBLICATION_TIME_ZONE],
		);

		if (!isoDateStr) return this.reply(t(c, 'wrongDate'));
		else if (isPastDate(isoDateStr, c.ctx[CTX_KEYS.PUBLICATION_TIME_ZONE]))
			return this.reply(t(c, 'dateIsPastMessage'));

		return this.go('pub-time', { [PUB_KEYS.date]: isoDateStr });
	}
}
