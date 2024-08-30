import { t } from './helpers.js';
import { PageBase } from './Pager.js';
import {
	makePayloadPreview,
	loadTags,
	generateTagsButtons,
	parseTagsFromInput,
} from './helpers.js';
import { KV_TAGS } from './constants.js';

export class PagePubTags extends PageBase {
	tags;
	payload;

	async init() {
		// only first time init on app start
	}

	async mount(c, payload) {
		this.payload = payload;
		this.text = `${makePayloadPreview(c, payload)}\n\n${t(c, 'selectTags')}`;
		this.tags = await loadTags(c);

		if (typeof this.tags === 'undefined') {
			return c.reply(`ERROR: Can't read tags. ${e}`);
		}

		this.menu = [
			// TODO: exclude selected in payload
			...generateTagsButtons(c, this.tags, (tagIndex) => async (c) => {
				c.pager.go('pub-tags', {
					...payload,
					tags: [...(payload.tags || []), c.msg.text],
				});
			}),
			[
				// button
				[
					t(c, 'toHome'),
					(c) => {
						c.pager.go('home');
					},
				],
				[
					t(c, 'back'),
					(c) => {
						c.pager.go('pub-author', payload);
					},
				],

				[
					t(c, 'next'),
					(c) => {
						c.pager.go('pub-date', payload);
					},
				],
			],
		];

		if (payload.tags) {
			this.menu.push([
				[
					t(c, 'cleartags'),
					(c) => {
						const { tags, ...restPayload } = payload;

						c.pager.go('pub-tags', restPayload);
					},
				],
			]);
		}
	}

	async unmount(c) {
		//
	}

	async message(c) {
		if (!c.msg.text) return c.reply('No text');

		const newTags = parseTagsFromInput(c.msg.text);
		// TODO: exclude deplicates
		const allTags = [...this.tags, ...newTags].sort();
		const tagsStr = JSON.stringify(allTags);

		try {
			await c.config.KV.put(KV_TAGS, tagsStr);
		} catch (e) {
			return c.reply(`ERROR: Can't save tags. ${e}`);
		}

		await c.pager.go('pub-date', {
			...this.payload,
			tags: allTags,
		});
	}
}
