import _ from 'lodash';
import { PageBase } from '../PageRouter.js';
import {
	t,
	loadFromKv,
	saveToKv,
	parseTagsFromInput,
	defineMenu,
	makeStatePreview,
} from '../helpers.js';
import { publishFinalPost, generatePostText } from '../publishHelpres.js';
import { KV_KEYS, PUB_KEYS, CTX_KEYS } from '../constants.js';

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
					id: 'toHomeBtn',
					label: t(c, 'toHomeBtn'),
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
			case 'toHomeBtn':
				return this.router.go('home');
			default:
				return false;
		}
	}

	async onMessage() {
		const c = this.router.c;

		if (!c.msg.text) return c.reply('No text');

		const newTags = parseTagsFromInput(c.msg.text);
		const allTags = await loadFromKv(c, KV_KEYS.tags, []);
		const mergedAllTags = _.uniq([...allTags, ...newTags]).sort();
		// save new tags to storage
		await saveToKv(c, KV_KEYS.tags, mergedAllTags);

		await c.reply(`${t(c, 'tagWasAdded')}: ${newTags.join(', ')}`);

		return this.router.reload();
	}

	_showPreview = async () => {
		const c = this.router.c;
		const itemId = this.state.scheduledItem;
		const allItems = await loadFromKv(c, KV_KEYS.scheduled, []);
		const item = allItems.find((i) => i.id === itemId);

		if (!item) return c.reply(`ERROR: Can't find scheduled item "${itemId}"`);

		await publishFinalPost(
			c,
			c.msg.chat.id,
			generatePostText(c, item),
			item[PUB_KEYS.preview],
		);

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
		const allItems = await loadFromKv(c, KV_KEYS.scheduled, []);
		const item = allItems.find((i) => i.id === itemId);

		const { message_id } = await publishFinalPost(
			c,
			c.ctx[CTX_KEYS.DESTINATION_CHANNEL_ID],
			generatePostText(c, item),
			item[PUB_KEYS.preview],
		);

		await this._justDeletePost();

		await c.reply(
			t(c, 'scheduledItemWasPublished') + `:\n\n${makeStatePreview(c, item)}`,
		);

		return this.router.go('scheduled-list');
	};

	_delete = async () => {
		const c = this.router.c;
		const item = await this._justDeletePost();

		await c.reply(
			t(c, 'scheduledItemWasDeleted') + `:\n\n${makeStatePreview(c, item)}`,
		);

		return this.router.go('scheduled-list');
	};

	async _justDeletePost() {
		const c = this.router.c;
		const itemId = this.state.scheduledItem;
		const allItems = await loadFromKv(c, KV_KEYS.scheduled, []);
		const prepared = [...allItems];
		const indexOfItem = prepared.findIndex((i) => i.id === itemId);

		if (indexOfItem < 0) throw c.reply(`ERROR: Can't find scheduled item`);

		// remove selected tag
		prepared.splice(indexOfItem, 1);

		await saveToKv(c, KV_KEYS.scheduled, prepared);

		return allItems[indexOfItem];
	}
}
