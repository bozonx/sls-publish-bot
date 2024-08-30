import { t } from './helpers.js';
import { PageBase } from './Pager.js';
import {
	loadTags,
	parseTagsFromInput,
	generateTagsButtons,
} from './helpers.js';
import { KV_TAGS } from './constants.js';

export class PageTagManager extends PageBase {
	tags;

	async init() {
		// only first time init on app start
	}

	async mount(c, payload) {
		this.text = t(c, 'manageTags');
		this.menu = [];
		this.tags = await loadTags(c);

		if (typeof this.tags === 'undefined') {
			return c.reply(`ERROR: Can't read tags. ${e}`);
		}

		this.menu = [
			...generateTagsButtons(c, this.tags, (tagIndex) => async (c) => {
				// remove selected tag
				const preparedTags = [...this.tags];

				preparedTags.splice(tagIndex, 1);

				try {
					await c.config.KV.put(KV_TAGS, JSON.stringify(preparedTags));
				} catch (e) {
					return c.reply(`ERROR: Can't save tag. ${e}`);
				}

				await c.pager.go('pub-author', payload);
			}),
			// row
			[
				// button
				[
					t(c, 'toHome'),
					(c) => {
						c.pager.go('home');
					},
				],
			],
		];
	}

	async unmount(c) {
		//
	}

	async message(c) {
		if (!c.msg.text) return c.reply('No text');

		const tags = parseTagsFromInput(c.msg.text);
		const tagsStr = JSON.stringify([...this.tags, ...tags].sort());

		try {
			await c.config.KV.put(KV_TAGS, tagsStr);
		} catch (e) {
			return c.reply(`ERROR: Can't save tags. ${e}`);
		}

		await c.pager.go('tag-manager');
	}
}
