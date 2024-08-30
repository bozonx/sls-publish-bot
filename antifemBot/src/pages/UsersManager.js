import { t } from './helpers.js';
import { PageBase } from '../PageRouter.js';
import { saveDataToKv } from './helpers.js';
import { KV_KEYS } from './constants.js';

export class UsersManager extends PageBase {
	tags;

	async mount() {
		const c = this.pager.c;
		// const { state } = this.payload;

		this.text = t(c, 'manageUsersDescr');

		const users = c.ctx[CTX_KEYS.USERS];

		this.menu = [
			...users.map((item, index) => [
				[
					`${item.name} | ${item.id}${item.isAdmin ? ' (admin)' : ''}`,
					this.userRemoveCallback(index),
				],
			])[[t(c, 'toHome'), () => this.pager.go('home')]],
		];
	}

	async message() {
		const c = this.pager.c;

		if (!c.msg.text) return c.reply('No text');

		// TODO: add read from special message
		// TODO: read from YAML

		// const tags = parseTagsFromInput(c.msg.text);
		// const megedTags = [...this.tags, ...tags].sort();
		//
		// await saveDataToKv(this.c, KV_KEYS.TAGS, megedTags);
		// await this.pager.reload();
	}

	userRemoveCallback(index) {
		return async () => {
			const users = c.ctx[CTX_KEYS.USERS];
			// remove selected tag
			const prepared = [...users];

			prepared.splice(index, 1);

			await saveDataToKv(this.c, KV_KEYS.USERS, prepared);
			await c.pager.reload();
		};
	}
}
