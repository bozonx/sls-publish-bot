import { PubPageBase } from '../PubPageBase.js';
import { t, makeStatePreview, nowPlusDay, defineMenu } from '../helpers.js';
import { PUB_KEYS } from '../constants.js';

export class PubDate extends PubPageBase {
	async renderMenu() {
		const c = this.router.c;

		this.text = `${makeStatePreview(c, this.state.pub)}\n\n${t(c, 'selectDateDescr')}`;

		return defineMenu([
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
					id: 'backBtn',
					label: t(c, 'backBtn'),
					cb: () => this.go('pub-tags'),
				},
				{
					id: 'toHomeBtn',
					label: t(c, 'toHomeBtn'),
					cb: () => this.go('home'),
				},
				this.state.pub?.[PUB_KEYS.date] && {
					id: 'nextBtn',
					label: t(c, 'nextBtn'),
					cb: () => this.go('pub-hour'),
				},
			],
		]);
	}

	async onButtonPress(btnId, payload) {
		switch (btnId) {
			case 'backBtn':
				return this.router.go('');
			case 'toHomeBtn':
				return this.router.go('home');
			case 'nextBtn':
				return this.router.go('');
			default:
				return false;
		}
	}

	async onMessage() {
		//
		// await c.reply(t(c, 'textAccepted'))
	}

	_selectDayHandler = (payload) => {
		return this.go('pub-hour', {
			[PUB_KEYS.date]: nowPlusDay(Number(payload)),
		});
	};
}
