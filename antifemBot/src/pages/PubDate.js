import { PubPageBase } from '../PubPageBase.js';
import { t, makeStatePreview, defineMenu } from '../helpers.js';
import { PUB_KEYS, HOME_PAGE } from '../constants.js';
import { saveEditedScheduledPost } from '../publishHelpres.js';
import { isEmptyObj, applyStringTemplate } from '../lib.js';
import {
	getLocaleDayOfWeekFromNow,
	isValidShortDate,
	shortRuDateToFullIsoDate,
	makeIsoDayFromNow,
} from '../dateTimeHelpers.js';

export class PubDate extends PubPageBase {
	async renderMenu() {
		const c = this.router.c;
		// copy state to edit in edit mode
		if (this.state.editItem && isEmptyObj(this.state.pub))
			this.state.pub = this.state.editItem;

		const descr = applyStringTemplate(t(c, 'selectDateDescr'), {
			TIME_ZONE: t(c, 'msk'),
		});

		this.text = `${makeStatePreview(c, this.state.pub)}\n\n${descr}`;

		const daysBtn = [];

		for (let i = 3; i <= 6; i++) {
			// TODO: remake
			// const shiftDate = nowDate.add(i, 'day');
			// const dayOfWeekNum = getDayOfWeekNum(shiftDate);
			// const dayOfWeekLocale = t(c, 'daysOfWeek')[dayOfWeekNum];

			daysBtn.push({
				id: 'DAY',
				label: getLocaleDayOfWeekFromNow(i),
				// label: dayOfWeekLocale,
				payload: i,
			});
		}

		return defineMenu([
			[
				{
					id: 'DAY',
					label: t(c, 'today'),
					payload: 0,
				},
				{
					id: 'DAY',
					label: t(c, 'tomorrow'),
					payload: 1,
				},
				{
					id: 'DAY',
					label: t(c, 'afterTomorrow'),
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
				this.state.editItem && {
					id: 'saveBtn',
					label: t(c, 'saveBtn'),
				},
				this.state.pub?.[PUB_KEYS.date] && {
					id: 'nextBtn',
					label: t(c, 'nextBtn'),
				},
			],
		]);
	}

	async onButtonPress(btnId, payload) {
		if (btnId === 'DAY') {
			const dateStr = makeIsoDayFromNow(payload);

			return this.go('pub-time', {
				[PUB_KEYS.date]: dateStr,
			});
		}

		switch (btnId) {
			case 'backBtn':
				return this.go('pub-post-setup');
			case 'cancelBtn':
				if (this.state.editItem) {
					delete this.state.pub;

					return this.go('scheduled-item');
				}

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
			const dateStr = shortRuDateToFullIsoDate(preparedDateStr);

			return this.go('pub-time', { [PUB_KEYS.date]: dateStr });
		} else {
			await this.reply(t(c, 'wrongDateFormat'));

			return this.reload();
		}
	}
}
