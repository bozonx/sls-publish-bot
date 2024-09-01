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
import { KV_KEYS, PUB_KEYS } from '../constants.js';

export class PubTags extends PubPageBase {
	async mount() {
		const c = this.router.c;
		const allTags = await loadFromKv(c, KV_KEYS.tags, []);

		const notSelectedTags = allTags.filter(
			(i) => !this.state.pub?.[PUB_KEYS.tags]?.includes(i),
		);

		this.text = `${makeStatePreview(c, this.state.pub)}\n\n${t(c, 'selectTagsDescr')}`;
		this.menu = defineMenu([
			...generateTagsButtons(notSelectedTags, this.tagSelectCallback),
			this.state.pub?.[PUB_KEYS.tags]?.length && [
				{
					id: 'clearTagsBtn',
					label: t(c, 'clearTagsBtn'),
					cb: () => this.reload({ [PUB_KEYS.tags]: null }),
				},
			],
			[
				{
					id: 'backBtn',
					label: t(c, 'backBtn'),
					cb: () => this.go('pub-author'),
				},
				{
					id: 'toHomeBtn',
					label: t(c, 'toHomeBtn'),
					cb: () => this.go('home'),
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
		const allTags = await loadFromKv(c, KV_KEYS.tags, []);
		const mergedAllTags = _.uniq([...allTags, ...newTags]).sort();
		// save new tags to storage
		await saveToKv(c, KV_KEYS.tags, mergedAllTags);

		const mergedSelectedTags = _.uniq([
			...(this.state.pub?.[PUB_KEYS.tags] || []),
			...newTags,
		]);

		await this.go('pub-date', { [PUB_KEYS.tags]: mergedSelectedTags });
	}

	tagSelectCallback = async (payload) => {
		const mergedAllTags = _.uniq([
			...(this.state.pub?.[PUB_KEYS.tags] || []),
			payload,
		]);

		return this.reload({ [STATE_KEYS.tags]: mergedAllTags });
	};
}
