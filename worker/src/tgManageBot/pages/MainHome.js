import { PageBase } from '../PageRouter.js';
import { t, defineMenu, makeBlogAndSmName } from '../helpers/helpers.js';
import {
	DB_TABLE_NAMES,
	USER_KEYS,
	DEFAULT_BTN_ITEM_ID,
	TG_HOME_PAGE,
} from '../constants.js';

export class MainHome extends PageBase {
	async renderMenu() {
		const c = this.router.c;

		const workspaces = await this.db.getAll(
			DB_TABLE_NAMES.Workspace,
			// TODO: select id only
			undefined,
			{
				byUserId: this.me[USER_KEYS.id],
			},
		);
		let blogs = [];
		let tgSms = [];
		let tgMsBtns = [];

		if (workspaces?.length) {
			// ['id', 'name']
			blogs = await this.db.getAll(DB_TABLE_NAMES.Blog, undefined, {
				// equals: {
				// 	workspaceId: workspaces.map((i) => i.id),
				// },
				workspaceId: {
					in: workspaces.map((i) => i.id),
				},
			});
		}

		if (blogs?.length) {
			// ['id', 'name']
			tgSms = await this.db.getAll(DB_TABLE_NAMES.SocialMedia, undefined, {
				// TODO: use constant
				type: 'telegram',
				blogId: {
					in: blogs.map((i) => i.id),
				},
			});
		}

		tgMsBtns = tgSms.map((tgSm) => [
			{
				id: DEFAULT_BTN_ITEM_ID,
				label: makeBlogAndSmName(
					tgSm.name,
					blogs.find((i) => i.id === tgSm.blogId).name,
				),
				payload: tgSm.id,
			},
		]);

		this.text = t(c, 'mainHomeDescr');

		return defineMenu([...tgMsBtns]);
	}

	async onButtonPress(btnId, payload) {
		switch (btnId) {
			case DEFAULT_BTN_ITEM_ID:
				const sm = await this.db.getItem(
					DB_TABLE_NAMES.SocialMedia,
					Number(payload),
					// ['name', 'cfg'],
				);
				const blog = await this.db.getItem(
					DB_TABLE_NAMES.Blog,
					sm.blogId,
					// ['name', 'cfg'],
				);

				this.state.sm = {
					id: Number(payload),
					name: sm.name,
					cfg: sm.cfg && JSON.parse(sm.cfg),
					blog: {
						id: blog.id,
						name: blog.name,
					},
				};

				return this.go(TG_HOME_PAGE);
			default:
				return false;
		}
	}
}
