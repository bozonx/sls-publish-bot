import dayjs from 'dayjs';
import { PubPageBase } from '../PubPageBase.js';
import { t, makeStatePreview, nowPlusDay, defineMenu } from '../helpers.js';
import { PUB_KEYS, PUBLICATION_TIME_ZONE } from '../constants.js';

export class PubDate extends PubPageBase {
	async renderMenu() {
		const c = this.router.c;
		const descr = _.template(t(c, 'selectDateDescr'))({
			TIME_ZONE: t(c, 'msk'),
		});

		this.text = `${makeStatePreview(c, this.state.pub)}\n\n${t(c, 'descr')}`;

		const daysBtn = [];
		const nowDate = dayjs().tz(PUBLICATION_TIME_ZONE);

		for (const i = 3; i <= 7; i++) {
			const shiftDate = nowDate.add(i, 'day');
			// start from 1
			const dayOfWeekNum = shiftDate.get('d');
			const dayOfWeekLocale = t(c, 'daysOfWeek')[dayOfWeekNum - 1];

			daysBtn.push({
				id: 'DAY',
				label: `${i} - ${dayOfWeekLocale}`,
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
			...daysBtn,
			[
				{
					id: 'backBtn',
					label: t(c, 'backBtn'),
				},
				{
					id: 'cancelBtn',
					label: t(c, 'cancelBtn'),
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
			return this.go('pub-hour', {
				[PUB_KEYS.date]: nowPlusDay(Number(payload)),
			});
		}

		switch (btnId) {
			case 'backBtn':
				return this.go('pub-tags');
			case 'cancelBtn':
				return this.go('home');
			case 'nextBtn':
				return this.go('pub-hour');
			default:
				return false;
		}
	}

	async onMessage() {
		const c = this.router.c;

		if (!c.msg.text) {
			await c.reply('No text');

			return this.reload();
		}

		const currentYear = dayjs.tz(PUBLICATION_TIME_ZONE).get('year');
		const rawDate = dayjs(`${c.msg.text.trim()}.${currentYear}`);

		if (rawDate.isValid()) {
			return this.go('pub-time', { [PUB_KEYS.time]: time });
		} else {
			await c.reply(t(c, 'wrongTimeFormat'));

			return this.reload();
		}
	}
}
