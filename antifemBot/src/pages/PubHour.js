import _ from 'lodash';
import { PubPageBase } from '../PubPageBase.js';
import { t, makeStatePreview, defineMenu } from '../helpers.js';
import { PUB_KEYS } from '../constants.js';

export class PubHour extends PubPageBase {
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
				{
					id: 'cancelBtn',
					label: t(c, 'cancelBtn'),
				},
				this.state.pub[PUB_KEYS.time] && {
					id: 'nextBtn',
					label: t(c, 'nextBtn'),
				},
			],
		]);
	}

	async onButtonPress(btnId, payload) {
		if (btnId === 'HOUR') {
			const time = Number(payload) < 10 ? `0${payload}:00` : `${payload}:00`;

			return this.go('pub-post-setup', { [PUB_KEYS.time]: time });
		}

		switch (btnId) {
			case 'backBtn':
				return this.go('pub-date');
			case 'cancelBtn':
				return this.go('home');
			case 'nextBtn':
				return this.go('pub-post-setup');
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

		const rawTime = c.msg.text.trim();
		let time;

		if (rawTime.match(/^\d\:\d\d$/)) {
			time = '0' + rawTime;
		} else if (rawTime.match(/^\d\d\:\d\d$/)) {
			time = rawTime;
		} else {
			await c.reply(t(c, 'wrongTimeFormat'));

			return this.reload();
		}

		return this.go('pub-post-setup', { [PUB_KEYS.time]: time });
	}

	_makeHourBtn(hour) {
		return {
			id: 'HOUR',
			label: String(hour),
			payload: hour,
		};
	}
}
