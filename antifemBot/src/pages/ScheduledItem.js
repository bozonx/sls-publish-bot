import _ from 'lodash';
import { PageBase } from '../PageRouter.js';
import { t, defineMenu, makeStatePreview } from '../helpers.js';
import {
	doFullFinalPublicationProcess,
	deleteScheduledPost,
} from '../publishHelpres.js';
import { USER_KEYS } from '../constants.js';

export class ScheduledItem extends PageBase {
	async renderMenu() {
		const c = this.router.c;
		const item = this.state.editItem;

		if (!item) return this.reply(`ERROR: Can't find item to edit`);

		this.text = t(c, 'scheduledItemDescr') + `\n\n${makeStatePreview(c, item)}`;

		return defineMenu([
			[
				{
					id: 'editPostponedBtn',
					label: t(c, 'editPostponedBtn'),
				},
				{
					id: 'changeDateTimeBtn',
					label: t(c, 'changeDateTimeBtn'),
				},
			],
			[
				{
					id: 'deletePostponedBtn',
					label: t(c, 'deletePostponedBtn'),
				},
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
					id: 'cancelBtn',
					label: t(c, 'cancelBtn'),
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
				await doFullFinalPublicationProcess(c, this.state.editItem);
				await this.reply(
					t(c, 'scheduledItemWasPublished') +
						`:\n\n${makeStatePreview(c, this.state.editItem)}`,
				);

				return this.router.go('scheduled-list');
			case 'deletePostponedBtn':
				await deleteScheduledPost(c, this.state.editItem.id);
				await this.reply(
					t(c, 'scheduledItemWasDeleted') +
						`:\n\n${makeStatePreview(c, this.state.editItem)}`,
				);

				return this.router.go('scheduled-list');
			case 'editPostponedBtn':
				return this.router.go('pub-content');
			case 'showPreviewBtn':
				await this.printFinalPost(this.me[USER_KEYS.id], this.state.editItem);

				return this.router.reload();
			case 'toListBtn':
				return this.router.go('scheduled-list');
			case 'cancelBtn':
				return this.router.go('home');
			default:
				return false;
		}
	}
}
