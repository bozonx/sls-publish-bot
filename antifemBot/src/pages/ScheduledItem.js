import _ from 'lodash';
import { PageBase } from '../PageRouter.js';
import { t, loadFromKv, defineMenu, makeStatePreview } from '../helpers.js';
import {
	printFinalPost,
	doFullFinalPublicationProcess,
	deleteScheduledPost,
} from '../publishHelpres.js';
import { KV_KEYS, USER_KEYS } from '../constants.js';

export class ScheduledItem extends PageBase {
	async renderMenu() {
		const c = this.router.c;
		const itemId = this.state.scheduledItem;
		const allItems = await loadFromKv(c, KV_KEYS.scheduled, []);
		const item = allItems.find((i) => i.id === itemId);

		if (!item) return c.reply(`ERROR: Can't find scheduled item "${itemId}"`);

		this.text = t(c, 'scheduledItemDescr') + `\n\n${makeStatePreview(c, item)}`;

		return defineMenu([
			[
				{
					id: 'changeDateTimeBtn',
					label: t(c, 'changeDateTimeBtn'),
				},
				{
					id: 'publicateNowBtn',
					label: t(c, 'publicateNowBtn'),
				},
			],
			[
				{
					id: 'deletePostponedBtn',
					label: t(c, 'deletePostponedBtn'),
				},

				{
					id: 'editPostponedBtn',
					label: t(c, 'editPostponedBtn'),
				},
				{
					id: 'showPreviewBtn',
					label: t(c, 'showPreviewBtn'),
				},
			],
			[
				{
					id: 'backBtn',
					label: t(c, 'backBtn'),
				},
				{
					id: 'cancelBtn',
					label: t(c, 'cancelBtn'),
				},
			],
		]);
	}

	async onButtonPress(btnId, payload) {
		switch (btnId) {
			case 'changeDateTimeBtn':
				return this._changeDateTime();
			case 'publicateNowBtn':
				return this._publicateNow();
			case 'deletePostponedBtn':
				return this._delete();
			case 'editPostponedBtn':
				return this._editPost();
			case 'showPreviewBtn':
				return this._showPreview();
			case 'backBtn':
				return this.router.go('scheduled-list');
			case 'cancelBtn':
				return this.router.go('home');
			default:
				return false;
		}
	}

	_showPreview = async () => {
		const c = this.router.c;
		const itemId = this.state.scheduledItem;
		const allItems = await loadFromKv(c, KV_KEYS.scheduled, []);
		const item = allItems.find((i) => i.id === itemId);

		if (!item) return c.reply(`ERROR: Can't find scheduled item "${itemId}"`);

		await printFinalPost(c, this.me[USER_KEYS.id], item);

		return this.router.reload();
	};

	_editPost = async () => {
		const c = this.router.c;
		const itemId = this.state.scheduledItem;
		const allItems = await loadFromKv(c, KV_KEYS.scheduled, []);
		const item = allItems.find((i) => i.id === itemId);

		// TODO: add
	};

	_changeDateTime = async () => {
		const c = this.router.c;
		const itemId = this.state.scheduledItem;
		const allItems = await loadFromKv(c, KV_KEYS.scheduled, []);
		const item = allItems.find((i) => i.id === itemId);

		// TODO: add
	};

	_publicateNow = async () => {
		const c = this.router.c;
		const itemId = this.state.scheduledItem;
		const item = await doFullFinalPublicationProcess(c, itemId);

		await c.reply(
			t(c, 'scheduledItemWasPublished') + `:\n\n${makeStatePreview(c, item)}`,
		);

		return this.router.go('scheduled-list');
	};

	_delete = async () => {
		const c = this.router.c;
		const itemId = this.state.scheduledItem;
		const item = await deleteScheduledPost(c, itemId);

		await c.reply(
			t(c, 'scheduledItemWasDeleted') + `:\n\n${makeStatePreview(c, item)}`,
		);

		return this.router.go('scheduled-list');
	};
}
