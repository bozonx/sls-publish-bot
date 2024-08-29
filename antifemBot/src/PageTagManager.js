import { t } from './helpers.js';
import { PageBase } from './Pager.js';
import { KV_TAGS } from './constants.js';

export class PageTagManager extends PageBase {
	tags;

	async init() {
		// only first time init on app start
	}

	async mount(c, payload) {
		this.text = t(c, 'manageTags');
		this.menu = [];

		let tagsStr;

		try {
			tagsStr = await c.config.KV.get(KV_TAGS);
		} catch (e) {
			return c.reply(`ERROR: Can't read tags. ${e}`);
		}

		this.tags = tagsStr ? JSON.parse(tagsStr) : [];

		for (const tagIndex in this.tags) {
			this.menu.push([
				[
					this.tags[tagIndex],
					async (c) => {
						// remove selected tag
						const preparedTags = [...this.tags];
						// const indexToRemove = preparedTags.indexOf(tagIndex);
						//
						// if (indexToRemove < 0) {
						// 	return c.reply(`ERROR: Can't find tag to remove`);
						// }

						preparedTags.splice(tagIndex, 1);

						try {
							await c.config.KV.put(KV_TAGS, JSON.stringify(preparedTags));
						} catch (e) {
							return c.reply(`ERROR: Can't save tag. ${e}`);
						}

						await c.pager.go('tag-manager');
					},
				],
			]);
		}

		this.menu = [
			...this.menu,
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

		const tag = c.msg.text
			.trim()
			.replace(/[\-\s]/g, '_')
			.replace(/[^\w\d\_]/g, '');
		const tagsStr = JSON.stringify([...this.tags, tag].sort());

		try {
			await c.config.KV.put(KV_TAGS, tagsStr);
		} catch (e) {
			return c.reply(`ERROR: Can't save tag. ${e}`);
		}

		await c.pager.go('tag-manager');
	}
}
