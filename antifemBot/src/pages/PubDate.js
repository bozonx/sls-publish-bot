import _ from 'lodash';
import dayjs from 'dayjs';
import { PubPageBase } from '../PubPageBase.js';
import { t, makeStatePreview, defineMenu } from '../helpers.js';
import { PUB_KEYS, PUBLICATION_TIME_ZONE, DATE_FORMAT } from '../constants.js';

export class PubDate extends PubPageBase {
	async renderMenu() {
		const c = this.router.c;
		const descr = _.template(t(c, 'selectDateDescr'))({
			TIME_ZONE: t(c, 'msk'),
		});

		this.text = `${makeStatePreview(c, this.state.pub)}\n\n${descr}`;

		const daysBtn = [];
		const nowDate = dayjs().tz(PUBLICATION_TIME_ZONE);

		for (let i = 3; i <= 6; i++) {
			const shiftDate = nowDate.add(i, 'day');
			// start from sunday = 0
			let dayOfWeekNum = shiftDate.get('d');

			if (dayOfWeekNum === 0) dayOfWeekNum = 7;

			const dayOfWeekLocale = t(c, 'daysOfWeek')[dayOfWeekNum - 1];

			console.log(8888, i, shiftDate.format(), dayOfWeekNum, dayOfWeekLocale);

			daysBtn.push({
				id: 'DAY',
				// label: `${i} - ${dayOfWeekLocale}`,
				label: dayOfWeekLocale,
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
				// {
				// 	id: 'cancelBtn',
				// 	label: t(c, 'cancelBtn'),
				// },
				this.state.pub?.[PUB_KEYS.date] && {
					id: 'nextBtn',
					label: t(c, 'nextBtn'),
				},
			],
		]);
	}

	async onButtonPress(btnId, payload) {
		if (btnId === 'DAY') {
			const date = dayjs().add(Number(payload || 0), 'day');
			const dateStr = date.format(DATE_FORMAT);

			return this.go('pub-time', {
				[PUB_KEYS.date]: dateStr,
			});
		}

		switch (btnId) {
			case 'backBtn':
				return this.go('pub-post-setup');
			// case 'cancelBtn':
			// 	return this.go('home');
			case 'nextBtn':
				return this.go('pub-time');
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

		const currentYear = dayjs().tz(PUBLICATION_TIME_ZONE).get('year');
		const preparedDateStr = c.msg.text.trim().replace(/\s/g, '.');
		const rawDate = dayjs(
			`${preparedDateStr}.${currentYear}`,
			'D.M.YYYY',
			// strict parse and validate
			true,
		);

		if (rawDate.isValid()) {
			const dateStr = rawDate.utc(true).format(DATE_FORMAT);

			return this.go('pub-time', { [PUB_KEYS.date]: dateStr });
		} else {
			await this.reply(t(c, 'wrongDateFormat'));

			return this.reload();
		}
	}
}
