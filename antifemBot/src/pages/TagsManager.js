import { PageBase } from '../PageRouter.js';
import {
	t,
	handleTagsFromInputAndSave,
	defineMenu,
} from '../helpers/helpers.js';
import { breakArray } from '../helpers/lib.js';
import {
	DEFAULT_BTN_ITEM_ID,
	HOME_PAGE,
	DB_TABLE_NAMES,
	TAG_KEYS,
} from '../constants.js';

export class TagsManager extends PageBase {
	async renderMenu() {
		const c = this.router.c;
		const allTags = await this.db.getAll(
			DB_TABLE_NAMES.Tag,
			{
				[TAG_KEYS.id]: true,
				[TAG_KEYS.name]: true,
			},
			undefined,
			[{ [TAG_KEYS.name]: 'asc' }],
		);

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

		const newTags = await handleTagsFromInputAndSave(c.msg.text, this.me);

		await this.reply(`${t(c, 'tagsWasAdded')}: ${newTags.join(', ')}`);

		return this.router.reload();
	}
}
