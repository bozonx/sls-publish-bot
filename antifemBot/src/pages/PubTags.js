import _ from 'lodash';
import { PageBase } from '../PageRouter.js';
import {
	t,
	makeStatePreview,
	generateTagsButtons,
	parseTagsFromInput,
	defineMenu,
} from '../helpers.js';
import { KV_KEYS } from '../constants.js';

const TAG_ID_PREFIX = 'TAG-';

export class PubTags extends PageBase {
	// all the tags from storage
	tags;
	// tags which are shown on buttons
	tagsButtons;

	async mount() {
		const c = this.pager.c;

		this.text = `${makeStatePreview(c, this.payload.state)}\n\n${t(c, 'selectTags')}`;
		this.tags = await loadDataFromKv(c, KV_KEYS.TAGS, []);
		this.tagsButtons = this.tags.filter(
			(i) => !this.payload.state?.tags?.includes(i),
		);

		this.menu = defineMenu([
			...generateTagsButtons(
				this.tagsButtons,
				this.tagSelectCallback,
				TAG_ID_PREFIX,
			),
			[
				[
					{
						id: 'toHomeBtn',
						label: t(c, 'toHomeBtn'),
						cb: () => this.pager.go('home', null),
					},
				],
				[
					{
						id: 'back',
						label: t(c, 'back'),
						cb: () => this.pager.go('pub-author'),
					},
				],
				[
					{
						id: 'next',
						label: t(c, 'next'),
						cb: () => this.pager.go('pub-date'),
					},
				],
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

	async message() {
		const c = this.pager.c;

		if (!c.msg.text) return c.reply('No text');

		const newTags = parseTagsFromInput(c.msg.text);
		const megedAllTags = _.uniq([...this.tags, ...newTags]).sort();
		// save new tags to storage
		await saveDataToKv(c, KV_KEYS.TAGS, megedAllTags);

		const mergedSelectedTags = _.uniq([
			...(this.payload.tags || {}),
			...newTags,
		]).sort();

		await c.pager.go('pub-date', {
			tags: mergedSelectedTags,
		});
	}

	tagSelectCallback = (index) => {
		return async () => {
			const c = this.pager.c;
			const megedAllTags = _.uniq([
				...(this.payload.tags || {}),
				...newTags,
			]).sort();

			c.pager.reload({
				tags: megedAllTags,
			});
		};
	};
}
