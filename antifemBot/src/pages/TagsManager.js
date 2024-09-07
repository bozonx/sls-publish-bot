import { PageBase } from '../PageRouter.js';
import { t, parseTagsFromInput, defineMenu } from '../helpers/helpers.js';
import { breakArray, makeStringArrayUnique } from '../helpers/lib.js';
import { KV_KEYS, DEFAULT_BTN_ITEM_ID, HOME_PAGE } from '../constants.js';

export class TagsManager extends PageBase {
	async renderMenu() {
		const c = this.router.c;

		// TODO: remake
		const allTags = await loadFromKv(c, KV_KEYS.tags, []);

		this.text = t(c, 'tagsManagerDescr');

		return defineMenu([
			...breakArray(
				allTags.map((tag) => ({
					id: DEFAULT_BTN_ITEM_ID,
					label: tag,
					payload: tag,
				})),
				2,
			),
			[
				{
					id: 'toHomeBtn',
					label: t(c, 'toHomeBtn'),
				},
			],
		]);
	}

	async onButtonPress(btnId, payload) {
		if (btnId === DEFAULT_BTN_ITEM_ID) {
			return this.tagRemoveCallback(payload);
		}

		switch (btnId) {
			case 'backBtn':
				return this.router.go('');
			case 'toHomeBtn':
				return this.router.go(HOME_PAGE);
			default:
				return false;
		}
	}

	async onMessage() {
		const c = this.router.c;

		if (!c.msg.text) return this.reply('No text');

		const newTags = parseTagsFromInput(c.msg.text);
		// TODO: remake
		const allTags = await loadFromKv(c, KV_KEYS.tags, []);
		const mergedAllTags = makeStringArrayUnique([
			...allTags,
			...newTags,
		]).sort();
		// save new tags to storage
		// TODO: remake
		await saveToKv(c, KV_KEYS.tags, mergedAllTags);
		await this.reply(`${t(c, 'tagsWasAdded')}: ${newTags.join(', ')}`);

		return this.router.reload();
	}

	async tagRemoveCallback(payload) {
		const c = this.router.c;
		// TODO: remake
		const allTags = await loadFromKv(c, KV_KEYS.tags, []);
		const prepared = [...allTags];
		const indexOfTag = prepared.indexOf(payload);

		if (indexOfTag < 0) return this.reply(`ERROR: Can't find tag`);
		// remove selected tag
		prepared.splice(indexOfTag, 1);

		// TODO: remake
		await saveToKv(c, KV_KEYS.tags, prepared);
		await this.reply(`${t(c, 'tagWasDeleted')}: ${payload}`);

		return this.router.reload();
	}
}
