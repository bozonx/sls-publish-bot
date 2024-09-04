import { PubPageBase } from '../PubPageBase.js';
import {
	t,
	makeStatePreview,
	parseTagsFromInput,
	defineMenu,
	loadFromKv,
	saveToKv,
} from '../helpers.js';
import {
	KV_KEYS,
	PUB_KEYS,
	DEFAULT_BTN_ITEM_ID,
	HOME_PAGE,
	EDIT_ITEM_NAME,
} from '../constants.js';
import { breakArray, makeStringArrayUnique } from '../lib.js';
import { saveEditedScheduledPost } from '../publishHelpres.js';

export class PubTags extends PubPageBase {
	async renderMenu() {
		const c = this.router.c;
		const allTags = await loadFromKv(c, KV_KEYS.tags, []);

		const notSelectedTags = allTags.filter(
			(i) => !this.state.pub?.[PUB_KEYS.tags]?.includes(i),
		);

		this.text = `${makeStatePreview(c, this.state.pub)}\n\n${t(c, 'selectTagsDescr')}`;

		return defineMenu([
			...breakArray(
				notSelectedTags.map((tag) => ({
					id: DEFAULT_BTN_ITEM_ID,
					label: tag,
					payload: tag,
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
		const allTags = await loadFromKv(c, KV_KEYS.tags, []);
		const mergedAllTags = makeStringArrayUnique([
			...allTags,
			...newTags,
		]).sort();
		// save new tags to storage
		await saveToKv(c, KV_KEYS.tags, mergedAllTags);

		const mergedSelectedTags = makeStringArrayUnique([
			...(this.state.pub?.[PUB_KEYS.tags] || []),
			...newTags,
		]);

		await this.go('pub-post-setup', { [PUB_KEYS.tags]: mergedSelectedTags });
	}
}
