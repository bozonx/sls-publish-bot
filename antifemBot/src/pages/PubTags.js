import _ from 'lodash';
import { PubPageBase } from '../PubPageBase.js';
import {
	t,
	makeStatePreview,
	generateTagsButtons,
	parseTagsFromInput,
	defineMenu,
	loadFromKv,
	saveToKv,
} from '../helpers.js';
import { KV_KEYS, STATE_KEYS } from '../constants.js';

const TAG_ID_PREFIX = 'TAG-';

export class PubTags extends PubPageBase {
	async mount() {
		const c = this.router.c;
		const allTags = await loadFromKv(c, KV_KEYS.TAGS, []);

		// TODO: review
		const tagsButtons = allTags.filter(
			(i) => !this.payload.state?.tags?.includes(i),
		);

		this.text = `${makeStatePreview(c, this.state.pub)}\n\n${t(c, 'selectTagsDescr')}`;
		this.menu = defineMenu([
			...generateTagsButtons(
				this.tagsButtons,
				this.tagSelectCallback,
				TAG_ID_PREFIX,
			),
			[
				{
					id: 'toHomeBtn',
					label: t(c, 'toHomeBtn'),
					cb: () => this.go('home'),
				},
				{
					id: 'backBtn',
					label: t(c, 'backBtn'),
					cb: () => this.go('pub-author'),
				},
				{
					id: 'nextBtn',
					label: t(c, 'nextBtn'),
					cb: () => this.go('pub-date'),
				},
			],
			this.payload.state?.tags?.length && [
				{
					id: 'clearTagsBtn',
					label: t(c, 'clearTagsBtn'),
					cb: () => this.go('pub-tags', { [STATE_KEYS.tags]: null }),
				},
			],
		]);
	}

	async onMessage() {
		const c = this.router.c;

		if (!c.msg.text) return c.reply('No text');

		const newTags = parseTagsFromInput(c.msg.text);
		const allTags = await loadFromKv(c, KV_KEYS.TAGS, []);
		const megedAllTags = _.uniq([...allTags, ...newTags]).sort();
		// save new tags to storage
		await saveToKv(c, KV_KEYS.TAGS, megedAllTags);

		const mergedSelectedTags = _.uniq([
			// TODO: review
			...(this.state.pub.tags || {}),
			...newTags,
		]).sort();

		// TODO: лучше передавать полностью
		await this.go('pub-date', { [STATE_KEYS.tags]: mergedSelectedTags });
	}

	tagSelectCallback = async (btnId) => {
		const tagName = btnId.substring(TAG_ID_PREFIX.length);
		// TODO: review
		const megedAllTags = _.uniq([...(this.payload.tags || {}), tagName]).sort();

		return this.reload({ [STATE_KEYS.tags]: megedAllTags });
	};
}
