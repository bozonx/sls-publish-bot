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
		const c = this.router.c;
		const item = this.state[EDIT_ITEM_NAME];
		const isAdmin = isUserAdmin(this.me);
		const userPerms = this.me[USER_KEYS.cfg][USER_CFG_KEYS.permissions];
		const allowEdit =
			isAdmin ||
			userPerms[USER_PERMISSIONS_KEYS.editOthersScheduledPub] ||
			item[PUB_KEYS.dbRecord][PUB_SCHEDULED_KEYS.createdByUserId] ===
			this.me[USER_KEYS.id];
		const allowDelete =
			isAdmin ||
			userPerms[USER_PERMISSIONS_KEYS.deleteOthersScheduledPub] ||
			item[PUB_KEYS.dbRecord][PUB_SCHEDULED_KEYS.createdByUserId] ===
			this.me[USER_KEYS.id];
		const allowChandeTime =
			isAdmin ||
			userPerms[USER_PERMISSIONS_KEYS.changeTimeOfOthersScheduledPub] ||
			item[PUB_KEYS.dbRecord][PUB_SCHEDULED_KEYS.createdByUserId] ===
			this.me[USER_KEYS.id];
		// do delete it in case of cancel btn pressed
		delete this.state.pub;

		if (!item) return this.reply(`ERROR: Can't find item to edit`);

		this.text = t(c, 'scheduledItemDescr') + `\n\n${makeStatePreview(c, item)}`;

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
			allowChandeTime && [
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
					`:\n\n${makeStatePreview(c, this.state[EDIT_ITEM_NAME])}`,
				);

				return this.router.go('scheduled-list');
			case 'deleteSchuduledBtn':
				await deleteScheduledPost(
					c,
					this.state[EDIT_ITEM_NAME][PUB_KEYS.dbRecord][PUB_SCHEDULED_KEYS.id],
				);
				await this.reply(
					t(c, 'scheduledItemWasDeleted') +
					`:\n\n${makeStatePreview(c, this.state[EDIT_ITEM_NAME])}`,
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
