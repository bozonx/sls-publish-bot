import _ from 'lodash';
import { PageBase } from '../PageRouter.js';
import {
	t,
	makeStatePreview,
	generateTagsButtons,
	parseTagsFromInput,
	defineMenu,
	loadFromKv,
	saveToKv,
} from '../helpers.js';
import { KV_KEYS } from '../constants.js';

const TAG_ID_PREFIX = 'TAG-';

export class PubTags extends PageBase {
	async mount() {
		const c = this.pager.c;
		const allTags = await loadFromKv(c, KV_KEYS.TAGS, []);

		this.text = `${makeStatePreview(c, this.payload.state)}\n\n${t(c, 'selectTagsDescr')}`;
		// TODO: review
		this.tagsButtons = allTags.filter(
			(i) => !this.payload.state?.tags?.includes(i),
		);

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
					cb: () => this.pager.go('home', null),
				},
				{
					id: 'backBtn',
					label: t(c, 'backBtn'),
					cb: () => this.pager.go('pub-author'),
				},
				{
					id: 'nextBtn',
					label: t(c, 'nextBtn'),
					cb: () => this.pager.go('pub-date'),
				},
			],
			this.payload.state?.tags?.length && [
				{
					id: 'clearTagsBtn',
					label: t(c, 'clearTagsBtn'),
					cb: () => c.pager.go('pub-tags', { tags: null }),
				},
			],
		]);
	}

	async onMessage() {
		const c = this.pager.c;

		if (!c.msg.text) return c.reply('No text');

		const newTags = parseTagsFromInput(c.msg.text);
		const allTags = await loadFromKv(c, KV_KEYS.TAGS, []);
		const megedAllTags = _.uniq([...allTags, ...newTags]).sort();
		// save new tags to storage
		await saveToKv(c, KV_KEYS.TAGS, megedAllTags);

		const mergedSelectedTags = _.uniq([
			// TODO: review
			...(this.payload.tags || {}),
			...newTags,
		]).sort();

		await c.pager.go('pub-date', {
			// TODO: лучше передавать полностью
			tags: mergedSelectedTags,
		});
	}

	tagSelectCallback = async (btnId) => {
		const c = this.pager.c;
		const tagName = btnId.substring(TAG_ID_PREFIX.length);
		// TODO: review
		const megedAllTags = _.uniq([...(this.payload.tags || {}), tagName]).sort();

		c.pager.reload({
			tags: megedAllTags,
		});
	};
}
