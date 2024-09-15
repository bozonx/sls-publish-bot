import { PubPageBase } from '../PubPageBase.js';
import {
	t,
	makeStatePreview,
	makeListOfScheduledForDescr,
	defineMenu,
	makeCurrentDateTimeStr,
} from '../helpers/helpers.js';
import { make2SignDigitStr, breakArray } from '../helpers/lib.js';
import {
	makeIsoLocaleDate,
	normalizeTime,
	getCurrentHour,
	isTimePast,
} from '../helpers/dateTimeHelpers.js';
import {
	PUB_KEYS,
	CTX_KEYS,
	HOME_PAGE,
	DEFAULT_PUB_TIME,
	EDIT_ITEM_NAME,
} from '../constants.js';

const FIRST_HOUR = 7;
const LAST_HOUR = 21;
const PAST_CHECK_ADDITIONAL_MINUTES = 10;

export class PubTime extends PubPageBase {
	async renderMenu() {
		const c = this.router.c;

		this.state.pub = {
			[PUB_KEYS.time]: DEFAULT_PUB_TIME,
			...this.state.pub,
		};
		this.text =
			(await makeListOfScheduledForDescr(c)) +
			'\n\n----------\n\n' +
			makeCurrentDateTimeStr(c) +
			'\n\n----------\n\n' +
			`${await makeStatePreview(c, this.state.pub)}\n\n` +
			t(c, 'selectHourDescr');

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
				this.state[EDIT_ITEM_NAME]
					? this.state.pub[PUB_KEYS.time] && {
							id: 'saveBtn',
							label: t(c, 'saveBtn'),
						}
					: {
							id: 'nextBtn',
							label: t(c, 'nextBtn'),
						},
			],
		]);
	}

	async onButtonPress(btnId, payload) {
		if (btnId === 'HOUR') {
			this.state.pub[PUB_KEYS.time] = make2SignDigitStr(payload) + `:00`;

			if (this.state[EDIT_ITEM_NAME]) {
				this.state.saveIt = true;

				return this.go(this.state.editReturnUrl);
			} else return this.go('pub-confirm');
		}

		switch (btnId) {
			case 'backBtn':
				return this.go('pub-date');
			case 'cancelBtn':
				if (this.state[EDIT_ITEM_NAME])
					return this.go(this.state.editReturnUrl);

				return this.go(HOME_PAGE);
			case 'nextBtn':
				return this.go('pub-confirm');
			case 'saveBtn':
				this.state.saveIt = true;

				return this.go(this.state.editReturnUrl);
			default:
				return false;
		}
	}

	async onMessage() {
		const c = this.router.c;

		if (!c.msg.text) await this.reply('No text');

		const rawTime = c.msg.text.trim().replace(/[\s.,]/g, ':');
		const normalizedTime = normalizeTime(rawTime);

		if (!normalizedTime) return this.reply(t(c, 'wrongTime'));
		else if (
			isTimePast(
				normalizedTime,
				this.state.pub[PUB_KEYS.date],
				c.ctx[CTX_KEYS.PUBLICATION_TIME_ZONE],
				PAST_CHECK_ADDITIONAL_MINUTES,
			)
		)
			return this.reply(t(c, 'timeIsPastMessage'));

		this.state.pub[PUB_KEYS.time] = normalizedTime;

		if (this.state[EDIT_ITEM_NAME]) {
			this.state.saveIt = true;

			return this.go(this.state.editReturnUrl);
		} else return this.go('pub-confirm');
	}

	_makeHourButtons() {
		const c = this.router.c;
		const res = [];

		if (
			this.state.pub.date ===
			makeIsoLocaleDate(undefined, c.ctx[CTX_KEYS.PUBLICATION_TIME_ZONE])
		) {
			// is today then skip past hours
			const currentHourNum = getCurrentHour(
				c.ctx[CTX_KEYS.PUBLICATION_TIME_ZONE],
			);
			let startHour =
				currentHourNum < FIRST_HOUR ? FIRST_HOUR : currentHourNum + 1;

			for (let i = startHour; i <= LAST_HOUR; i++) {
				res.push(this._makeHourBtn(i));
			}
			// else nothing - empty list
		} else {
			// not today all hours from 7 to 21
			for (let i = FIRST_HOUR; i <= LAST_HOUR; i++) {
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
