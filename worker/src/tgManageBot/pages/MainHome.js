import { PageBase } from '../PageRouter.js';
import { t, defineMenu } from '../helpers/helpers.js';
import {
	DB_TABLE_NAMES,
	EDIT_ITEM_NAME,
	USER_KEYS,
	DEFAULT_BTN_ITEM_ID,
	HOME_PAGE,
} from '../constants.js';

export class MainHome extends PageBase {
	async renderMenu() {
		const c = this.router.c;

		console.log(1111, this.me);

		const workspaces = await this.db.getAll(
			DB_TABLE_NAMES.Workspace,
			// TODO: select id only
			undefined,
			{
				createdByUserId: this.me[USER_KEYS.id],
			},
		);
		let blogs = [];
		let tgSms = [];
		let tgMsBtns = [];

		console.log(2222, workspaces);

		if (workspaces?.length) {
			blogs = this.db.getAll(DB_TABLE_NAMES.Blog, ['id', 'name'], {
				workspaceId: {
					equals: workspaces.map((i) => i.id),
				},
			});
		}

		if (blogs?.length) {
			tgSms = this.db.getAll(DB_TABLE_NAMES.SocialMedia, ['id', 'name'], {
				// TODO: use constant
				type: 'telegram',
				blogId: {
					equals: workspaces.map((i) => i.id),
				},
			});
		}

		tgMsBtns = tgSms.map((tgSm) => [
			{
				id: DEFAULT_BTN_ITEM_ID,
				// TODO: add blog name, and optional name
				label: `${tgSm.id}`,
				payload: tgSm.id,
			},
		]);

		this.text = t(c, 'mainHomeDescr');

		return defineMenu([...tgMsBtns]);
	}

	async onButtonPress(btnId, payload) {
		switch (btnId) {
			case 'manageScheduledBtn':
				this.state.tgSmId = Number(payload);

				return this.go(HOME_PAGE);
			default:
				return false;
		}
	}
}
