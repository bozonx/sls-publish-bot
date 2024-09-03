import _ from 'lodash';
import { PubPageBase } from '../PubPageBase.js';
import { t, makeStatePreview, defineMenu } from '../helpers.js';
import { PUB_KEYS, HOME_PAGE, DEFAULT_PUB_TIME } from '../constants.js';

export class PubTime extends PubPageBase {
	async renderMenu() {
		const c = this.router.c;
		const descr = _.template(t(c, 'selectHourDescr'))({
			TIME_ZONE: t(c, 'msk'),
		});

		this.state.pub = {
			[PUB_KEYS.time]: DEFAULT_PUB_TIME,
			...this.state.pub,
		};
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
				!this.state.editItem && {
					id: 'nextBtn',
					label: t(c, 'nextBtn'),
				},
			],
			this.state.editItem && [
				{
					id: 'saveBtn',
					label: t(c, 'saveBtn'),
				},
			],
		]);
	}

	async onButtonPress(btnId, payload) {
		if (btnId === 'HOUR') {
			const time = Number(payload) < 10 ? `0${payload}:00` : `${payload}:00`;

			return this.reload({ [PUB_KEYS.time]: time });
		}

		switch (btnId) {
			case 'backBtn':
				return this.go('pub-date');
			case 'cancelBtn':
				if (this.state.editItem) {
					delete this.state.pub;

					return this.go('scheduled-item');
				}

				return this.go(HOME_PAGE);
			case 'nextBtn':
				return this.go('pub-confirm');
			case 'saveBtn':
				this.state.editItem = this.state.pub;

				return this.go('scheduled-item');
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

		return this.go('pub-confirm', { [PUB_KEYS.time]: time });
	}

	_makeHourBtn(hour) {
		return {
			id: 'HOUR',
			label: `${hour}:00`,
			payload: hour,
		};
	}
}
