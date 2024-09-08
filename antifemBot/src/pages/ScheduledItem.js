import { PageBase } from '../PageRouter.js';
import {
	t,
	defineMenu,
	makeStatePreview,
	isUserAdmin,
} from '../helpers/helpers.js';
import {
	doFullFinalPublicationProcess,
	deleteScheduledPost,
} from '../helpers/publishHelpres.js';
import {
	USER_KEYS,
	HOME_PAGE,
	EDIT_ITEM_NAME,
	PUB_KEYS,
	USER_CFG_KEYS,
	USER_PERMISSIONS_KEYS,
	PUB_SCHEDULED_KEYS,
} from '../constants.js';

export class ScheduledItem extends PageBase {
	async renderMenu() {
		const item = this.state[EDIT_ITEM_NAME];

		if (!item) return this.reply(`ERROR: Can't find item to edit`);

		const c = this.router.c;
		const isAdmin = isUserAdmin(this.me);
		const userPerms = this.me[USER_KEYS.cfg][USER_CFG_KEYS.permissions];
		const isAdminOrMyItem =
			isAdmin || item[PUB_KEYS.dbRecord][PUB_SCHEDULED_KEYS.createdByUserId];
		const allowEdit =
			isAdminOrMyItem ||
			userPerms[USER_PERMISSIONS_KEYS.editOthersScheduledPub] ===
				this.me[USER_KEYS.id];
		const allowDelete =
			isAdminOrMyItem ||
			userPerms[USER_PERMISSIONS_KEYS.deleteOthersScheduledPub] ===
				this.me[USER_KEYS.id];
		const allowChangeTime =
			isAdminOrMyItem ||
			userPerms[USER_PERMISSIONS_KEYS.changeTimeOfOthersScheduledPub] ===
				this.me[USER_KEYS.id];
		// do delete pub state in case of cancel btn pressed
		delete this.state.pub;

		this.text =
			t(c, 'scheduledItemDescr') + `\n\n${await makeStatePreview(c, item)}`;

		return defineMenu([
			[
				allowDelete && {
					id: 'deleteSchuduledBtn',
					label: t(c, 'deleteSchuduledBtn'),
				},
				allowEdit && {
					id: 'editSchuduledBtn',
					label: t(c, 'editSchuduledBtn'),
				},
			],
			allowChangeTime && [
				{
					id: 'changeDateTimeBtn',
					label: t(c, 'changeDateTimeBtn'),
				},
			],
			[
				{
					id: 'publicateNowBtn',
					label: t(c, 'publicateNowBtn'),
				},
				{
					id: 'showPreviewBtn',
					label: t(c, 'showPreviewBtn'),
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
			case 'changeDateTimeBtn':
				return this.router.go('pub-date');
			case 'publicateNowBtn':
				await doFullFinalPublicationProcess(c, this.state[EDIT_ITEM_NAME]);
				await this.reply(
					t(c, 'scheduledItemWasPublished') +
						`:\n\n${await makeStatePreview(c, this.state[EDIT_ITEM_NAME])}`,
				);

				return this.router.go('scheduled-list');
			case 'deleteSchuduledBtn':
				await deleteScheduledPost(
					c,
					this.state[EDIT_ITEM_NAME][PUB_KEYS.dbRecord][PUB_SCHEDULED_KEYS.id],
				);
				await this.reply(
					t(c, 'scheduledItemWasDeleted') +
						`:\n\n${await makeStatePreview(c, this.state[EDIT_ITEM_NAME])}`,
				);

				return this.router.go('scheduled-list');
			case 'editSchuduledBtn':
				return this.router.go('pub-content');
			case 'showPreviewBtn':
				await this.printFinalPost(
					this.me[USER_KEYS.tgChatId],
					this.state[EDIT_ITEM_NAME],
				);

				return this.router.reload();
			case 'toListBtn':
				return this.router.go('scheduled-list');
			case 'toHomeBtn':
				return this.router.go(HOME_PAGE);
			default:
				return false;
		}
	}
}
