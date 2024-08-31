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

export class PubTags extends PubPageBase {
	async mount() {
		const c = this.router.c;
		const allTags = await loadFromKv(c, KV_KEYS.TAGS, []);

		const tagsButtons = allTags.filter(
			(i) => !this.state.pub.tags?.includes(i),
		);

		this.text = `${makeStatePreview(c, this.state.pub)}\n\n${t(c, 'selectTagsDescr')}`;
		this.menu = defineMenu([
			...generateTagsButtons(tagsButtons, this.tagSelectCallback),
			this.state.pub?.tags?.length && [
				{
					id: 'clearTagsBtn',
					label: t(c, 'clearTagsBtn'),
					cb: () => this.go('pub-tags', { [STATE_KEYS.tags]: null }),
				},
			],
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
		]);
	}

	async onMessage() {
		const c = this.router.c;

		if (!c.msg.text) return c.reply('No text');

		const newTags = parseTagsFromInput(c.msg.text);
		const allTags = await loadFromKv(c, KV_KEYS.TAGS, []);
		const mergedAllTags = _.uniq([...allTags, ...newTags]).sort();
		// save new tags to storage
		await saveToKv(c, KV_KEYS.TAGS, mergedAllTags);

		const mergedSelectedTags = _.uniq([
			...(this.state.pub?.tags || []),
			...newTags,
		]).sort();

		await this.go('pub-date', { [STATE_KEYS.tags]: mergedSelectedTags });
	}

	tagSelectCallback = async (btnId, payload) => {
		const mergedAllTags = _.uniq([...(this.state.tags || []), payload]).sort();

		return this.reload({ [STATE_KEYS.tags]: mergedAllTags });
	};
}
