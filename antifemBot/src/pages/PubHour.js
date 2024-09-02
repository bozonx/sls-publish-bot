import { PubPageBase } from '../PubPageBase.js';
import { t, makeStatePreview, defineMenu } from '../helpers.js';
import { PUB_KEYS } from '../constants.js';

export class PubHour extends PubPageBase {
	async renderMenu() {
		const c = this.router.c;

		this.text = `${makeStatePreview(c, this.state.pub)}\n\n${t(c, 'selectHourDescr')}`;

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
					id: 'toHomeBtn',
					label: t(c, 'toHomeBtn'),
				},
				typeof this.state.pub?.[PUB_KEYS.hour] === 'number' && {
					id: 'nextBtn',
					label: t(c, 'nextBtn'),
				},
			],
		]);
	}

	async onButtonPress(btnId, payload) {
		if (btnId === 'HOUR') {
			return this._selectHourHandler(payload);
		}

		switch (btnId) {
			case 'backBtn':
				return this.go('pub-date');
			case 'toHomeBtn':
				return this.go('home');
			case 'nextBtn':
				return this.go('pub-post-setup');
			default:
				return false;
		}
	}

	async onMessage() {
		//
		// console.log(1111, c);
		// await c.pager.go('pub-confirm', this.payload);
		// await c.reply(t(c, 'textAccepted'))
	}

	_makeHourBtn(hour) {
		return {
			id: 'HOUR',
			label: String(hour),
			payload: hour,
		};
	}

	_selectHourHandler = (payload) => {
		return this.go('pub-post-setup', { [PUB_KEYS.hour]: Number(payload) });
	};
}
