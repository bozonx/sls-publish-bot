import { PageBase } from '../PageRouter.js';
import {
	t,
	defineMenu,
	makeStatePreview,
	isUserAdmin,
	handleEditedPostSave,
} from '../helpers/helpers.js';
import {
	doFullFinalPublicationProcess,
	deletePost,
	updatePost,
	convertDbPostToPubState,
} from '../helpers/publishHelpres.js';
import {
	USER_KEYS,
	TG_HOME_PAGE,
	EDIT_ITEM_NAME,
	PUB_KEYS,
	USER_CFG_KEYS,
	USER_PERMISSIONS_KEYS,
	POST_KEYS,
} from '../constants.js';

export class ScheduledItem extends PageBase {
	async renderMenu() {
		const item = await handleEditedPostSave(this.router);
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

		this.text =
			t(c, 'scheduledItemDescr') + `\n\n${await makeStatePreview(c, item)}`;

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
					id: 'toConservedBtn',
					label: t(c, 'toConservedBtn'),
				},
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
					id: 'showPostBtn',
					label: t(c, 'showPostBtn'),
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
			case 'toConservedBtn':
				// pubTimestampMinutes will be cleared automatically
				const dbRes = await updatePost(c, {
					...this.state[EDIT_ITEM_NAME],
					[PUB_KEYS.date]: null,
					[PUB_KEYS.time]: null,
				});

				this.state[EDIT_ITEM_NAME] = convertDbPostToPubState(dbRes);

				return this.go('conserved-item');
			case 'changeDateTimeBtn':
				this.state.editReturnUrl = 'scheduled-item';

				return this.go('pub-date');
			case 'editPostBtn':
				this.state.editReturnUrl = 'scheduled-item';

				return this.go('pub-content');
			case 'publicateNowBtn':
				await doFullFinalPublicationProcess(
					c,
					this.state[EDIT_ITEM_NAME],
					// save user who has forcelly publicated this
					this.me[USER_KEYS.name],
				);
				await this.reply(
					t(c, 'scheduledItemWasPublished') +
					`:\n\n${await makeStatePreview(c, this.state[EDIT_ITEM_NAME])}`,
				);

				return this.go('scheduled-list');
			case 'deletePostBtn':
				await deletePost(
					c,
					this.state[EDIT_ITEM_NAME][PUB_KEYS.dbRecord][POST_KEYS.id],
				);
				await this.reply(
					t(c, 'scheduledItemWasDeleted') +
					`:\n\n${await makeStatePreview(c, this.state[EDIT_ITEM_NAME])}`,
				);

				return this.go('scheduled-list');
			case 'showPostBtn':
				await this.printFinalPost(
					this.me[USER_KEYS.tgChatId],
					this.state[EDIT_ITEM_NAME],
				);

				return this.reload();
			case 'toListBtn':
				return this.go('scheduled-list');
			case 'toHomeBtn':
				return this.go(TG_HOME_PAGE);
			default:
				return false;
		}
	}
}
