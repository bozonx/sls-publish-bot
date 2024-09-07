import { PubPageBase } from '../PubPageBase.js';
import {
	t,
	makeStatePreview,
	parseTagsFromInput,
	defineMenu,
} from '../helpers/helpers.js';
import { breakArray, makeStringArrayUnique } from '../helpers/lib.js';
import { saveEditedScheduledPost } from '../helpers/publishHelpres.js';
import {
	PUB_KEYS,
	DEFAULT_BTN_ITEM_ID,
	HOME_PAGE,
	EDIT_ITEM_NAME,
	DB_TABLE_NAMES,
	TAG_KEYS,
	DEFAULT_SOCIAL_MEDIA,
} from '../constants.js';

export class PubTags extends PubPageBase {
	async renderMenu() {
		const c = this.router.c;
		const allTags = await this.db.getAll(DB_TABLE_NAMES.Tag, {
			[TAG_KEYS.id]: true,
			[TAG_KEYS.name]: true,
		});

		const notSelectedTags = allTags.filter(
			(i) => !this.state.pub?.[PUB_KEYS.tags]?.includes(i[TAG_KEYS.name]),
		);

		this.text = `${makeStatePreview(c, this.state.pub)}\n\n${t(c, 'selectTagsDescr')}`;

		return defineMenu([
			...breakArray(
				notSelectedTags.map((tag) => ({
					id: DEFAULT_BTN_ITEM_ID,
					label: tag[TAG_KEYS.name],
					payload: tag[TAG_KEYS.name],
				})),
				2,
			),
			this.state.pub?.[PUB_KEYS.tags]?.length && [
				{
					id: 'clearTagsBtn',
					label: t(c, 'clearTagsBtn'),
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
				this.state[EDIT_ITEM_NAME] && {
					id: 'saveBtn',
					label: t(c, 'saveBtn'),
				},
				{
					id: 'nextBtn',
					label: t(c, 'nextBtn'),
				},
			],
		]);
	}

	async onButtonPress(btnId, payload) {
		if (btnId === DEFAULT_BTN_ITEM_ID) {
			const mergedAllTags = makeStringArrayUnique([
				...(this.state.pub?.[PUB_KEYS.tags] || []),
				payload,
			]);

			return this.reload({ [PUB_KEYS.tags]: mergedAllTags });
		}

		switch (btnId) {
			case 'clearTagsBtn':
				return this.reload({ [PUB_KEYS.tags]: null });
			case 'backBtn':
				return this.go('pub-content');
			case 'cancelBtn':
				if (this.state[EDIT_ITEM_NAME]) return this.go('scheduled-item');

				return this.go(HOME_PAGE);
			case 'nextBtn':
				return this.go('pub-post-setup');
			case 'saveBtn':
				return saveEditedScheduledPost(this.router);
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
		// // TODO: remake
		// // save new tags to storage
		// await saveToKv(c, KV_KEYS.tags, mergedAllTags);
		//
		// const mergedSelectedTags = makeStringArrayUnique([
		// 	...(this.state.pub?.[PUB_KEYS.tags] || []),
		// 	...newTags,
		// ]);

		await Promise.all(
			newTags.map((tag) =>
				this.db.createItem(DB_TABLE_NAMES.Tag, {
					[TAG_KEYS.name]: tag,
					[TAG_KEYS.socialMedia]: DEFAULT_SOCIAL_MEDIA,
					[TAG_KEYS.createdByUser]: this.me[USER_KEYS.id],
				}),
			),
		);
		await this.go('pub-post-setup', { [PUB_KEYS.tags]: mergedSelectedTags });
	}
}
