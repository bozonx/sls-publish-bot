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
			// TODO: add days of week
			[
				{
					id: 'backBtn',
					label: t(c, 'backBtn'),
				},
				{
					id: 'toHomeBtn',
					label: t(c, 'toHomeBtn'),
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
			case 'toHomeBtn':
				return this.go('home');
			case 'nextBtn':
				return this.go('pub-hour');
			default:
				return false;
		}
	}

	async onMessage() {
		//
		// await c.reply(t(c, 'textAccepted'))
	}
}
