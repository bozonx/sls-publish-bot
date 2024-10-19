import { PubPageBase } from '../PubPageBase.js';
import {
	t,
	makeStatePreview,
	defineMenu,
	makeListOfScheduledForDescr,
	makeCurrentDateTimeStr,
} from '../helpers/helpers.js';
import { isEmptyObj } from '../helpers/lib.js';
import {
	normalizeShortDateToIsoDate,
	todayPlusDaysIsoDate,
	isPastDate,
	makeHumanRuDateCompact,
} from '../helpers/dateTimeHelpers.js';
import {
	PUB_KEYS,
	TG_HOME_PAGE,
	EDIT_ITEM_NAME,
	DEFAULT_PUB_PLUS_DAY,
	CTX_KEYS,
	SM_KEYS,
} from '../constants.js';

function makeClosestDayLabel(c, plusDay) {
	return makeHumanRuDateCompact(
		c,
		todayPlusDaysIsoDate(
			plusDay,
			c.ctx[CTX_KEYS.session].sm[SM_KEYS.cfg].PUBLICATION_TIME_ZONE,
		),
		c.ctx[CTX_KEYS.session].sm[SM_KEYS.cfg].PUBLICATION_TIME_ZONE,
	);
}

export class PubDate extends PubPageBase {
	async renderMenu() {
		const c = this.router.c;
		const editMode = Boolean(this.state[EDIT_ITEM_NAME]);
		// copy state to edit in edit mode
		if (editMode && isEmptyObj(this.state.pub))
			this.state.pub = this.state[EDIT_ITEM_NAME];
		// default date is tomorrow
		this.state.pub = {
			[PUB_KEYS.date]: todayPlusDaysIsoDate(
				DEFAULT_PUB_PLUS_DAY,
				c.ctx[CTX_KEYS.session].sm[SM_KEYS.cfg].PUBLICATION_TIME_ZONE,
			),
			...this.state.pub,
		};

		this.text =
			(await makeListOfScheduledForDescr(c)) +
			'\n\n----------\n\n' +
			makeCurrentDateTimeStr(c) +
			'\n\n----------\n\n' +
			`${await makeStatePreview(c, this.state.pub)}\n\n` +
			t(c, 'selectDateDescr');

		// const daysBtn = [];
		//
		// for (let i = 3; i <= 6; i++) {
		// 	daysBtn.push({
		// 		id: 'DAY',
		// 		label: makeClosestDayLabel(c, i),
		// 		payload: i,
		// 	});
		// }

		return defineMenu([
			[
				{
					id: 'DAY',
					label: makeClosestDayLabel(c, 0),
					payload: 0,
				},
				{
					id: 'DAY',
					label: makeClosestDayLabel(c, 1),
					payload: 1,
				},
				{
					id: 'DAY',
					label: makeClosestDayLabel(c, 2),
					payload: 2,
				},
			],
			[
				...[3, 4, 5, 6].map((i) => ({
					id: 'DAY',
					label: makeClosestDayLabel(c, i),
					payload: i,
				})),
			],
			// [...daysBtn],
			[
				{
					id: 'backBtn',
					label: t(c, 'backBtn'),
				},
				{
					id: 'cancelBtn',
					label: t(c, 'cancelBtn'),
				},
				editMode && {
					id: 'saveBtn',
					label: t(c, 'saveBtn'),
				},
				{
					id: 'nextBtn',
					label: t(c, 'nextBtn'),
				},
			],
		]);
	}

	async onButtonPress(btnId, payload) {
		if (btnId === 'DAY') {
			return this.go('pub-time', {
				[PUB_KEYS.date]: todayPlusDaysIsoDate(
					payload,
					this.router.c.ctx[CTX_KEYS.session].sm[SM_KEYS.cfg]
						.PUBLICATION_TIME_ZONE,
				),
			});
		}

		switch (btnId) {
			case 'backBtn':
				return this.go('pub-post-setup');
			case 'cancelBtn':
				if (this.state[EDIT_ITEM_NAME])
					return this.go(this.state.editReturnUrl);

				return this.go(TG_HOME_PAGE);
			case 'nextBtn':
				return this.go('pub-time');
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

		const preparedDateStr = c.msg.text.trim().replace(/[\s,]+/g, '.');
		const isoDateStr = normalizeShortDateToIsoDate(
			preparedDateStr,
			c.ctx[CTX_KEYS.session].sm[SM_KEYS.cfg].PUBLICATION_TIME_ZONE,
		);

		if (!isoDateStr) return this.reply(t(c, 'wrongDate'));
		else if (
			isPastDate(
				isoDateStr,
				c.ctx[CTX_KEYS.session].sm[SM_KEYS.cfg].PUBLICATION_TIME_ZONE,
			)
		)
			return this.reply(t(c, 'dateIsPastMessage'));

		return this.go('pub-time', { [PUB_KEYS.date]: isoDateStr });
	}
}
