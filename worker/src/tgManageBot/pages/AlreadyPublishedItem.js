import { PageBase } from '../PageRouter.js';
import {
	t,
	defineMenu,
	makeStatePreview,
	isUserAdmin,
} from '../helpers/helpers.js';
import {
	deletePost,
	createPost,
	updatePost,
	updateFinalPost,
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
	CTX_KEYS,
	SM_KEYS,
} from '../constants.js';

export class AlreadyPublishedItem extends PageBase {
	async renderMenu() {
		const c = this.router.c;

		if (this.state.saveIt) {
			this.state[EDIT_ITEM_NAME] = this.state.pub;

			try {
				await updateFinalPost(
					c,
					c.ctx[CTX_KEYS.session].sm[SM_KEYS.cfg].DESTINATION_CHANNEL_ID,
					this.state[EDIT_ITEM_NAME][PUB_KEYS.dbRecord][POST_KEYS.pubMsgId],
					this.state[EDIT_ITEM_NAME],
				);
			} catch (e) {
				// skip not found
				if (e.error_code === 400)
					await c.reply(t(c, 'updateNoMsgInDestinationChannel'));
				else throw e;
			}

			await updatePost(c, this.state[EDIT_ITEM_NAME]);
		}

		delete this.state.pub;
		delete this.state.saveIt;
		delete this.state.editReturnUrl;

		const item = this.state[EDIT_ITEM_NAME];

		if (!item) return this.reply(`ERROR: Can't find item to edit`);

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
			t(c, 'publishedItemDescr') + `\n\n${await makeStatePreview(c, item)}`;

		return defineMenu([
			[
				allowDelete && {
					id: 'deletePostBtn',
					label: t(c, 'deletePostBtn'),
				},
				allowDelete && {
					id: 'deleteOnlyDbPostBtn',
					label: t(c, 'deleteOnlyDbPostBtn'),
				},
			],
			[
				{
					id: 'copyPostToConservedBtn',
					label: t(c, 'copyPostToConservedBtn'),
				},
				allowEdit && {
					id: 'editPostBtn',
					label: t(c, 'editPostBtn'),
				},
			],
			[
				{
					id: 'showPublicatedPostBtn',
					label: t(c, 'showPublicatedPostBtn'),
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

				return this.go('pub-content');
			case 'deletePostBtn':
				const copyRes = await c.api.copyMessage(
					// TODO: почему сюда ????
					c.ctx[CTX_KEYS.MAIN_ADMIN_TG_USER_ID],
					c.ctx[CTX_KEYS.session].sm[SM_KEYS.cfg].DESTINATION_CHANNEL_ID,
					this.state[EDIT_ITEM_NAME][PUB_KEYS.dbRecord][POST_KEYS.pubMsgId],
				);
				const copyMsgId = Array.isArray(copyRes)
					? copyRes[0]?.message_id
					: copyRes?.message_id;
				await c.api.sendMessage(
					// TODO: почему сюда ????
					c.ctx[CTX_KEYS.MAIN_ADMIN_TG_USER_ID],
					t(c, 'warnAdminsPostDeletedFromChannel'),
					{
						reply_parameters: { message_id: copyMsgId },
					},
				);

				// delete message in telegram channel
				try {
					await c.api.deleteMessage(
						c.ctx[CTX_KEYS.session].sm[SM_KEYS.cfg].DESTINATION_CHANNEL_ID,
						Number(
							this.state[EDIT_ITEM_NAME][PUB_KEYS.dbRecord][POST_KEYS.pubMsgId],
						),
					);
				} catch (e) {
					// skip not found
					if (e.error_code === 400)
						await c.reply(t(c, 'deleteNoMsgInDestinationChannel'));
					else throw e;
				}

				// delete post from db
				await deletePost(
					c,
					this.state[EDIT_ITEM_NAME][PUB_KEYS.dbRecord][POST_KEYS.id],
				);

				await this.reply(
					t(c, 'publishedItemWasDeleted') +
					`:\n\n${await makeStatePreview(c, this.state[EDIT_ITEM_NAME])}`,
				);

				return this.go('published-list');
			case 'deleteOnlyDbPostBtn':
				await deletePost(
					c,
					this.state[EDIT_ITEM_NAME][PUB_KEYS.dbRecord][POST_KEYS.id],
				);

				await this.reply(
					t(c, 'publishedItemWasDeletedOnlyInDb') +
					`https://t.me/${c.ctx[CTX_KEYS.session].sm[SM_KEYS.cfg].DESTINATION_CHANNEL_NAME}/` +
					this.state[EDIT_ITEM_NAME][PUB_KEYS.dbRecord][POST_KEYS.pubMsgId] +
					`:\n\n${await makeStatePreview(c, this.state[EDIT_ITEM_NAME])}`,
				);

				return this.go('published-list');
			case 'copyPostToConservedBtn':
				const dbRes = await createPost(
					c,
					{
						...this.state[EDIT_ITEM_NAME],
						[PUB_KEYS.date]: null,
						[PUB_KEYS.time]: null,
						[PUB_KEYS.media_group_id]: null,
						[PUB_KEYS.forcePublishedByUserName]: null,
						[PUB_KEYS.chandedTimeByUserName]: null,
						[PUB_KEYS.dbRecord]: {
							...this.state[EDIT_ITEM_NAME][PUB_KEYS.dbRecord],
							[POST_KEYS.pubMsgId]: null,
							[POST_KEYS.updatedByUserId]: null,
							[POST_KEYS.createdByUserId]: this.me[USER_KEYS.id],
						},
					},
					true,
				);

				this.state[EDIT_ITEM_NAME] = convertDbPostToPubState(dbRes);

				return this.go('conserved-item');
			case 'showPublicatedPostBtn':
				await c.api.forwardMessage(
					this.me[USER_KEYS.tgChatId],
					c.ctx[CTX_KEYS.session].sm[SM_KEYS.cfg].DESTINATION_CHANNEL_ID,
					this.state[EDIT_ITEM_NAME][PUB_KEYS.dbRecord][POST_KEYS.pubMsgId],
				);

				return this.reload();
			case 'toListBtn':
				return this.go('published-list');
			case 'toHomeBtn':
				return this.go(TG_HOME_PAGE);
			default:
				return false;
		}
	}
}
