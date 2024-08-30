import { t } from './helpers.js';
import { PageBase } from '../PageRouter.js';
import {
	loadDataFromKv,
	saveDataToKv,
	parseTagsFromInput,
	generateTagsButtons,
} from './helpers.js';
import { KV_KEYS } from './constants.js';

export class TagsManager extends PageBase {
	tags;

	async mount() {
		const c = this.pager.c;

		this.text = t(c, 'manageTags');
		this.tags = await loadDataFromKv(c, KV_KEYS.TAGS, []);
		this.menu = [
			...generateTagsButtons(this.tags, this.tagRemoveCallback),
			[[t(c, 'toHome'), () => this.pager.go('home')]],
		];
	}

	async message() {
		const c = this.pager.c;

		if (!c.msg.text) return c.reply('No text');

		const tags = parseTagsFromInput(c.msg.text);
		const megedTags = [...this.tags, ...tags].sort();

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
