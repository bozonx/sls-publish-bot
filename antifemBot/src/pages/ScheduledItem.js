import { PageBase } from '../PageRouter.js';
import {
	t,
	defineMenu,
	makeStatePreview,
	isUserAdmin,
} from '../helpers/helpers.js';
import {
	doFullFinalPublicationProcess,
	deletePost,
	updatePost,
	convertDbPostToPubState,
	saveEditedPost,
} from '../helpers/publishHelpres.js';
import {
	USER_KEYS,
	HOME_PAGE,
	EDIT_ITEM_NAME,
	PUB_KEYS,
	USER_CFG_KEYS,
	USER_PERMISSIONS_KEYS,
	POST_KEYS,
} from '../constants.js';

export class ScheduledItem extends PageBase {
	async renderMenu() {
		if (this.state.saveIt) await saveEditedPost(this.router);

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

				return this.router.go('conserved-item');
			case 'changeDateTimeBtn':
				this.state.editReturnUrl = 'scheduled-item';

				return this.router.go('pub-date');
			case 'editPostBtn':
				this.state.editReturnUrl = 'scheduled-item';

				return this.router.go('pub-content');
			case 'publicateNowBtn':
				await doFullFinalPublicationProcess(
					c,
					this.state[EDIT_ITEM_NAME],
					// save user who has forcelly publicated this
					this.me[USER_KEYS.id],
				);
				await this.reply(
					t(c, 'scheduledItemWasPublished') +
						`:\n\n${await makeStatePreview(c, this.state[EDIT_ITEM_NAME])}`,
				);

				return this.router.go('scheduled-list');
			case 'deletePostBtn':
				await deletePost(
					c,
					this.state[EDIT_ITEM_NAME][PUB_KEYS.dbRecord][POST_KEYS.id],
				);
				await this.reply(
					t(c, 'scheduledItemWasDeleted') +
						`:\n\n${await makeStatePreview(c, this.state[EDIT_ITEM_NAME])}`,
				);

				return this.router.go('scheduled-list');
			case 'showPostBtn':
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
