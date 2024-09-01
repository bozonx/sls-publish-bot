import { PubPageBase } from '../PubPageBase.js';
import { t, makeStatePreview, defineMenu } from '../helpers.js';

export class PubHour extends PubPageBase {
	async mount() {
		const c = this.router.c;

		this.text = `${makeStatePreview(c, this.state.pub)}\n\n${t(c, 'selectHourDescr')}`;
		this.menu = defineMenu([
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
					id: 'toHomeBtn',
					label: t(c, 'toHomeBtn'),
					cb: () => this.go('home'),
				},
				{
					id: 'backBtn',
					label: t(c, 'backBtn'),
					cb: () => this.go('pub-date'),
				},
				typeof this.state.pub?.hour === 'number' && {
					id: 'nextBtn',
					label: t(c, 'nextBtn'),
					cb: () => this.go('pub-post-setup'),
				},
			],
		]);
	}

	async onMessage() {
		//
		// console.log(1111, c);
		// await c.pager.go('pub-confirm', this.payload);
		// await c.reply(t(c, 'textAccepted'))
	}

	_makeHourBtn(hour) {
		return {
			id: hour,
			label: String(hour),
			payload: hour,
			cb: this._selectHourHandler,
		};
	}

	_selectHourHandler = (btnId, payload) => {
		return this.go('pub-post-setup', { hour: Number(payload) });
	};
}
