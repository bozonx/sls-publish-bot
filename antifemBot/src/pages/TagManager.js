import { t } from './helpers.js';
import { PageBase } from '../PageRouter.js';
import {
	loadDataFromKv,
	saveDataToKv,
	parseTagsFromInput,
	generateTagsButtons,
} from './helpers.js';
import { KV_KEYS, CTX_KEYS } from './constants.js';

export class PageTagManager extends PageBase {
	tags;

	async mount() {
		const c = this.pager.c;
		// const { state } = this.payload;

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
		const tagsStr = JSON.stringify(megedTags);

		try {
			await c.ctx[CTX_KEYS.KV].put(KV_KEYS.TAGS, tagsStr);
		} catch (e) {
			return c.reply(`ERROR: Can't save tags. ${e}`);
		}

		await this.pager.reload();
	}

	tagRemoveCallback = (tagIndex) => {
		return async () => {
			// remove selected tag
			const preparedTags = [...this.tags];

			preparedTags.splice(tagIndex, 1);

			await saveDataToKv(this.c, KV_KEYS.TAGS, preparedTags);
			await c.pager.go('pub-author', payload);
		};
	};
}
