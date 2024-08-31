import { PubPageBase } from '../PubPageBase.js';
import { t, makeStatePreview, nowPlusDay, defineMenu } from '../helpers.js';

export class PubDate extends PubPageBase {
	async mount() {
		const c = this.router.c;

		this.text = `${makeStatePreview(c, this.state.pub)}\n\n${t(c, 'selectDate')}`;
		this.menu = defineMenu([
			[
				{
					id: 'today',
					label: t(c, 'today'),
					payload: 0,
					cb: this._selectDayHandler,
				},
				{
					id: 'tomorrow',
					label: t(c, 'tomorrow'),
					payload: 1,
					cb: this._selectDayHandler,
				},
				{
					id: 'afterTomorrow',
					label: t(c, 'afterTomorrow'),
					payload: 2,
					cb: this._selectDayHandler,
				},
			],
			// TODO: add days of week
			[
				{
					id: 'toHomeBtn',
					label: t(c, 'toHomeBtn'),
					cb: () => this.go('home'),
				},
				{
					id: 'backBtn',
					label: t(c, 'backBtn'),
					cb: () => this.go('pub-tags'),
				},
				this.state.pub?.date && {
					id: 'nextBtn',
					label: t(c, 'nextBtn'),
					cb: () => this.go('pub-hour'),
				},
			],
		]);
	}

	async message() {
		//
		// console.log(1111, c);
		// await c.pager.go('pub-hour', this.payload);
		// await c.reply(t(c, 'textAccepted'))
	}

	_selectDayHandler = (btnId, payload) => {
		return this.go('pub-hour', { date: nowPlusDay(Number(payload)) });
	};
}
