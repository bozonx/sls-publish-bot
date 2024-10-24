import { PubPageBase } from '../PubPageBase.js';
import {
	t,
	makeStatePreview,
	handleTagsFromInputAndSave,
	defineMenu,
} from '../helpers/helpers.js';
import { breakArray, makeStringArrayUnique } from '../helpers/lib.js';
import {
	DEFAULT_BTN_ITEM_ID,
	TG_HOME_PAGE,
	EDIT_ITEM_NAME,
	DB_TABLE_NAMES,
} from '../constants.js';

export class PubTags extends PubPageBase {
	async renderMenu() {
		const c = this.router.c;
		const pub = this.state.pub;
		const allTags = await this.db.getAll(
			DB_TABLE_NAMES.Tag,
			{
				[TAG_KEYS.id]: true,
				[TAG_KEYS.name]: true,
			},
			{
				socialMediaId: this.state.sm.id,
			},
			[{ [TAG_KEYS.name]: 'asc' }],
		);

		const notSelectedTags = allTags.filter(
			(i) => !pub?.[PUB_KEYS.tags]?.includes(i[TAG_KEYS.name]),
		);

		this.text = `${await makeStatePreview(c, pub)}\n\n${t(c, 'selectTagsDescr')}`;

		return defineMenu([
			...breakArray(
				notSelectedTags.map((tag) => ({
					id: DEFAULT_BTN_ITEM_ID,
					label: tag[TAG_KEYS.name],
					payload: tag[TAG_KEYS.name],
				})),
				2,
			),
			pub?.[PUB_KEYS.tags]?.length && [
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
				if (this.state[EDIT_ITEM_NAME])
					return this.go(this.state.editReturnUrl);

				return this.go(TG_HOME_PAGE);
			case 'nextBtn':
				return this.go('pub-post-setup');
			case 'saveBtn':
				this.state.saveIt = true;

				return this.go(this.state.editReturnUrl);
			default:
				return false;
		}
	}

	async onMessage() {
		const c = this.router.c;

		if (!c.msg.text) return this.reply('No text');

		const newTags = await handleTagsFromInputAndSave(
			this.router,
			c.msg.text,
			this.state.sm.id,
		);
		// add to selected
		const mergedSelectedTags = makeStringArrayUnique([
			...(this.state.pub?.[PUB_KEYS.tags] || []),
			...newTags,
		]);

		await this.go('pub-post-setup', { [PUB_KEYS.tags]: mergedSelectedTags });
	}
}
