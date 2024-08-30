import _ from 'lodash';
import { PageBase } from '../PageRouter.js';
import {
	t,
	loadDataFromKv,
	saveDataToKv,
	parseTagsFromInput,
	generateTagsButtons,
} from '../helpers.js';
import { KV_KEYS } from '../constants.js';

export class TagsManager extends PageBase {
	tags;

	async mount() {
		const c = this.pager.c;

		this.text = t(c, 'tagsManagerDescr');
		this.tags = await loadDataFromKv(c, KV_KEYS.TAGS, []);
		this.menu = [
			...generateTagsButtons(this.tags, this.tagRemoveCallback),
			[[t(c, 'toHomeBtn'), () => this.pager.go('home', null)]],
		];
	}

	async message() {
		const c = this.pager.c;

		if (!c.msg.text) return c.reply('No text');

		const tags = parseTagsFromInput(c.msg.text);
		const megedTags = _.uniq([...this.tags, ...tags]).sort();

		await saveDataToKv(this.c, KV_KEYS.TAGS, megedTags);
		await this.pager.reload();
	}

	tagRemoveCallback = (index) => {
		return async () => {
			// remove selected tag
			const prepared = [...this.tags];

			prepared.splice(index, 1);

			await saveDataToKv(this.c, KV_KEYS.TAGS, prepared);
			await c.pager.reload();
		};
	};
}
