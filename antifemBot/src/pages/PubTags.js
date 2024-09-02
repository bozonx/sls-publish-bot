import _ from 'lodash';
import { PubPageBase } from '../PubPageBase.js';
import {
	t,
	makeStatePreview,
	parseTagsFromInput,
	defineMenu,
	loadFromKv,
	saveToKv,
} from '../helpers.js';
import { KV_KEYS, PUB_KEYS } from '../constants.js';

export class PubTags extends PubPageBase {
	async renderMenu() {
		const c = this.router.c;
		const allTags = await loadFromKv(c, KV_KEYS.tags, []);

		const notSelectedTags = allTags.filter(
			(i) => !this.state.pub?.[PUB_KEYS.tags]?.includes(i),
		);

		this.text = `${makeStatePreview(c, this.state.pub)}\n\n${t(c, 'selectTagsDescr')}`;

		return defineMenu([
			...notSelectedTags.map((tag) => [
				{
					id: 'TAG',
					label: tag,
					payload: tag,
				},
			]),
			this.state.pub?.[PUB_KEYS.tags]?.length && [
				{
					id: 'clearTagsBtn',
					label: t(c, 'clearTagsBtn'),
				},
			],
			[
				{
					id: 'backBtn',
					label: t(c, 'backBtn'),
				},
				{
					id: 'cancelBtn',
					label: t(c, 'cancelBtn'),
				},
				{
					id: 'nextBtn',
					label: t(c, 'nextBtn'),
				},
			],
		]);
	}

	async onButtonPress(btnId, payload) {
		if (btnId === 'TAG') {
			const mergedAllTags = _.uniq([
				...(this.state.pub?.[PUB_KEYS.tags] || []),
				payload,
			]);

			return this.reload({ [PUB_KEYS.tags]: mergedAllTags });
		}

		switch (btnId) {
			case 'clearTagsBtn':
				return this.reload({ [PUB_KEYS.tags]: null });
			case 'backBtn':
				return this.go('pub-author');
			case 'cancelBtn':
				return this.go('home');
			case 'nextBtn':
				return this.go('pub-date');
			default:
				return false;
		}
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
}
