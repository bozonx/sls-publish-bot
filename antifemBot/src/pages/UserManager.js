import { t } from './helpers.js';
import { PageBase } from '../PageRouter.js';
import {
	loadDataFromKv,
	saveDataToKv,
	parseTagsFromInput,
	generateTagsButtons,
} from './helpers.js';
import { KV_KEYS } from './constants.js';

export class UserManager extends PageBase {
	tags;

	async mount() {
		const c = this.pager.c;
		// const { state } = this.payload;

		this.text = t(c, 'manageUsersDescr');
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
