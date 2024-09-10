import { PageBase } from '../PageRouter.js';
import {
	t,
	defineMenu,
	makeStatePreview,
	isUserAdmin,
} from '../helpers/helpers.js';
import { deletePost } from '../helpers/publishHelpres.js';
import {
	USER_KEYS,
	HOME_PAGE,
	EDIT_ITEM_NAME,
	PUB_KEYS,
	USER_CFG_KEYS,
	USER_PERMISSIONS_KEYS,
	POST_KEYS,
	CTX_KEYS,
} from '../constants.js';

export class AlreadyPublishedItem extends PageBase {
	async renderMenu() {
		const item = this.state[EDIT_ITEM_NAME];

		if (!item) return this.reply(`ERROR: Can't find item to edit`);

		const c = this.router.c;
		const isAdmin = isUserAdmin(this.me);
		const userPerms = this.me[USER_KEYS.cfg][USER_CFG_KEYS.permissions];
		const isAdminOrMyItem =
			isAdmin ||
			item[PUB_KEYS.dbRecord][POST_KEYS.createdByUserId] ===
				this.me[USER_KEYS.id];
		const allowEdit =
			isAdminOrMyItem ||
			userPerms[USER_PERMISSIONS_KEYS.editOthersScheduledPub];
		const allowDelete =
			isAdminOrMyItem ||
			userPerms[USER_PERMISSIONS_KEYS.deleteOthersScheduledPub];
		// do delete pub state in case of cancel btn pressed
		delete this.state.pub;
		delete this.state.editReturnUrl;

		this.text =
			t(c, 'publishedItemDescr') + `\n\n${await makeStatePreview(c, item)}`;

		return defineMenu([
			[
				allowDelete && {
					id: 'deletePostBtn',
					label: t(c, 'deletePostBtn'),
				},
				allowEdit && {
					id: 'editPostBtn',
					label: t(c, 'editPostBtn'),
				},
			],
			[
				{
					id: 'toListBtn',
					label: t(c, 'toListBtn'),
				},
				{
					id: 'toHomeBtn',
					label: t(c, 'toHomeBtn'),
				},
			],
		]);
	}

	async onButtonPress(btnId) {
		const c = this.router.c;

		switch (btnId) {
			case 'editPostBtn':
				this.state.editReturnUrl = 'published-item';

				return this.router.go('pub-content');
			case 'deletePostBtn':
				const msgId =
					this.state[EDIT_ITEM_NAME][PUB_KEYS.dbRecord][POST_KEYS.pubMsgId];

				await c.api.deleteMessage(
					c.ctx[CTX_KEYS.DESTINATION_CHANNEL_ID],
					Number(msgId),
				);

				await deletePost(
					c,
					this.state[EDIT_ITEM_NAME][PUB_KEYS.dbRecord][POST_KEYS.id],
				);

				await this.reply(
					t(c, 'publishedItemWasDeleted') +
						`:\n\n${await makeStatePreview(c, this.state[EDIT_ITEM_NAME])}`,
				);

				return this.router.go('published-list');
			case 'toListBtn':
				return this.router.go('published-list');
			case 'toHomeBtn':
				return this.router.go(HOME_PAGE);
			default:
				return false;
		}
	}
}
