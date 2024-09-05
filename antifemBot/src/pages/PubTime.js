import { PubPageBase } from '../PubPageBase.js';
import { t, makeStatePreview, defineMenu } from '../helpers.js';
import {
	PUB_KEYS,
	HOME_PAGE,
	DEFAULT_PUB_TIME,
	EDIT_ITEM_NAME,
	PUBLICATION_TIME_ZONE,
} from '../constants.js';
import { saveEditedScheduledPost } from '../publishHelpres.js';
import { make2SignDigitStr, applyStringTemplate, breakArray } from '../lib.js';
import {
	makeIsoDayFromNow,
	isValidShortTime,
	getCurrentHour,
} from '../dateTimeHelpers.js';

export class PubTime extends PubPageBase {
	async renderMenu() {
		const c = this.router.c;
		const descr = applyStringTemplate(t(c, 'selectHourDescr'), {
			TIME_ZONE: t(c, 'msk'),
		});

		this.state.pub = {
			[PUB_KEYS.time]: DEFAULT_PUB_TIME,
			...this.state.pub,
		};
		this.text = `${makeStatePreview(c, this.state.pub)}\n\n${descr}`;

		return defineMenu([
			...breakArray(this._makeHourButtons(), 5),
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
				!this.state[EDIT_ITEM_NAME] && {
					id: 'nextBtn',
					label: t(c, 'nextBtn'),
				},
			],
		]);
	}

	async onButtonPress(btnId, payload) {
		if (btnId === 'HOUR') {
			this.state.pub[PUB_KEYS.time] = make2SignDigitStr(payload) + `:00`;

			if (this.state[EDIT_ITEM_NAME])
				return saveEditedScheduledPost(this.router);
			else return this.go('pub-confirm');
		}

		switch (btnId) {
			case 'backBtn':
				return this.go('pub-date');
			case 'cancelBtn':
				if (this.state[EDIT_ITEM_NAME]) return this.go('scheduled-item');

				return this.go(HOME_PAGE);
			case 'nextBtn':
				return this.go('pub-confirm');
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

		const rawTime = c.msg.text.trim().replace(/[\s.]/g, ':');
		let time;

		if (isValidShortTime(rawTime)) {
			const [hourStr, minuteStr] = rawTime.split(':');

			time = `${make2SignDigitStr(hourStr)}:${make2SignDigitStr(minuteStr)}`;
		} else {
			await this.reply(t(c, 'wrongTimeFormat'));

			return this.reload();
		}

		this.state.pub[PUB_KEYS.time] = time;

		if (this.state[EDIT_ITEM_NAME]) return saveEditedScheduledPost(this.router);
		else return this.go('pub-confirm');
	}

	_makeHourButtons() {
		const firstHour = 7;
		const lastHour = 21;
		const res = [];

		if (this.state.pub.date === makeIsoDayFromNow(0)) {
			// is today then skip past hours
			const currentHourNum = getCurrentHour(PUBLICATION_TIME_ZONE);
			let startHour =
				currentHourNum < firstHour ? firstHour : currentHourNum + 1;

			if (currentHourNum <= lastHour) {
				for (let i = startHour; i <= lastHour; i++) {
					res.push(this._makeHourBtn(i));
				}
			}
		} else {
			// all hours from 7 to 21
			for (let i = firstHour; i <= lastHour; i++) {
				res.push(this._makeHourBtn(i));
			}
		}

		return res;
	}

	_makeHourBtn(hour) {
		return {
			id: 'HOUR',
			label: `${hour}:00`,
			payload: hour,
		};
	}
}
