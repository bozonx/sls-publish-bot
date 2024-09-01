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
import { KV_KEYS, PUB_KEYS } from '../constants.js';

export class ScheduledItem extends PageBase {
	async mount() {
		const c = this.router.c;
		const itemId = this.state.scheduledItem;
		const allItems = await loadFromKv(c, KV_KEYS.scheduled, []);
		const item = allItems.find((i) => i === itemId);

		if (!item) return c.reply(`ERROR: Can't find scheduled item "${itemId}"`);

		this.text =
			t(c, 'scheduledItemDescr') + `:\n\n${makeStatePreview(c, item)}`;
		this.menu = defineMenu([
			[
				{
					id: 'showPreviewBtn',
					label: t(c, 'showPreviewBtn'),
					cb: this._showPreview,
				},
				{
					id: 'editPostponedBtn',
					label: t(c, 'editPostponedBtn'),
					cb: this._editPost,
				},
				{
					id: 'changeDateTimeBtn',
					label: t(c, 'changeDateTimeBtn'),
					cb: this._changeDateTime,
				},
				{
					id: 'deletePostponedBtn',
					label: t(c, 'deletePostponedBtn'),
					cb: this._delete,
				},
			],
			[
				{
					id: 'backBtn',
					label: t(c, 'backBtn'),
					cb: () => this.go('pub-content'),
				},
				{
					id: 'toHomeBtn',
					label: t(c, 'toHomeBtn'),
					cb: () => this.router.go('home'),
				},
			],
		]);
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

	tagRemoveCallback = async (payload) => {
		const c = this.router.c;
		const allTags = await loadFromKv(c, KV_KEYS.tags, []);
		const prepared = [...allTags];
		const indexOfTag = prepared.indexOf(payload);

		if (indexOfTag < 0) return c.reply(`ERROR: Can't find tag`);
		// remove selected tag
		prepared.splice(indexOfTag, 1);

		await saveToKv(c, KV_KEYS.tags, prepared);
		await c.reply(`${t(c, 'tagWasDeleted')}: ${payload}`);

		return this.router.reload();
	};

	_showPreview = async () => {
		const c = this.router.c;
		const itemId = this.state.scheduledItem;
		const allItems = await loadFromKv(c, KV_KEYS.scheduled, []);
		const item = allItems.find((i) => i === itemId);

		if (!item) return c.reply(`ERROR: Can't find scheduled item "${itemId}"`);

		const text = convertTgEntitiesToTgMdV2(
			item[PUB_KEYS.text],
			item[PUB_KEYS.entities],
		);

		await publishFinalPost(c, c.msg.chat.id, text, item[PUB_KEYS.preview]);
	};

	_editPost = async () => {
		const c = this.router.c;
		const itemId = this.state.scheduledItem;
		const allItems = await loadFromKv(c, KV_KEYS.scheduled, []);
		const item = allItems.find((i) => i === itemId);

		// TODO: add
	};

	_changeDateTime = async () => {
		const c = this.router.c;
		const itemId = this.state.scheduledItem;
		const allItems = await loadFromKv(c, KV_KEYS.scheduled, []);
		const item = allItems.find((i) => i === itemId);

		// TODO: add
	};

	_delete = async () => {
		const c = this.router.c;
		const itemId = this.state.scheduledItem;
		const allItems = await loadFromKv(c, KV_KEYS.scheduled, []);
		const prepared = [...allItems];
		const indexOfItem = prepared.findIndex((i) => i.id === itemId);

		if (indexOfItem < 0) return c.reply(`ERROR: Can't find scheduled item`);
		// remove selected tag
		prepared.splice(indexOfItem, 1);

		await saveToKv(c, KV_KEYS.scheduled, prepared);
		await c.reply(
			t(c, 'scheduledItemWasDeleted') +
				`:\n\n${makeStatePreview(c, allItems[indexOfItem])}`,
		);
	};
}
