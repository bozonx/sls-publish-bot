import _ from 'lodash';
import { PageBase } from '../PageRouter.js';
import {
	t,
	loadFromKv,
	saveToKv,
	parseTagsFromInput,
	generateTagsButtons,
	defineMenu,
} from '../helpers.js';
import { KV_KEYS } from '../constants.js';

const TAG_ID_PREFIX = 'TAG-';

export class TagsManager extends PageBase {
	async mount() {
		const c = this.pager.c;
		const allTags = await loadFromKv(c, KV_KEYS.TAGS, []);

		this.text = t(c, 'tagsManagerDescr');
		this.menu = defineMenu([
			...generateTagsButtons(allTags, this.tagRemoveCallback, TAG_ID_PREFIX),
			[
				{
					id: 'toHomeBtn',
					label: t(c, 'toHomeBtn'),
					cb: () => this.pager.go('home'),
				},
			],
		]);
	}

	async onMessage() {
		const c = this.pager.c;

		if (!c.msg.text) return c.reply('No text');

		const tags = parseTagsFromInput(c.msg.text);
		const allTags = await loadFromKv(c, KV_KEYS.TAGS, []);
		const megedTags = _.uniq([...allTags, ...tags]).sort();

		await saveToKv(c, KV_KEYS.TAGS, megedTags);
		await c.reply(`${t(c, 'tagWasAdded')}: ${tags.join(', ')}`);
		await this.pager.reload();
	}

	tagRemoveCallback = async (btnId, payload) => {
		console.log(1111, payload);

		const c = this.pager.c;
		const tagName = btnId.substring(TAG_ID_PREFIX.length);
		const allTags = await loadFromKv(c, KV_KEYS.TAGS, []);
		const indexOfTag = allTags.indexOf(tagName);

		if (indexOfTag < 0) return c.reply(`ERROR: Can't find tag`);

		// remove selected tag
		allTags.splice(indexOfTag, 1);

		await saveToKv(c, KV_KEYS.TAGS, allTags);
		await c.reply(`${t(c, 'tagWasDeleted')}: ${tagName}`);
		await c.pager.reload();
	};
}
