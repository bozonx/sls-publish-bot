import _ from 'lodash';
import { PageBase } from '../PageRouter.js';
import {
	t,
	loadFromKv,
	saveToKv,
	parseTagsFromInput,
	defineMenu,
} from '../helpers.js';
import { KV_KEYS } from '../constants.js';

export class TagsManager extends PageBase {
	async renderMenu() {
		const c = this.router.c;
		const allTags = await loadFromKv(c, KV_KEYS.tags, []);

		this.text = t(c, 'tagsManagerDescr');

		return defineMenu([
			...allTags.map((tag) => [
				{
					id: 'TAG',
					label: tag,
					payload: tag,
				},
			]),
			[
				{
					id: 'toHomeBtn',
					label: t(c, 'toHomeBtn'),
				},
			],
		]);
	}

	async onButtonPress(btnId, payload) {
		if (btnId === 'TAG') {
			return this.tagRemoveCallback(payload);
		}

		switch (btnId) {
			case 'backBtn':
				return this.router.go('');
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
}
