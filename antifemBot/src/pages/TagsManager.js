import { PageBase } from '../PageRouter.js';
import { t, parseTagsFromInput, defineMenu } from '../helpers/helpers.js';
import { breakArray } from '../helpers/lib.js';
import {
	DEFAULT_BTN_ITEM_ID,
	HOME_PAGE,
	DB_TABLE_NAMES,
	TAG_KEYS,
	USER_KEYS,
	DEFAULT_SOCIAL_MEDIA,
} from '../constants.js';

export class TagsManager extends PageBase {
	async renderMenu() {
		const c = this.router.c;
		// TODO: sort
		const allTags = await this.db.getAll(DB_TABLE_NAMES.Tag, {
			[TAG_KEYS.id]: true,
			[TAG_KEYS.name]: true,
		});

		this.text = t(c, 'tagsManagerDescr');

		return defineMenu([
			...breakArray(
				allTags.map((tag) => ({
					id: DEFAULT_BTN_ITEM_ID,
					label: tag[TAG_KEYS.name],
					payload: tag[TAG_KEYS.id],
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
			await this.db.deleteItem(DB_TABLE_NAMES.Tag, Number(payload));

			return this.router.reload();
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
		// // TODO: remake
		// const allTags = await loadFromKv(c, KV_KEYS.tags, []);
		// const mergedAllTags = makeStringArrayUnique([
		// 	...allTags,
		// 	...newTags,
		// ]).sort();
		// // save new tags to storage
		// // TODO: remake
		// await saveToKv(c, KV_KEYS.tags, mergedAllTags);

		await Promise.all(
			newTags.map((tag) =>
				this.db.createItem(DB_TABLE_NAMES.Tag, {
					[TAG_KEYS.name]: tag,
					[TAG_KEYS.socialMedia]: DEFAULT_SOCIAL_MEDIA,
					[TAG_KEYS.createdByUserId]: this.me[USER_KEYS.id],
				}),
			),
		);
		await this.reply(`${t(c, 'tagsWasAdded')}: ${newTags.join(', ')}`);

		return this.router.reload();
	}

	// async _tagRemoveCallback(payload) {
	// 	const c = this.router.c;
	// 	// TODO: remake
	// 	const allTags = await loadFromKv(c, KV_KEYS.tags, []);
	// 	const prepared = [...allTags];
	// 	const indexOfTag = prepared.indexOf(payload);
	//
	// 	if (indexOfTag < 0) return this.reply(`ERROR: Can't find tag`);
	// 	// remove selected tag
	// 	prepared.splice(indexOfTag, 1);
	//
	// 	// TODO: remake
	// 	await saveToKv(c, KV_KEYS.tags, prepared);
	// 	await this.reply(`${t(c, 'tagWasDeleted')}: ${payload}`);
	//
	// 	return this.router.reload();
	// }
}
