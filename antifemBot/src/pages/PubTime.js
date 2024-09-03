import _ from 'lodash';
import { PubPageBase } from '../PubPageBase.js';
import { t, makeStatePreview, defineMenu } from '../helpers.js';
import { PUB_KEYS, HOME_PAGE } from '../constants.js';
import {
	schedulePublication,
	printPubToAdminChannel,
} from '../publishHelpres.js';

export class PubTime extends PubPageBase {
	async renderMenu() {
		const c = this.router.c;
		const descr = _.template(t(c, 'selectHourDescr'))({
			TIME_ZONE: t(c, 'msk'),
		});

		this.text = `${makeStatePreview(c, this.state.pub)}\n\n${descr}`;

		return defineMenu([
			[
				this._makeHourBtn(7),
				this._makeHourBtn(8),
				this._makeHourBtn(9),
				this._makeHourBtn(10),
				this._makeHourBtn(11),
			],
			[
				this._makeHourBtn(12),
				this._makeHourBtn(13),
				this._makeHourBtn(14),
				this._makeHourBtn(15),
				this._makeHourBtn(16),
			],
			[
				this._makeHourBtn(17),
				this._makeHourBtn(18),
				this._makeHourBtn(19),
				this._makeHourBtn(20),
				this._makeHourBtn(21),
			],
			[
				{
					id: 'backBtn',
					label: t(c, 'backBtn'),
				},
				// {
				// 	id: 'cancelBtn',
				// 	label: t(c, 'cancelBtn'),
				// },
				this.state.pub[PUB_KEYS.time] && {
					id: 'pubConfirmBtn',
					label: '🗓️ ' + t(c, 'pubConfirmBtn'),
				},
			],
		]);
	}

	async onButtonPress(btnId, payload) {
		const c = this.router.c;

		if (btnId === 'HOUR') {
			const time = Number(payload) < 10 ? `0${payload}:00` : `${payload}:00`;

			return this.reload({ [PUB_KEYS.time]: time });
		}

		switch (btnId) {
			case 'backBtn':
				return this.go('pub-date');
			// case 'cancelBtn':
			// 	return this.go('home');
			case 'pubConfirmBtn':
				const item = await schedulePublication(c, this.state.pub);
				await printPubToAdminChannel(this.router, item);
				await this.reply(t(c, 'wasSuccessfullyScheduled'));

				return this.go(HOME_PAGE);
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

		const rawTime = c.msg.text.trim();
		let time;

		if (rawTime.match(/^\d[:.\s]\d\d$/)) {
			time = '0' + rawTime;
		} else if (rawTime.match(/^\d\d[:.\s]\d\d$/)) {
			time = rawTime;
		} else {
			await this.reply(t(c, 'wrongTimeFormat'));

			return this.reload();
		}

		return this.reload({ [PUB_KEYS.time]: time });
	}

	_makeHourBtn(hour) {
		return {
			id: 'HOUR',
			label: `${hour}:00`,
			payload: hour,
		};
	}
}
